import React, { FC, useRef, useState } from 'react';
import { villagesOneMinimapId, villagesTwoMinimapId } from '../../config';
import Map from '../components/minimap/Minimap';
import PiechartNoLegend, { PiechartData } from '../components/chartjs/PiechartNoLegend';
import LegendTableMulti, { LegendTableData } from '../components/chartjs/LegendTableMulti';
import HorizontalStackedbarNoLegend, { StackedDataSeries } from '../components/chartjs/HorizontalStackedbarNoLegend';

//INTERFACES
export interface VillagesRow {
    id: string;
    navn: string;
    dato: Date;
    varmeinstallation: string;
    total_count: number;
    samlerhvervareal: number;
    bygningenssamlboligareal: number;
    shape_wkt: { wkt: string };
}

interface AnalysisParams {
    title: string;
    on: boolean;
}

//CONSTANTS
const colorStartIndex: number = 13; //starter ved index 13 i arraysne i colors.tsx

const cityExtents = {
    // udbredelse kortet skal zoome til ved valg af område
    // [x1, y1, x2, y2] ~ [minx, miny, maxx, maxy] ~ [left, bottom, right, top]
    Nørreballe: [655000, 6074700, 657100, 6076500],
    Stokkemarke: [650800, 6078700, 652900, 6079700],
    Dannemare: [639850, 6069800, 642400, 6070800],
    Hunseby: [660700, 6074400, 662520, 6075400],
    Sandby: [632680, 6082800, 634400, 6083400],
    Langø: [629100, 6075340, 630120, 6076400],
    Errindlev: [660400, 6060300, 661400, 6061450],
    Hillested: [656500, 6069300, 658000, 6071500],
    Lolland: [623104, 6050048, 666521, 6101760],
};

const villages: string[] = [
    'Nørreballe',
    'Stokkemarke',
    'Dannemare',
    'Hunseby',
    'Sandby',
    'Langø',
    'Errindlev',
    'Hillested',
    'Lolland',
];
const columnKeys: string[] = ['total_count', 'bygningenssamlboligareal', 'samlerhvervareal'];
const barCatagories: string[] = ['bygningenssamlboligareal', 'samlerhvervareal'];
const mapThemes: string[] = [
    'theme-lk_talomlolland_fjernvarme_view',
    'theme-lk_talomlolland_elvarme_view',
    'theme-lk_talomlolland_biobraendsel_view',
    'theme-lk_talomlolland_olie_view',
    'theme-lk_talomlolland_andet_view',
];
const mapLollandThemes: string[] = [
    'theme-lk_talomlolland_fjernvarme_view_lol',
    'theme-lk_talomlolland_elvarme_view_lol',
    'theme-lk_talomlolland_biobraendsel_view_lol',
    'theme-lk_talomlolland_olie_view_lol',
    'theme-lk_talomlolland_andet_view_lol',
];

// FUNCTIONS
const isRegionLolland = (currentMap) => {
    currentMap.getTheme('theme-lk_talomlolland_invert_landsbyafgr').hide();
    currentMap.getTheme('theme-lk_talomlolland_landsbyafgraensning').hide();
    handlemapLollandThemes(currentMap);
};

const isNotRegionLolland = (currentMap) => {
    currentMap.getTheme('theme-lk_talomlolland_invert_landsbyafgr').show();
    currentMap.getTheme('theme-lk_talomlolland_landsbyafgraensning').show();
    for (const element of mapLollandThemes) {
        currentMap.getTheme([element]).hide();
    }
};

const handlemapLollandThemes = (currentMap) => {
    for (const [index, element] of mapThemes.entries()) {
        if (currentMap.getTheme([element]).isVisible()) {
            currentMap.getTheme(mapLollandThemes[index]).show();
        } else {
            currentMap.getTheme(mapLollandThemes[index]).hide();
        }
    }
};

