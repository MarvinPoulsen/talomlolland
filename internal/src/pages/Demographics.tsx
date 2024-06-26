import React, { FC, useRef, useState } from 'react';
import PiechartNoLegend, { PiechartData } from '../components/chartjs/PiechartNoLegend';
import PyramidChart, { PyramidDataSeries } from '../components/chartjs/PyramidChart';
import Linechart, { LinechartDataSeries } from '../components/chartjs/Linechart';
import Stackedbar, { StackedDataSeries } from '../components/chartjs/Stackedbar';
import LegendTable from '../components/chartjs/LegendTable';
import Map from '../components/minimap/Minimap';
import '../components/demographics/demographics.scss';
import TableHighligtRow, { TableHighligtRowData } from '../components/tables/TableHighligtRow';
import { demographyMinimapId } from '../../config';

export interface DemographicsRow {
    aldersgruppe: string;
    antal: string;
    dato: string;
    id: string;
    koen: string;
    sogn: string;
    sognekode: string;
    shape_wkt: { wkt: string };
}
const getAgeGroups = (data: DemographicsRow[]) => {
    const uniqueAgeGroupes = [...new Set(data.map((item) => item.aldersgruppe))];
    uniqueAgeGroupes.sort((a, b) => parseInt(a) - parseInt(b));
    return uniqueAgeGroupes.map((item) => {
        return {
            title: item,
            on: true,
        };
    });
};
const getDates = (data: DemographicsRow[]) => {
    const uniqueDates = [...new Set(data.map((item) => item.dato))];
    uniqueDates.sort(
        (a, b) => b.localeCompare(a) //using String.prototype.localCompare()
    );
    return uniqueDates;
};

