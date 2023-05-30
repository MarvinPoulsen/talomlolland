import React, { FC, useRef, useState } from 'react';
import Map from '../components/minimap/Minimap';
import { residentagesMinimapId } from '../../config';
import Tables, { TablesData } from '../components/tables/Tables';
import StackedbarNoLegend, { StackedDataSeries } from '../components/chartjs/StackedbarNoLegend';
import LegendTableMulti, { LegendTableData } from '../components/chartjs/LegendTableMulti';
import '../components/residentages/residentages.scss';

//INTERFACES
export interface ResidentAgesRow {
    id: string;
    dato: string;
    omraade: string;
    opfoerselsaar: string;
    navn: string;
    age0_19: string;
    age20_59: string;
    age60_75: string;
    age75plus: string;
    age0_19old: string;
    age20_59old: string;
    age60_75old: string;
    age75plus_old: string;
    shape_wkt: { wkt: string };
}
interface AnalysisParams {
    title: string;
    code: string;
    on: boolean;
}
interface StackedbarData {
    [key: string]: StackedDataSeries[];
}

//CONSTANTS
const cityExtents = {
    Nakskov: [634872, 6075272, 641315, 6080602], // [x1, y1, x2, y2] ~ [minx, miny, maxx, maxy] ~ [left, bottom, right, top]
    Maribo: [658889, 6069513, 665332, 6074843],
}; 

//FUNCTIONS
// using map() method to create a new array epopulated with dates. With new Set() method creates a collection of unique values (dates)
const getDates = (data: ResidentAgesRow[]) => {
    const uniqueDates = [...new Set(data.map((item) => item.dato))];
    uniqueDates.sort(
        (a, b) => a.localeCompare(b) //using String.prototype.localCompare() abc...
    );

    return uniqueDates;
};
// createTablesData
const createTablesData = (data, columnNames, analysisParams, dataDate) => {
    console.log('data: ',data)
    console.log('columnNames: ',columnNames)
    console.log('analysisParams: ',analysisParams)
    console.log('date: ',dataDate)
    const tablesData: TablesData[] = [];
    for (let i = 0; i < analysisParams.length; i++) {
        const analysisParam = analysisParams[i];
        let tableSum = 0;
        const values: number[] = [];
        for (let i = 0; i < columnNames.length; i++) {
            const columnName = columnNames[i];
            const filteredData = data.length > 0 && data.filter((row) => row.omraade === columnName && row.dato === dataDate);
            const value: number = filteredData && parseInt(filteredData[0][analysisParam.code]);
            tableSum += value;
            values.push(value);
        }
        values.push(tableSum);

        tablesData.push({
            name: analysisParam.title,
            values: values,
        });
    }
    return tablesData;
};
// createLegendTableData
const createLegendTableData = (data, columnNames, analysisParams, date) => {
    const legendTableData: LegendTableData[] = [];
    for (let i = 0; i < analysisParams.length; i++) {
        const analysisParam = analysisParams[i];
        let tableSum = 0;
        const values: number[] = [];
        for (let i = 0; i < columnNames.length; i++) {
            const columnName = columnNames[i];
            const filteredData = data.length > 0 && data.filter((row) => row.omraade === columnName && row.dato === date);
            const value: number = filteredData && parseInt(filteredData[0][analysisParam.code]);
            tableSum += value;
            values.push(value);
        }
        values.push(tableSum);
        legendTableData.push({
            name: analysisParam.title,
            values: values,
            on: analysisParam.on,
        });
    }
    // console.log('legendTableData: ',legendTableData)
    return legendTableData;
};
//createStackedbarData
const createStackedbarData = (data, columnNames, analysisParams) => {
    // console.log('data: ',data)
    // console.log('columnNames: ',columnNames)
    // console.log('analysisParams: ',analysisParams)
    const stackedbarData: StackedbarData = {};
    for (let i = 0; i < columnNames.length; i++) {
        const columnName = columnNames[i];
        const omraadeData = data
            .filter((row) => row.omraade === columnName)
            .sort((r1, r2) => {
                const d1 = new Date(r1.dato);
                const d2 = new Date(r2.dato);
                return d1.getTime() - d2.getTime();
            });

        stackedbarData[columnName] = [];
        for (let k = 0; k < analysisParams.length; k++) {
            const code = analysisParams[k].code;
            stackedbarData[columnName].push({
                name: analysisParams[k].title,
                values: omraadeData.map((item) => item[code]),
                stack: '0',
            });
        }
    }
    
    // console.log('stackedbarData: ',stackedbarData)
    return stackedbarData;
};

