import React, { FC, useRef, useState } from 'react';
import { villagesMinimapId, villagesTwoMinimapId } from '../../config';
import Map from '../components/minimap/Minimap';
import PiechartNoLegend, { PiechartData } from '../components/chartjs/PiechartNoLegend';
import LegendTableMulti, { LegendTableData } from '../components/chartjs/LegendTableMulti';
import HorizontalStackedbarNoLegend, { StackedDataSeries } from '../components/chartjs/HorizontalStackedbarNoLegend';

//INTERFACES
export interface VillagesRow {
    id: string;
    navn: string;
    varmeinstallation_t: string;
    varmeinstallation_total_count: number;
    samlerhvervareal_sum: number;
    bygningenssamlboligareal_sum: number;
    samletbygningsareal_sum: number;
    shape_wkt: { wkt: string };
}

interface AnalysisParams {
    title: string;
    on: boolean;
}

//CONSTANTS
const colorStartIndex: number = 13;
const cityExtents = {
    // [x1, y1, x2, y2] ~ [minx, miny, maxx, maxy] ~ [left, bottom, right, top]
    Nørreballe: [655000, 6074700, 657100, 6076500],
    Stokkemarke: [650800, 6078700, 652900, 6079700],
    Dannemare: [639850, 6069800, 642400, 6070800],
    Hunseby: [660700, 6074400, 662520, 6075400],
    Sandby: [632680, 6082800, 634400, 6083400],
    Langø: [629100, 6075340, 630120, 6076400],
    Errindlev: [660400, 6060300, 661400, 6061450],
    Hillested: [656500, 6069300, 658000, 6071500],
};
const villages: string[] = ['Nørreballe', 'Stokkemarke', 'Dannemare', 'Hunseby', 'Sandby', 'Langø', 'Errindlev', 'Hillested'];
const columnKeys: string[] = ['varmeinstallation_total_count', 'bygningenssamlboligareal_sum', 'samlerhvervareal_sum'];
const barCatagories: string[] = ['bygningenssamlboligareal_sum', 'samlerhvervareal_sum'];
// FUNCTIONS
const createLegendTableData = (data, dataKeys, analysisParams) => {
    const legendTableData: LegendTableData[] = [];
    for (let i = 0; i < analysisParams.length; i++) {
        const analysisParam = analysisParams[i];

        let tableSum = 0;
        const values: number[] = [];
        for (let i = 0; i < dataKeys.length; i++) {
            const dataKey = dataKeys[i];
            const findData = data.find((item) => item.varmeinstallation_t === analysisParam.title);
            const value: number = findData && findData[dataKey] ? parseInt(findData[dataKey]) : 0;
            tableSum += dataKey === 'varmeinstallation_total_count' ? 0 : value;
            values.push(value);

            //tilføj kolonne med procenter
            // const colSum = data.reduce((accumulator, object) => accumulator + parseInt(object[dataKey] ? object[dataKey] : 0), 0);
            // const percentage: number = (value/colSum)*100
            // values.push(percentage);
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
        const findData = data.find((item) => item.varmeinstallation_t === analysisParam.title);
        const value: number = findData && findData ? parseInt(findData['varmeinstallation_total_count']) : 0;

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
    const stackedbarData: StackedDataSeries[] = [];
    for (let i = 0; i < analysisParams.length; i++) {
        const analysisParam = analysisParams[i];
        const findData = data.find((item) => item.varmeinstallation_t === analysisParam.title);
        const values: number[] = [];

        for (let j = 0; j < barCatagories.length; j++) {
            const barCatagory = barCatagories[j];
            const value: number = findData && findData[barCatagory] ? parseInt(findData[barCatagory]) : 0;
            const colSum = data.reduce(
                (accumulator, object) => accumulator + parseInt(object[barCatagory] ? object[barCatagory] : 0),
                0
            );
            const percentage: number = (value / colSum) * 100;
            console.log('colSum: ', colSum);
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
    const [villagesData, setVillagesData] = useState([]);
    const [villagesAreaOne, setVillagesAreaOne] = useState('Nørreballe'); // alternativ 'Maribo'
    const [villagesAreaTwo, setVillagesAreaTwo] = useState('Stokkemarke'); // alternativ 'Maribo'
    const [villagesOne, setVillagesOne] = useState<AnalysisParams[]>([
        { title: 'Fjernvarme/blokvarme', on: true },
        { title: 'Elvarme/Varmepumpe', on: true },
        { title: 'Biobrændsel', on: true },
        { title: 'Olie', on: true },
        { title: 'Andet', on: true },
    ]);
    const [villagesTwo, setVillagesTwo] = useState<AnalysisParams[]>([
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
        minimap.current.getMapControl().zoomToExtent(cityExtents[event.target.value]);
        // setResidentialArea(undefined);
    };
    const handleVillagesAreaTwo = (event) => {
        setVillagesAreaTwo(event.target.value);
        minimapTwo.current.getMapControl().zoomToExtent(cityExtents[event.target.value]);
        // setResidentialArea(undefined);
    };

    const villagesOneFilter = villagesData.filter((row) => row.navn === villagesAreaOne);
    const villagesTwoFilter = villagesData.filter((row) => row.navn === villagesAreaTwo);

    // console.log('villagesTwoFilter: ', villagesTwoFilter);
    const firstButtonRow: HTMLDivElement[] = [];
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
    const secondButtonRow: HTMLDivElement[] = [];
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

    const villagesOneTableData = createLegendTableData(villagesOneFilter, columnKeys, villagesOne);
    const villagesTwoTableData = createLegendTableData(villagesTwoFilter, columnKeys, villagesTwo);
    const onVillagesOneToggle = (rowIndex: number) => {
        const updatedVillagesOne = [...villagesOne];
        updatedVillagesOne[rowIndex].on = !updatedVillagesOne[rowIndex].on;
        setVillagesOne(updatedVillagesOne);
    };
    const onVillagesTwoToggle = (rowIndex: number) => {
        const updatedVillagesTwo = [...villagesTwo];
        updatedVillagesTwo[rowIndex].on = !updatedVillagesTwo[rowIndex].on;
        setVillagesTwo(updatedVillagesTwo);
    };
    const villagesOnePiechartData = createPiechartData(villagesOneFilter, villagesOne);
    const villagesTwoPiechartData = createPiechartData(villagesTwoFilter, villagesTwo);
    const villagesOneBarchartData = createStackedbarData(villagesOneFilter, barCatagories, villagesOne);
    const villagesTwoBarchartData = createStackedbarData(villagesTwoFilter, barCatagories, villagesTwo);

    // console.log('villagesOneBarchartData: ', villagesOneBarchartData);

    return (
        <>
            <div id="residentages-tab-content" className="container hidden">
                <div className="block">
                    <div className="columns">
                        <Map id={villagesMinimapId} name="villages" size="is-4" infoDiv="infoview" onReady={onMapReady} />
                        <div id="infoview"></div>
                        <div className="column is-8">
                            <div className="field is-grouped">{firstButtonRow}</div>
                            <div className="block">
                                <div className="content">{/* <h1>{villagesAreaOne}</h1> */}</div>

                                <div className="columns">
                                    <div className="column">
                                        <div id="housing-type-table" className="legend">
                                            <LegendTableMulti
                                                headers={[
                                                    'Varmeinstalation',
                                                    'Antal bygninger',
                                                    // 'Procent bygninger',
                                                    'Samlet boligareal',
                                                    // 'Procent bygninger',
                                                    'Samlet erhvervsareal',
                                                    // 'Procent bygninger',
                                                    'Areal i alt',
                                                ]}
                                                data={villagesOneTableData}
                                                onRowToggle={onVillagesOneToggle}
                                                colorsStart={colorStartIndex}
                                            />
                                        </div>
                                        <div className="villages-one-stackedbar">
                                            <HorizontalStackedbarNoLegend
                                                colorsStart={colorStartIndex}
                                                categories={['Samlet boligareal', 'Samlet erhvervsareal']} // (Samlet boligareal, Samlet erhvervsareal)
                                                dataSeries={villagesOneBarchartData} //(Fjernvarme/blokvarme, Elvarme/Varmepumpe, Biobrændsel,Olie, Andet)
                                                visibility={villagesOne.map((item) => item.on)}
                                                horizontal={true}
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
                                        <div id="housing-type-table" className="legend">
                                            <LegendTableMulti
                                                headers={[
                                                    'Varmeinstalation',
                                                    'Antal bygninger',
                                                    'Samlet boligareal',
                                                    'Samlet erhvervsareal',
                                                    'Areal i alt',
                                                ]}
                                                data={villagesTwoTableData}
                                                onRowToggle={onVillagesTwoToggle}
                                                colorsStart={colorStartIndex}
                                            />
                                        </div>
                                        <div className="villages-two-stackedbar">
                                            <HorizontalStackedbarNoLegend
                                                colorsStart={colorStartIndex}
                                                categories={['Samlet boligareal', 'Samlet erhvervsareal']} // (Samlet boligareal, Samlet erhvervsareal)
                                                dataSeries={villagesTwoBarchartData} //(Fjernvarme/blokvarme, Elvarme/Varmepumpe, Biobrændsel,Olie, Andet)
                                                visibility={villagesTwo.map((item) => item.on)}
                                                horizontal={true}
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