const getParish = (data: DemographicsRow[]) => {
    const uniqueParish = [...new Set(data.map((item) => item.sogn))];
    uniqueParish.sort(
        (a, b) => b.localeCompare(a) //using String.prototype.localCompare()
    );
    return uniqueParish;
};
interface AgeGroup {
    title: string;
    on: boolean;
}
const DemographicsPage: FC = () => {
    const minimap: any = useRef(null);
    const [demographicsData, setDemographicsData] = useState<DemographicsRow[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [parishCode, setParishCode] = useState('');
    const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
    const onMapReady = (mm) => {
        minimap.current = mm;
        const ses = mm.getSession();
        const ds = ses.getDatasource('lk_talomlolland_aldersfordeling');
        ds.execute({ command: 'read' }, function (rows: DemographicsRow[]) {
            setDemographicsData(rows);
            setSelectedDate(getDates(rows)[0]);
            setAgeGroups(getAgeGroups(rows));
        });
        mm.getEvents().addListener('FEATURE_SELECTED', function (_e, feature) {
            mm.getMapControl().setMarkingGeometry(feature.wkt, false, null, 3000);
            setParishCode(feature.attributes.sognekode.toString());
        });
        mm.getEvents().addListener('FEATURE_DESELECTED', function (_e) {
            mm.getMapControl().setMarkingGeometry();
            setParishCode('');
        });
    };

    const parishList = getParish(demographicsData);
    const parishData = demographicsData.filter((row) => row.sognekode === parishCode);
    const legendData: PiechartData[] = [];
    for (let i = 0; i < ageGroups.length; i++) {
        const ageGroup = ageGroups[i];
        legendData.push({
            name: ageGroup.title,
            value: parishData
                .filter((row) => row.aldersgruppe === ageGroup.title && row.dato === selectedDate)
                .reduce((sum, cur) => sum + parseInt(cur.antal), 0),
            on: ageGroup.on,
        });
    }
    const lollandData: PiechartData[] = [];
    for (let i = 0; i < ageGroups.length; i++) {
        const ageGroup = ageGroups[i];
        lollandData.push({
            name: ageGroup.title,
            value: demographicsData
                .filter((row) => row.aldersgruppe === ageGroup.title && row.dato === selectedDate)
                .reduce((sum, cur) => sum + parseInt(cur.antal), 0),
            on: ageGroup.on,
        });
    }
    interface PyramidData {
        ageGroup: string;
        male: number;
        female: number;
    }
    const pyradmidData: PyramidData[] = [];
    const parishMaleAge: number[] = [];
    const parishFemaleAge: number[] = [];
    const lollandMaleAge: number[] = [];
    const lollandFemaleAge: number[] = [];
    for (let i = 0; i < ageGroups.length; i++) {
        const ageGroup = ageGroups[i];
        pyradmidData.push({
            ageGroup: ageGroup.title,
            male: parishData
                .filter((row) => row.aldersgruppe === ageGroup.title && row.koen === 'M' && row.dato === selectedDate)
                .reduce((sum, cur) => sum + parseInt(cur.antal) * -1, 0),
            female: parishData
                .filter((row) => row.aldersgruppe === ageGroup.title && row.koen === 'K' && row.dato === selectedDate)
                .reduce((sum, cur) => sum + parseInt(cur.antal), 0),
        });
        parishMaleAge.push(
            parishData
                .filter((row) => row.aldersgruppe === ageGroup.title && row.koen === 'M' && row.dato === selectedDate)
                .reduce((sum, cur) => sum + parseInt(cur.antal) * -1, 0)
        );
        parishFemaleAge.push(
            parishData
                .filter((row) => row.aldersgruppe === ageGroup.title && row.koen === 'K' && row.dato === selectedDate)
                .reduce((sum, cur) => sum + parseInt(cur.antal), 0)
        );
        lollandMaleAge.push(
            demographicsData
                .filter((row) => row.aldersgruppe === ageGroup.title && row.koen === 'M' && row.dato === selectedDate)
                .reduce((sum, cur) => sum + parseInt(cur.antal) * -1, 0)
        );
        lollandFemaleAge.push(
            demographicsData
                .filter((row) => row.aldersgruppe === ageGroup.title && row.koen === 'K' && row.dato === selectedDate)
                .reduce((sum, cur) => sum + parseInt(cur.antal), 0)
        );
    }

    const pyradmidDataParish: PyramidDataSeries[] = [
        {
            name: 'Mænd',
            values: parishMaleAge.slice().reverse(),
        },
        {
            name: 'Kvinder',
            values: parishFemaleAge.slice().reverse(),
        },
    ];
    const pyradmidDataLolland: PyramidDataSeries[] = [
        {
            name: 'Mænd',
            values: lollandMaleAge.slice().reverse(),
        },
        {
            name: 'Kvinder',
            values: lollandFemaleAge.slice().reverse(),
        },
    ];
    interface DemographyData {
        label: string;
        male: number;
        female: number;
    }
    const dates = getDates(demographicsData);
    //Label til timeseries
    const labels: string[] = [];
    const month: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
    for (let i = 0; i < dates.length; i++) {
        const d = new Date(dates[i]);
        const m = month[d.getMonth()];
        const y = d.getFullYear();
        const label = m + ' ' + y;
        labels.push(label);
    }

    const demographyData: DemographyData[] = [];
    const male: number[] = [];
    const female: number[] = [];
    const citizens: number[] = [];
    const parishMale: number[] = [];
    const parishFemale: number[] = [];
    const parishCitizens: number[] = [];
    for (let i = 0; i < dates.length; i++) {
        const datefilter = dates[i];
        demographyData.push({
            label: labels[i],
            male: demographicsData
                .filter((row) => row.sognekode === parishCode && row.dato === datefilter && row.koen === 'M')
                .reduce((sum, cur) => sum + parseInt(cur.antal), 0),
            female: demographicsData
                .filter((row) => row.sognekode === parishCode && row.dato === datefilter && row.koen === 'K')
                .reduce((sum, cur) => sum + parseInt(cur.antal), 0),
        });

        male.push(
            demographicsData
                .filter((row) => row.dato === datefilter && row.koen === 'M')
                .reduce((sum, cur) => sum + parseInt(cur.antal), 0)
        );
        female.push(
            demographicsData
                .filter((row) => row.dato === datefilter && row.koen === 'K')
                .reduce((sum, cur) => sum + parseInt(cur.antal), 0)
        );
        citizens.push(
            demographicsData.filter((row) => row.dato === datefilter).reduce((sum, cur) => sum + parseInt(cur.antal), 0)
        );
        parishMale.push(
            demographicsData
                .filter((row) => row.sognekode === parishCode && row.dato === datefilter && row.koen === 'M')
                .reduce((sum, cur) => sum + parseInt(cur.antal), 0)
        );
        parishFemale.push(
            demographicsData
                .filter((row) => row.sognekode === parishCode && row.dato === datefilter && row.koen === 'K')
                .reduce((sum, cur) => sum + parseInt(cur.antal), 0)
        );
        parishCitizens.push(
            demographicsData
                .filter((row) => row.sognekode === parishCode && row.dato === datefilter)
                .reduce((sum, cur) => sum + parseInt(cur.antal), 0)
        );
    }
    const categories: string[] = labels.slice().reverse();
    const dataSeriesParish: StackedDataSeries[] = [
        {
            name: 'Mænd',
            values: parishMale.slice().reverse(),
            stack: '0',
        },
        {
            name: 'Kvinder',
            values: parishFemale.slice().reverse(),
            stack: '0',
        },
    ];
    const dataSeriesParishSum: LinechartDataSeries[] = [
        {
            name: 'Borgere',
            values: parishCitizens.slice().reverse(),
        },
    ];
    const dataSeriesLolland: StackedDataSeries[] = [
        {
            name: 'Mænd',
            values: male.slice().reverse(),
            stack: '0',
        },
        {
            name: 'Kvinder',
            values: female.slice().reverse(),
            stack: '0',
        },
    ];
    const dataSeriesLollandSum: LinechartDataSeries[] = [
        {
            name: 'Borgere',
            values: citizens.slice().reverse(),
        },
    ];

    const onLegendRowToggle = (rowIndex: number) => {
        const updatedAgeGroup = [...ageGroups];
        updatedAgeGroup[rowIndex].on = !updatedAgeGroup[rowIndex].on;
        setAgeGroups(updatedAgeGroup);
    };
    const demographicsSelectedDate = demographicsData.filter((row) => row.dato === selectedDate);

    const TableHighligtData: TableHighligtRowData[] = [];
    for (let i = 0; i < parishList.length; i++) {
        const parishData = demographicsSelectedDate.filter((row) => row.sogn === parishList[i]);
        const males = parishData.filter((row) => row.koen === 'M');
        const females = parishData.filter((row) => row.koen === 'K');
        TableHighligtData.push({
            name: parishList[i],
            malePreschool: males.filter((row) => row.aldersgruppe === '0-5').reduce((sum, cur) => sum + parseInt(cur.antal), 0),
            maleSchooler: males.filter((row) => row.aldersgruppe === '6-17').reduce((sum, cur) => sum + parseInt(cur.antal), 0),
            maleAdult: males.filter((row) => row.aldersgruppe === '18-64').reduce((sum, cur) => sum + parseInt(cur.antal), 0),
            maleSenior: males.filter((row) => row.aldersgruppe === '65-79').reduce((sum, cur) => sum + parseInt(cur.antal), 0),
            maleOld: males.filter((row) => row.aldersgruppe === '80+').reduce((sum, cur) => sum + parseInt(cur.antal), 0),
            male: males.reduce((sum, cur) => sum + parseInt(cur.antal), 0),
            femalePreschool: females
                .filter((row) => row.aldersgruppe === '0-5')
                .reduce((sum, cur) => sum + parseInt(cur.antal), 0),
            femaleSchooler: females
                .filter((row) => row.aldersgruppe === '6-17')
                .reduce((sum, cur) => sum + parseInt(cur.antal), 0),
            femaleAdult: females
                .filter((row) => row.aldersgruppe === '18-64')
                .reduce((sum, cur) => sum + parseInt(cur.antal), 0),
            femaleSenior: females
                .filter((row) => row.aldersgruppe === '65-79')
                .reduce((sum, cur) => sum + parseInt(cur.antal), 0),
            femaleOld: females.filter((row) => row.aldersgruppe === '80+').reduce((sum, cur) => sum + parseInt(cur.antal), 0),
            female: females.reduce((sum, cur) => sum + parseInt(cur.antal), 0),
            bothGenders: parishData.reduce((sum, cur) => sum + parseInt(cur.antal), 0),
        });
    }

    const selectedParish = demographicsData.find((item) => item.sognekode === parishCode);
    const description1 =
        selectedParish && selectedParish.sognekode !== ''
            ? 'Antal borgere i ' + selectedParish.sogn + ' fordelt på aldersgrupper'
            : 'Klik i kortet og få vist aldersfordelingen for det valgte sogn';
    const description2 =
        selectedParish && selectedParish.sognekode !== ''
            ? 'Udviklingen i aldersfordelingen for ' + selectedParish.sogn
            : 'Udviklingen i aldersfordelingen for det valgte sogn';
    return (
        <>
            <div id="demography-tab-content" className="container hidden">
                <div className="block">
                    <div className="columns">
                        <Map id={demographyMinimapId} name="demography" size="is-6" infoDiv="infoview" onReady={onMapReady} />
                        <div id="infoview"></div>
                        <div className="column is-6">
                            <article className="message is-info">
                                <div className="message-header">
                                    <p id="demography-sogn-text">{description1}</p>
                                </div>
                                <div className="message-body">
                                    <div className="block">
                                        <div className="columns">
                                            <div className="column is-4">
                                                <PiechartNoLegend
                                                    data={legendData}
                                                    visibility={legendData.map((item) => item.on)}
                                                />
                                            </div>
                                            <div id="js-legend" className="column is-4">
                                                <LegendTable
                                                    headers={['Aldersgrupper', 'Antal']}
                                                    data={legendData}
                                                    onRowToggle={onLegendRowToggle}
                                                />
                                            </div>
                                            <div className="column is-4 pyramid-chart">
                                                <PyramidChart
                                                    categories={ageGroups.map((item) => item.title)}
                                                    dataSeries={pyradmidDataParish}
                                                    bgColorsStart={9}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="block">
                                        <p id="demography-sogn-text2">{description2}</p>
                                        <div className="columns">
                                            <div className="column is-half demography-stackedbar">
                                                <Stackedbar
                                                    categories={categories}
                                                    dataSeries={dataSeriesParish}
                                                    bgColorsStart={9}
                                                    legendPosition={'top'}
                                                />
                                            </div>
                                            <div className="column is-half demography-deltagraph">
                                                <Linechart
                                                    title={'Antal borgere'}
                                                    categories={categories}
                                                    dataSeries={dataSeriesParishSum}
                                                    borderColorStart={12}
                                                    fill={true}
                                                    tension={0.1}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>

                <article className="message is-dark">
                    <div className="message-header">
                        <p>Aktuelt antal borgere i Lolland Kommune fordelt på aldersgrupper</p>
                    </div>
                    <div className="message-body">
                        <div className="columns">
                            <div className="block column is-half">
                                <div className="columns">
                                    <div className="column is-4">
                                        <PiechartNoLegend data={lollandData} visibility={lollandData.map((item) => item.on)} />
                                    </div>
                                    <div id="demography-lolland-table" className="column is-4">
                                        <LegendTable
                                            headers={['Alder', 'Antal']}
                                            data={lollandData}
                                            onRowToggle={onLegendRowToggle}
                                        />
                                    </div>
                                    <div className="column is-4 pyramid-chart">
                                        <PyramidChart
                                            categories={ageGroups.map((item) => item.title)}
                                            dataSeries={pyradmidDataLolland}
                                            bgColorsStart={9}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="block column is-half">
                                <div className="columns">
                                    <div className="column is-half demography-stackedbar">
                                        <Stackedbar
                                            categories={categories}
                                            dataSeries={dataSeriesLolland}
                                            bgColorsStart={9}
                                            legendPosition={'top'}
                                        />
                                    </div>
                                    <div className="column demography-deltagraph">
                                        <Linechart
                                            title={'Antal borgere'}
                                            categories={categories}
                                            dataSeries={dataSeriesLollandSum}
                                            borderColorStart={12}
                                            fill={true}
                                            tension={0.1}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                <div className="block">
                    <div id="demography-table" className="block">
                        <TableHighligtRow
                            categories={[
                                {
                                    name: ' ',
                                    index: 0,
                                },
                                {
                                    name: 'Mænd',
                                    index: 6,
                                },
                                {
                                    name: 'Kvinder',
                                    index: 12,
                                },
                                {
                                    name: ' ',
                                    index: 13,
                                },
                            ]}
                            headers={[
                                'Sogn',
                                '0-5 år',
                                '6-17 år',
                                '18-64 år',
                                '65-80 år',
                                '+80 år',
                                'I alt',
                                '0-5 år',
                                '6-17 år',
                                '18-64 år',
                                '65-80 år',
                                '+80 år',
                                'I alt',
                                'SUM',
                            ]}
                            data={TableHighligtData.slice().reverse()}
                            selectedRow={selectedParish ? selectedParish.sogn : ''}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
export default DemographicsPage;
