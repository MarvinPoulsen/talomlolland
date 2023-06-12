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
    Nakskov: [634800, 6076400, 640000, 6080600], // [x1, y1, x2, y2] ~ [minx, miny, maxx, maxy] ~ [left, bottom, right, top]
    Maribo: [659500, 6070800, 663300, 6073800], 
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

const getYearOfConstruction = (data: ResidentAgesRow[], area, dataDate) => {
    const omraade = area;
    const dato = dataDate;
    const before1950 = data.filter((row) => parseInt(row.opfoerselsaar) < 1950);
    const result: object[] = [
        {
            opfoersel: 'before1950',
            omraade,
            age0_19: before1950.reduce((sum, cur) => sum + parseInt(cur.age0_19), 0),
            age20_59: before1950.reduce((sum, cur) => sum + parseInt(cur.age20_59), 0),
            age60_75: before1950.reduce((sum, cur) => sum + parseInt(cur.age60_75), 0),
            age75plus: before1950.reduce((sum, cur) => sum + parseInt(cur.age75plus), 0),
            dato,
        },
    ];
    const between50_59 = data.filter((row) => parseInt(row.opfoerselsaar) >= 1950 && parseInt(row.opfoerselsaar) < 1960);
    result.push({
        opfoersel: 'between50_59',
        omraade,
        age0_19: between50_59.reduce((sum, cur) => sum + parseInt(cur.age0_19), 0),
        age20_59: between50_59.reduce((sum, cur) => sum + parseInt(cur.age20_59), 0),
        age60_75: between50_59.reduce((sum, cur) => sum + parseInt(cur.age60_75), 0),
        age75plus: between50_59.reduce((sum, cur) => sum + parseInt(cur.age75plus), 0),
        dato,
    });
    const between60_69 = data.filter((row) => parseInt(row.opfoerselsaar) >= 1960 && parseInt(row.opfoerselsaar) < 1970);
    result.push({
        opfoersel: 'between60_69',
        omraade,
        age0_19: between60_69.reduce((sum, cur) => sum + parseInt(cur.age0_19), 0),
        age20_59: between60_69.reduce((sum, cur) => sum + parseInt(cur.age20_59), 0),
        age60_75: between60_69.reduce((sum, cur) => sum + parseInt(cur.age60_75), 0),
        age75plus: between60_69.reduce((sum, cur) => sum + parseInt(cur.age75plus), 0),
        dato,
    });
    const between70_79 = data.filter((row) => parseInt(row.opfoerselsaar) >= 1970 && parseInt(row.opfoerselsaar) < 1980);
    result.push({
        opfoersel: 'between70_79',
        omraade,
        age0_19: between70_79.reduce((sum, cur) => sum + parseInt(cur.age0_19), 0),
        age20_59: between70_79.reduce((sum, cur) => sum + parseInt(cur.age20_59), 0),
        age60_75: between70_79.reduce((sum, cur) => sum + parseInt(cur.age60_75), 0),
        age75plus: between70_79.reduce((sum, cur) => sum + parseInt(cur.age75plus), 0),
        dato,
    });
    const between80_89 = data.filter((row) => parseInt(row.opfoerselsaar) >= 1980 && parseInt(row.opfoerselsaar) < 1990);
    result.push({
        opfoersel: 'between80_89',
        omraade,
        age0_19: between80_89.reduce((sum, cur) => sum + parseInt(cur.age0_19), 0),
        age20_59: between80_89.reduce((sum, cur) => sum + parseInt(cur.age20_59), 0),
        age60_75: between80_89.reduce((sum, cur) => sum + parseInt(cur.age60_75), 0),
        age75plus: between80_89.reduce((sum, cur) => sum + parseInt(cur.age75plus), 0),
        dato,
    });
    const between90_99 = data.filter((row) => parseInt(row.opfoerselsaar) >= 1990 && parseInt(row.opfoerselsaar) < 2000);
    result.push({
        opfoersel: 'between90_99',
        omraade,
        age0_19: between90_99.reduce((sum, cur) => sum + parseInt(cur.age0_19), 0),
        age20_59: between90_99.reduce((sum, cur) => sum + parseInt(cur.age20_59), 0),
        age60_75: between90_99.reduce((sum, cur) => sum + parseInt(cur.age60_75), 0),
        age75plus: between90_99.reduce((sum, cur) => sum + parseInt(cur.age75plus), 0),
        dato,
    });
    const after1999 = data.filter((row) => parseInt(row.opfoerselsaar) > 1999);
    result.push({
        opfoersel: 'after1999',
        omraade,
        age0_19: after1999.reduce((sum, cur) => sum + parseInt(cur.age0_19), 0),
        age20_59: after1999.reduce((sum, cur) => sum + parseInt(cur.age20_59), 0),
        age60_75: after1999.reduce((sum, cur) => sum + parseInt(cur.age60_75), 0),
        age75plus: after1999.reduce((sum, cur) => sum + parseInt(cur.age75plus), 0),
        dato,
    });
    return result;
};

const getSummatedData = (data, area, dataDate) => {
    const omraade = area;
    const dato = dataDate;
    const age0_19 = data.reduce((sum, cur) => sum + parseInt(cur.age0_19), 0);
    const age20_59 = data.reduce((sum, cur) => sum + parseInt(cur.age20_59), 0);
    const age60_75 = data.reduce((sum, cur) => sum + parseInt(cur.age60_75), 0);
    const age75plus = data.reduce((sum, cur) => sum + parseInt(cur.age75plus), 0);
    const result: object[] = [
        {
            omraade,
            age0_19,
            age20_59,
            age60_75,
            age75plus,
            dato,
        },
    ];
    return result;
};

