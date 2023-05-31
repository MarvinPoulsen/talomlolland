import React, { FC, useRef, useState } from 'react';
import Map from '../components/minimap/Minimap';
import Table, { TableData } from '../components/tables/Table';
import Stackedbar, {
  StackedDataSeries,
} from '../components/chartjs/Stackedbar';
import '../components/accidents/accidents.scss';
import {accidentsMinimapId } from '../../config'

export interface AccidentsRow {
  aar: number;
  alv_tilskadekomne: number;
  areal_ha: number;
  bloede_trafikanter: number;
  draebte: number;
  id: number;
  let_tilskadekomne: number;
  navn: string;
  sognekode: number;
  uhelds_count: number;
  uskadte: number;
  shape_wkt: { wkt: string };
}
export interface InvolvedRow {
  aar: number;
  navn: string;
  sognekode: number;
  alcohol: number;
}
export interface StackedBarData {
  title: string;
  categories: string[];
  dataSeries: {
    name: string;
    data: number[];
    stack: string;
  }[];
}
export interface ParishData {
  aar: number;
  alv_tilskadekomne: number;
  bloede_trafikanter: number;
  draebte: number;
  let_tilskadekomne: number;
  uhelds_count: number;
  uskadte: number;
  areal_ha?: number;
  id?: number;
  navn?: string;
  sognekode?: number;
  shape_wkt?: { wkt: string };
}

