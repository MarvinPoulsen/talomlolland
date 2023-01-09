import React, { FC, useRef, useState } from 'react';
import Map from '../components/minimap/Minimap';
import FlexHouseCountTable from '../components/flexhouse/FlexHouseCountTable';
import FlexHouseHistoryChart from '../components/flexhouse/FlexHouseHistoryChart';
import FlexHouseHistoryTable from '../components/flexhouse/FlexHouseHistoryTable';
import '../components/flexhouse/flexhouse.scss';
import {flexhouseMinimapId } from '../../config'

export interface FlexHouseRow {
  id: string;
  navn: string;
  antal: string;
  shape_wkt: { wkt: string };
}

export interface FlexHouseHistoryRow {
  aar: string;
  antal: number;
}

export const flexHouseHistoryData: FlexHouseHistoryRow[] = [
  {
    aar: '2013',
    antal: 28,
  },
  {
    aar: '2014',
    antal: 39,
  },
  {
    aar: '2015',
    antal: 65,
  },
  {
    aar: '2016',
    antal: 70,
  },
  {
    aar: '2017',
    antal: 85,
  },
  {
    aar: '2018',
    antal: 73,
  },
  {
    aar: '2019',
    antal: 37,
  },
  {
    aar: '2020',
    antal: 99,
  },
  {
    aar: '2021',
    antal: 168,
  },
];

const FlexHousePage: FC = () => {
  const minimap: any = useRef(null);
  const [flexHouseData, setFlexHouseData] = useState([]);
  const onMapReady = (mm) => {
    minimap.current = mm;
    const ses = mm.getSession();
    const ds = ses.getDatasource('lk_byg_flex_count_flexboliger');
    ds.execute({ command: 'read' }, function (rows: FlexHouseRow[]) {
      setFlexHouseData(rows);
    });
  };

  return (
    <>
      <div id='flexhouse-tab-content' className='container'>
        <div className='block'>
          <div className='columns'>
            <Map
              id={flexhouseMinimapId}
              name='flexhouse'
              size='is-5'
              onReady={onMapReady}
            />
            <div className='column'>
              <div className='block'>
                <div className='columns'>
                  <div className='column'>
                    <div className='content'>
                      <h6>Aktuelt antal flexboliger inden for området</h6>
                      <FlexHouseCountTable data={flexHouseData} />
                    </div>
                  </div>
                  <div className='column'>
                    <div className='content'>
                      <h6>Antal flexboligtilladelser pr. år</h6>
                      <FlexHouseHistoryTable data={flexHouseHistoryData} />
                    </div>
                  </div>
                </div>
              </div>
              <div className='block flexhouse-chart'>
                      <FlexHouseHistoryChart data={flexHouseHistoryData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default FlexHousePage;