// createTablesData
const createTablesData = (data, columnNames, analysisParams, dataDate) => {
    const tablesData: TablesData[] = [];
    for (let i = 0; i < analysisParams.length; i++) {
        const analysisParam = analysisParams[i];
        let tableSum = 0;
        const values: number[] = [];
        for (let i = 0; i < columnNames.length; i++) {
            const columnName = columnNames[i];
            const filteredData = data.length > 0 && data.filter((row) => row.opfoersel === columnName && row.dato === dataDate);
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
    return legendTableData;
};
//createStackedbarData
const createStackedbarData = (data, columnNames, analysisParams) => {
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
    return stackedbarData;
};

const ResidentAgesPage: FC = () => {
    const minimap: any = useRef(null);
    const [residentAgesData, setResidentAgesData] = useState([]);
    const [cityArea, setCityArea] = useState('Nakskov'); // alternativ 'Maribo'
    const [residentialArea, setResidentialArea] = useState(undefined); // alternativ
    const [residentAgesGroups, setResidentAgesGroups] = useState<AnalysisParams[]>([
        { title: '0-19 år', code: 'age0_19', on: true },
        { title: '20-59 år', code: 'age20_59', on: true },
        { title: '60-75 år', code: 'age60_75', on: true },
        { title: '76 og op', code: 'age75plus', on: true },
    ]);
    const [date, setDate] = useState<string>('2023-06-07 00:00:00.0'); //2023-05-26
    const onMapReady = (mm) => {
        minimap.current = mm;
        const ses = mm.getSession();
        const ds = ses.getDatasource('lk_talomlolland_bolig_aar_beboer_alder');
        ds.execute({ command: 'read' }, function (rows: ResidentAgesRow[]) {
            setResidentAgesData(rows);
        });
        mm.getEvents().addListener('FEATURE_SELECTED', function (_e, feature) {
            mm.getMapControl().setMarkingGeometry(feature.wkt, false, null, 3000);
            setResidentialArea(feature.attributes.navn);
        });
        mm.getEvents().addListener('FEATURE_DESELECTED', function (_e) {
            mm.getMapControl().setMarkingGeometry();
            setResidentialArea(undefined);
        });
    };
    const handleCityArea = (event) => {
        setCityArea(event.target.value);
        minimap.current.getMapControl().zoomToExtent(cityExtents[event.target.value]);
        setResidentialArea(undefined);
    };

    const residentialCityFilter = residentAgesData.filter((row) => row.omraade === cityArea);
    const sumData = getSummatedData(residentialCityFilter, cityArea, date);

    const residentialAreaData = residentialArea
        ? residentialCityFilter.filter((row) => row.navn === residentialArea)
        : getSummatedData(residentialCityFilter, cityArea, date);

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
    const residentAgeTableData: LegendTableData[] = createLegendTableData(
        residentialAreaData,
        columnNames,
        residentAgesGroups,
        date
    );

    const onResidentAgeToggle = (rowIndex: number) => {
        const updatedResidentAgesGroups = [...residentAgesGroups];
        updatedResidentAgesGroups[rowIndex].on = !updatedResidentAgesGroups[rowIndex].on;
        setResidentAgesGroups(updatedResidentAgesGroups);
    };

    const residentAgeStackedData = createStackedbarData(residentialAreaData, columnNames, residentAgesGroups);

    const residentAgeStackedbar: HTMLDivElement[] = [];
    for (let i = 0; i < columnNames.length; i++) {
        const columnName = columnNames[i];
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
    const yearOfConductParams = [
        { title: '0-19 år', code: 'age0_19' },
        { title: '20-59 år', code: 'age20_59' },
        { title: '60-75 år', code: 'age60_75' },
        { title: '76 og op', code: 'age75plus' },
    ];
    const yearOfConstructCode: string[] = [
        'before1950',
        'between50_59',
        'between60_69',
        'between70_79',
        'between80_89',
        'between90_99',
        'after1999',
    ];

    const yearOfConstructData = getYearOfConstruction(residentialCityFilter, cityArea, date);
    const yearOfConductData: TablesData[] = createTablesData(
        yearOfConstructData,
        yearOfConstructCode,
        yearOfConductParams,
        date
    );

    return (
        <>
            <div id="residentages-tab-content" className="container hidden">
                <div className="block">
                    <div className="columns">
                        <Map
                            id={residentagesMinimapId}
                            name="residentages"
                            size="is-6"
                            infoDiv="infoview"
                            onReady={onMapReady}
                        />
                        <div id="infoview"></div>
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
                            <div className="block">
                                <div className="content">
                                    <h1>{cityArea}</h1>
                                </div>
                                <div id="year-of-conduct-table" className="year-of-conduct-legend content">
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
                            </div>
                            <div className="block">
                                <div className="content">
                                    <h1>{residentialArea ? residentialArea : 'Hele ' + cityArea + ' området'}</h1>
                                </div>
                                <div className="columns">
                                    <div className="column is-4">
                                        <div id="resident-age-table" className="legend">
                                            <LegendTableMulti
                                                headers={['Aldersgrupper', 'Antal boliger']}
                                                data={residentAgeTableData}
                                                onRowToggle={onResidentAgeToggle}
                                            />
                                        </div>
                                    </div>
                                    <div className="column is-8">
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