const getYears = (data: AccidentsRow[]) => {
  const uniqueYears = [...new Set(data.map((item) => item.aar))];
  uniqueYears.sort((a, b) => a - b);
  return uniqueYears.map((item) => {
    return item;
  });
};
const AccidentsPage: FC = () => {
  const minimap: any = useRef(null);
  const [accidentsData, setAccidentsData] = useState([]);
  const [parishCode, setParishCode] = useState('');
  const [years, setYears] = useState([]);
  const [involvedData, setInvolvedData] = useState([]);
  const onMapReady = (mm) => {
    minimap.current = mm;
    const ses = mm.getSession();
    const ds = ses.getDatasource('lk_pv_vej_accidents_parish');
    ds.execute({ command: 'read' }, function (rows: AccidentsRow[]) {
      setAccidentsData(rows);
      setYears(getYears(rows));
    });
    const dsInvolved = ses.getDatasource('lk_pv_vej_accident_involved');
    dsInvolved.execute(
      { command: 'read' },
      function (involvedRows: InvolvedRow[]) {
        setInvolvedData(involvedRows);
      }
    );
    mm.getEvents().addListener('FEATURE_SELECTED', function (_e, feature) {
      mm.getMapControl().setMarkingGeometry(feature.wkt, false, null, 3000);
      setParishCode(feature.attributes.sognekode.toString());
    });
    mm.getEvents().addListener('FEATURE_DESELECTED', function (_e) {
      mm.getMapControl().setMarkingGeometry();
      setParishCode('');
    });
  };
  const sumParishData: ParishData[] = [];
  for (let i = 0; i < years.length; i++) {
    const year = years[i];
    sumParishData.push({
      aar: year,
      alv_tilskadekomne: accidentsData
        .filter((row) => row.aar === year)
        .reduce((sum, cur) => sum + parseInt(cur.alv_tilskadekomne), 0),
      bloede_trafikanter: accidentsData
        .filter((row) => row.aar === year)
        .reduce((sum, cur) => sum + parseInt(cur.bloede_trafikanter), 0),
      draebte: accidentsData
        .filter((row) => row.aar === year)
        .reduce((sum, cur) => sum + parseInt(cur.draebte), 0),
      let_tilskadekomne: accidentsData
        .filter((row) => row.aar === year)
        .reduce((sum, cur) => sum + parseInt(cur.let_tilskadekomne), 0),
      uhelds_count: accidentsData
        .filter((row) => row.aar === year)
        .reduce((sum, cur) => sum + parseInt(cur.uhelds_count), 0),
      uskadte: accidentsData
        .filter((row) => row.aar === year)
        .reduce((sum, cur) => sum + parseInt(cur.uskadte), 0),
    });
  }

  const parishData = accidentsData.filter(
    (row) => row.sognekode === parishCode
  );
  const parishInvolvedData =
    parishCode && parishCode !== ''
      ? involvedData.filter((row) => row.sognekode === parishCode)
      : involvedData;

  const alcoholData: TableData[] = [];
  alcoholData.push({
    name: 'Promille',
    value: parishInvolvedData.reduce((sum, obj) => {
      if (obj.alcohol === '1') {
        return sum + 1;
      }
      return sum;
    }, 0),
  });
  alcoholData.push({
    name: 'Ædru',
    value: parishInvolvedData.reduce((sum, obj) => {
      if (obj.alcohol === '0') {
        return sum + 1;
      }
      return sum;
    }, 0),
  });

  const title: string =
    parishCode && parishCode !== ''
      ? parishData[0].navn +' Sogn'
      : 'Hele Lolland Kommune';
  const categories: string[] = years;
  const dataSeries: StackedDataSeries[] = [
    {
      name: 'Uskadte',
      values:
        parishCode && parishCode !== ''
          ? parishData.map((row) => row.uskadte)
          : sumParishData.map((row) => row.uskadte),
      stack: '0',
    },
    {
      name: 'Let tilskadekommende',
      values:
        parishCode && parishCode !== ''
          ? parishData.map((row) => row.let_tilskadekomne)
          : sumParishData.map((row) => row.let_tilskadekomne),
      stack: '0',
    },
    {
      name: 'Alvorlig tilskadekomne',
      values:
        parishCode && parishCode !== ''
          ? parishData.map((row) => row.alv_tilskadekomne)
          : sumParishData.map((row) => row.alv_tilskadekomne),
      stack: '0',
    },
    {
      name: 'Dræbte',
      values:
        parishCode && parishCode !== ''
          ? parishData.map((row) => row.draebte)
          : sumParishData.map((row) => row.draebte),
      stack: '0',
    },
    {
      name: 'Bløde trafikanter',
      values:
        parishCode && parishCode !== ''
          ? parishData.map((row) => row.bloede_trafikanter)
          : sumParishData.map((row) => row.bloede_trafikanter),
      stack: '1',
    },
  ];
  const selectedParish = accidentsData.find(
    (item) => item.sognekode === parishCode
  );
  const description1 =
    selectedParish && selectedParish.sognekode !== ''
      ? 'Alkohol i forbindelse med uheld for ' + selectedParish.navn + ' Sogn'
      : 'Alkohol i forbindelse med uheld for Lolland Kommune';
  return (
    <>
      <div id="accidents-tab-content" className="container hidden">
        <div className="block">
          <div className="columns">
              <Map
                id={accidentsMinimapId}
                name="accidents"
                size="is-6"
                onReady={onMapReady}
              />
            <div className="column is-6">
              <article className="message is-dark">
                <div className="message-header">
                  <p>Uheld</p>
                </div>
          <div className="message-body">
                <div className="block accident-stackedbar">
                  <Stackedbar
                    title={title}
                    categories={categories}
                    dataSeries={dataSeries}
                    bgColorsStart={2}
                    legendPosition={'right'}
                    omittedFromSum={'Bløde trafikanter'}
                  />
                </div>
                  <div className="block">
                  <h2>{description1}</h2>

                <div className="columns">
                  <div className="column is-half">
                    <Table 
                      headers={['Tilstand', 'Antal']} 
                      data={alcoholData} 
                    />
                  </div>
                  <div className="column content">
                    <p>Gruppen af "Ædru" indeholder både personer der er testet for alkohol påvirkning, hvor resultatet var nul og personer der ikke er blevet testet.</p>
                  </div>
                </div>
                </div>
          </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AccidentsPage;