const createLegendTableData = (data, dataKeys, analysisParams) => {
    const legendTableData: LegendTableData[] = [];
    for (let i = 0; i < analysisParams.length; i++) {
        const analysisParam = analysisParams[i];

        let tableSum = 0;
        const values: number[] = [];
        for (let i = 0; i < dataKeys.length; i++) {
            const dataKey = dataKeys[i];
            const findData = data.find((item) => item.varmeinstallation === analysisParam.title);
            const value: number = findData && findData[dataKey] ? parseInt(findData[dataKey]) : 0;
            tableSum += dataKey === 'total_count' ? 0 : value;
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

const createPiechartData = (data, analysisParams) => {
    const piechartData: PiechartData[] = [];
    for (let i = 0; i < analysisParams.length; i++) {
        const analysisParam = analysisParams[i];
        const findData = data.find((item) => item.varmeinstallation === analysisParam.title);
        const value: number = findData && findData ? parseInt(findData['total_count']) : 0;

        piechartData.push({
            name: analysisParam.title,
            value,
            on: analysisParam.on,
        });
    }
    return piechartData;
};

//createStackedbarData
const createStackedbarData = (data, barCatagories, analysisParams) => {
    const filteredParams = analysisParams.filter((item) => item.on).map((item) => item.title);
    const filteredData = data.filter((item) => filteredParams.includes(item.varmeinstallation));
    const stackedbarData: StackedDataSeries[] = [];
    for (let i = 0; i < analysisParams.length; i++) {
        const analysisParam = analysisParams[i];
        const findData = filteredData.find((item) => item.varmeinstallation === analysisParam.title);
        const values: number[] = [];

        for (let j = 0; j < barCatagories.length; j++) {
            const barCatagory = barCatagories[j];
            const value: number = findData && findData[barCatagory] ? parseInt(findData[barCatagory]) : 0;
            const colSum = filteredData.reduce(
                (accumulator, object) => accumulator + parseInt(object[barCatagory] ? object[barCatagory] : 0),
                0
            );
            const percentage: number = (value / colSum) * 100;
            values.push(percentage);
        }
        stackedbarData.push({
            name: analysisParam.title,
            values,
            stack: '0',
        });
    }
    return stackedbarData;
};

const VillagesPage: FC = () => {
    const minimap: any = useRef(null);
    const minimapTwo: any = useRef(null);
    const [villagesData, setVillagesData] = useState<VillagesRow[]>([]);
    const [villagesAreaOne, setVillagesAreaOne] = useState('Nørreballe'); // bruges til valg af område i øverste graf/kort - default value sat
    const [villagesAreaTwo, setVillagesAreaTwo] = useState('Stokkemarke'); // bruges til valg af område i nederste graf/kort - default value sat
    const [villagesParams, setVillagesParams] = useState<AnalysisParams[]>([
        { title: 'Fjernvarme/blokvarme', on: true },
        { title: 'Elvarme/Varmepumpe', on: true },
        { title: 'Biobrændsel', on: true },
        { title: 'Olie', on: true },
        { title: 'Andet', on: true },
    ]);
    const onMapReady = (mm) => {
        minimap.current = mm;
        const ses = mm.getSession();
        const ds = ses.getDatasource('lk_talomlolland_landsbyer');
        ds.execute({ command: 'read' }, function (rows: VillagesRow[]) {
            setVillagesData(rows);
        });
    };
    const onMapReadyTwo = (mmTwo) => {
        minimapTwo.current = mmTwo;
        const ses = mmTwo.getSession();
        const ds = ses.getDatasource('lk_talomlolland_landsbyer');
        ds.execute({ command: 'read' }, function (rows: VillagesRow[]) {
            setVillagesData(rows);
        });
    };
    const handleVillagesAreaOne = (event) => {
        setVillagesAreaOne(event.target.value);
        if (event.target.value === 'Lolland') {
            isRegionLolland(minimap.current);
        } else {
            isNotRegionLolland(minimap.current);
        }
        minimap.current.getMapControl().zoomToExtent(cityExtents[event.target.value]);
    };
    const handleVillagesAreaTwo = (event) => {
        setVillagesAreaTwo(event.target.value);
        if (event.target.value === 'Lolland') {
            isRegionLolland(minimapTwo.current);
        } else {
            isNotRegionLolland(minimapTwo.current);
        }
        minimapTwo.current.getMapControl().zoomToExtent(cityExtents[event.target.value]);
    };
    const handleThemeToggle = (event) => {
        console.log('event: ', event);
        const theme = mapThemes[event];
        minimap.current.getTheme(theme).toggle();
        minimapTwo.current.getTheme(theme).toggle();
        if (villagesAreaOne === 'Lolland') {
            const themeLolland = mapLollandThemes[event];
            minimap.current.getTheme(themeLolland).toggle();
        } else if (villagesAreaTwo === 'Lolland') {
            const themeLolland = mapLollandThemes[event];
            minimapTwo.current.getTheme(themeLolland).toggle();
        }
    };

    const villagesOneFilter = villagesData.filter((row) => row.navn === villagesAreaOne);
    const villagesTwoFilter = villagesData.filter((row) => row.navn === villagesAreaTwo);

    // console.log('villagesTwoFilter: ', villagesTwoFilter);
    const firstButtonRow: JSX.Element[] = [];
    for (let i = 0; i < villages.length; i++) {
        const village = villages[i];
        if (village !== villagesAreaTwo) {
            firstButtonRow.push(
                <div className="control" key={village}>
                    <button
                        className={villagesAreaOne === village ? 'button is-info is-active' : 'button is-info is-light'}
                        onClick={handleVillagesAreaOne}
                        value={village}
                    >
                        {village}
                    </button>
                </div>
            );
        }
    }
    const secondButtonRow: JSX.Element[] = [];
    for (let i = 0; i < villages.length; i++) {
        const village = villages[i];
        if (village !== villagesAreaOne) {
            secondButtonRow.push(
                <div className="control" key={village}>
                    <button
                        className={villagesAreaTwo === village ? 'button is-info is-active' : 'button is-info is-light'}
                        onClick={handleVillagesAreaTwo}
                        value={village}
                    >
                        {village}
                    </button>
                </div>
            );
        }
    }

    const villagesOneTableData = createLegendTableData(villagesOneFilter, columnKeys, villagesParams);
    const villagesTwoTableData = createLegendTableData(villagesTwoFilter, columnKeys, villagesParams);
    const onVillagesToggle = (rowIndex: number) => {
        const updatedVillagesParams = [...villagesParams];
        updatedVillagesParams[rowIndex].on = !updatedVillagesParams[rowIndex].on;
        setVillagesParams(updatedVillagesParams);
        handleThemeToggle(rowIndex);
    };
    const villagesOnePiechartData = createPiechartData(villagesOneFilter, villagesParams);
    const villagesTwoPiechartData = createPiechartData(villagesTwoFilter, villagesParams);
    const villagesOneBarchartData = createStackedbarData(villagesOneFilter, barCatagories, villagesParams);
    const villagesTwoBarchartData = createStackedbarData(villagesTwoFilter, barCatagories, villagesParams);

    return (
        <>
            <div id="residentages-tab-content" className="container hidden">
                <div className="block">
                    <div className="columns">
                        <Map id={villagesOneMinimapId} name="villages" size="is-4" infoDiv="infoview" onReady={onMapReady} />
                        <div id="infoview"></div>
                        <div className="column is-8">
                            <div className="field is-grouped">{firstButtonRow}</div>
                            <div className="block">
                                <div className="content">{/* <h1>{villagesAreaOne}</h1> */}</div>

                                <div className="columns">
                                    <div className="column">
                                        <div id="villages-one-table" className="legend">
                                            <LegendTableMulti
                                                headers={[
                                                    'Varmeinstalation',
                                                    'Antal bygninger',
                                                    'Samlet boligareal',
                                                    'Samlet erhvervsareal',
                                                    'Areal i alt',
                                                ]}
                                                abbreviation={[
                                                    'Varmeinstalation i bygningsenheden',
                                                    'Antal bygninger med den pågældende varmeinstalation indenfor landsbyafgænsningen',
                                                    'Samlet boligareal i m², med den pågældende varmeinstalation indenfor landsbyafgænsningen',
                                                    'Samlet erhvervsareal i m², med den pågældende varmeinstalation indenfor landsbyafgænsningen',
                                                    'Samlet boligareal og erhvervsareal i m².',
                                                ]}
                                                data={villagesOneTableData}
                                                onRowToggle={onVillagesToggle}
                                                colorsStart={colorStartIndex}
                                            />
                                        </div>
                                        <div className="villages-one-stackedbar">
                                            <HorizontalStackedbarNoLegend
                                                colorsStart={colorStartIndex}
                                                categories={['Samlet boligareal', 'Samlet erhvervsareal']} // (Samlet boligareal, Samlet erhvervsareal)
                                                dataSeries={villagesOneBarchartData} //(Fjernvarme/blokvarme, Elvarme/Varmepumpe, Biobrændsel,Olie, Andet)
                                                visibility={villagesParams.map((item) => item.on)}
                                            />
                                        </div>
                                    </div>
                                    <div className="column is-4">
                                        <div className="columns">
                                            <div className="column is-12 villages-one-piechart">
                                                <PiechartNoLegend
                                                    colorsStart={colorStartIndex}
                                                    type={'doughnut'}
                                                    data={villagesOnePiechartData} // : PiechartData;
                                                    visibility={villagesOnePiechartData.map((item) => item.on)}
                                                    title={'Antal bygninger'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* NYT KORT */}
                <div className="block">
                    <div className="columns">
                        <Map
                            id={villagesTwoMinimapId}
                            name="villagesTwo"
                            size="is-4"
                            infoDiv="infoview"
                            onReady={onMapReadyTwo}
                        />
                        <div id="infoview"></div>
                        <div className="column is-8">
                            <div className="field is-grouped">{secondButtonRow}</div>
                            <div className="block">
                                <div className="content">{/* <h1>{villagesAreaTwo}</h1> */}</div>

                                <div className="columns">
                                    <div className="column">
                                        <div id="villages-two-table" className="legend">
                                            <LegendTableMulti
                                                headers={[
                                                    'Varmeinstalation',
                                                    'Antal bygninger',
                                                    'Samlet boligareal',
                                                    'Samlet erhvervsareal',
                                                    'Areal i alt',
                                                ]}
                                                abbreviation={[
                                                    'Varmeinstalation i bygningsenheden',
                                                    'Antal bygninger med den pågældende varmeinstalation indenfor landsbyafgænsningen',
                                                    'Samlet boligareal i m², med den pågældende varmeinstalation indenfor landsbyafgænsningen',
                                                    'Samlet erhvervsareal i m², med den pågældende varmeinstalation indenfor landsbyafgænsningen',
                                                    'Samlet boligareal og erhvervsareal i m².',
                                                ]}
                                                data={villagesTwoTableData}
                                                onRowToggle={onVillagesToggle}
                                                colorsStart={colorStartIndex}
                                            />
                                        </div>
                                        <div className="villages-two-stackedbar">
                                            <HorizontalStackedbarNoLegend
                                                colorsStart={colorStartIndex}
                                                categories={['Samlet boligareal', 'Samlet erhvervsareal']} // (Samlet boligareal, Samlet erhvervsareal)
                                                dataSeries={villagesTwoBarchartData} //(Fjernvarme/blokvarme, Elvarme/Varmepumpe, Biobrændsel,Olie, Andet)
                                                visibility={villagesParams.map((item) => item.on)}
                                            />
                                        </div>
                                    </div>
                                    <div className="column is-4">
                                        <div className="columns">
                                            <div className="column is-12 housing-type-piechart">
                                                <PiechartNoLegend
                                                    colorsStart={colorStartIndex}
                                                    type={'doughnut'}
                                                    data={villagesTwoPiechartData} // : PiechartData;
                                                    visibility={villagesTwoPiechartData.map((item) => item.on)}
                                                    title={'Antal bygninger'}
                                                />
                                            </div>
                                        </div>
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
export default VillagesPage;