const ResidentAgesPage: FC = () => {
    const minimap: any = useRef(null);
    const [residentAgesData, setResidentAgesData] = useState([]);
    const [cityArea, setCityArea] = useState('Nakskov'); // alternativ 'Maribo'
    const [residentialArea, setResidentialArea] = useState(''); // alternativ 'Maribo'
    const [residentAgesGroups, setResidentAgesGroups] = useState<AnalysisParams[]>([
        { title: '0-19 år', code: 'age0_19', on: true },
        { title: '20-59 år', code: 'age20_59', on: true },
        { title: '60-75 år', code: 'age60_75', on: true },
        { title: '76 og op', code: 'age75plus', on: true },
    ]);
    const [date, setDate] = useState<string>('2023-05-26 00:00:00.0'); //2023-05-26
    const onMapReady = (mm) => {
        minimap.current = mm;
        const ses = mm.getSession();
        const ds = ses.getDatasource('lk_talomlolland_bolig_aar_beboer_alder');
        ds.execute({ command: 'read' }, function (rows: ResidentAgesRow[]) {
            setResidentAgesData(rows);
        });
        mm.getEvents().addListener('FEATURE_SELECTED', function (_e, feature) {
            // console.log('clickonMap: ', feature);
            mm.getMapControl().setMarkingGeometry(feature.wkt, false, null, 3000);
            setResidentialArea(feature.attributes.navn);
        });
        mm.getEvents().addListener('FEATURE_DESELECTED', function (_e) {
            mm.getMapControl().setMarkingGeometry();
            setResidentialArea('');
        });
    };
    const handleCityArea = (event) => {
        setCityArea(event.target.value);
        minimap.current.getMapControl().zoomToExtent(cityExtents[event.target.value]);
    };

    const residentialCityFilter = residentAgesData.filter((row) => row.omraade === cityArea);
    const residentAgesDateFilter = residentialCityFilter.filter((row) => row.dato === date);

    const residentialAreaData = residentAgesDateFilter.filter((row) => row.navn === residentialArea);

    // const filteredData = data.length > 0 && data.filter((row) => row.omraade === cityArea && row.dato === date);

    // console.log('residentialAreaData: ', residentialAreaData);

    const columnNames: string[] = [''];
    columnNames[0] = cityArea;

    const dates = getDates(residentAgesData);
    
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

    // DATA
    // Boligtype
    const residentAgeTableData:LegendTableData[] = createLegendTableData(residentialAreaData, columnNames, residentAgesGroups, date);

    const onResidentAgeToggle = (rowIndex: number) => {
        const updatedResidentAgesGroups = [...residentAgesGroups];
        updatedResidentAgesGroups[rowIndex].on = !updatedResidentAgesGroups[rowIndex].on;
        setResidentAgesGroups(updatedResidentAgesGroups);
    };

    const residentAgeStackedData = createStackedbarData(residentialAreaData, columnNames, residentAgesGroups);

    const residentAgeStackedbar: HTMLDivElement[] = [];
    for (let i = 0; i < columnNames.length; i++) {
        const columnName = columnNames[i];
        // console.log('labels: ',labels)
        // console.log('residentAgeStackedData: ',residentAgeStackedData)
        // console.log('residentAgesGroups: ',residentAgesGroups)
        residentAgeStackedbar.push(
            <div className="column is-6 resident-age-stackedbar" key={columnName}>
                <StackedbarNoLegend
                    //   title={cityArea}
                    categories={labels}
                    dataSeries={residentAgeStackedData[columnName]}
                    visibility={residentAgesGroups.map((item) => item.on)}
                />
            </div>
        );
    }

    // Boligområder
    const residentialAreas: string[] = [];

    const residentialAreaParams = [
        { title: '0-19 år', code: 'age0_19' },
        { title: '20-59 år', code: 'age20_59' },
        { title: '60-75 år', code: 'age60_75' },
        { title: '76 og op', code: 'age75plus' },
    ];

    // getAreas(residentialAreaData);
    const yearOfConductData = createTablesData(residentialAreaData, columnNames, residentialAreaParams, date);

    return (
        <>
            <div id="residentages-tab-content" className="container hidden">
                <div className="block">
                    <div className="columns">
                        <Map id={residentagesMinimapId} name="residentages" size="is-6" onReady={onMapReady} />
                        <div className="column is-6">
                            <div className="field is-grouped">
                                <div className="control">
                                    <button
                                        className={
                                            cityArea === 'Nakskov' ? 'button is-info is-active' : 'button is-info is-light'
                                        }
                                        onClick={handleCityArea}
                                        value="Nakskov"
                                    >
                                        Nakskov
                                    </button>
                                </div>
                                <div className="control">
                                    <button
                                        className={
                                            cityArea === 'Maribo' ? 'button is-info is-active' : 'button is-info is-light'
                                        }
                                        onClick={handleCityArea}
                                        value="Maribo"
                                    >
                                        Maribo
                                    </button>
                                </div>
                            </div>
                            <div className="block blue">
                                    <div className="content">
                                        <h1>{cityArea}</h1>
                                    </div>
                                    <div className="columns">
                                        <div id="year-of-conduct-table" className="year-of-conduct-legend column is-full purple">
                                            <Tables
                                                headers={[
                                                    'Aldersgruppe',
                                                    'Før 1950',
                                                    '1950-1959',
                                                    '1960-1969',
                                                    '1970-1979',
                                                    '1980-1989',
                                                    '1990-1999',
                                                    'Efter 1999',
                                                    'I alt',
                                                ]}
                                                data={yearOfConductData}
                                            />
                                        </div>
                                        {/* <div className="column">
                                            <div className="content">
                                                <p>
                                                    Egnethed til beboelse beregnes udfra BBR, Kode for Kondemneret boligenhed
                                                    (BoligKondemKode) fra enhedsniveauet
                                                </p>
                                                <p>Samt Lolland Kommunes egne registreringer af nedrevne boliger</p>
                                            </div>
                                        </div> */}
                                    </div>
                            </div>
                            <div className="block yellow">
                                <div className="columns">
                                    <div className="column is-4 red">
                                        <div id="resident-age-table" className="legend">
                                            <LegendTableMulti
                                                headers={['Aldersgrupper', 'Antal boliger']}
                                                data={residentAgeTableData}
                                                onRowToggle={onResidentAgeToggle}
                                            />
                                        </div>
                                    </div>
                                    <div className="column is-8 green">
                                        <div className="columns">{residentAgeStackedbar}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ResidentAgesPage;
