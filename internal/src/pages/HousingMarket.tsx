import React, { FC, useRef, useState } from 'react';
import { estateMinimapId } from '../../config';
import Map from '../components/minimap/Minimap';
import StackedbarNoLegend, { StackedDataSeries } from '../components/chartjs/StackedbarNoLegend';
import LegendTableMulti, { LegendTableData } from '../components/chartjs/LegendTableMulti';
import PiechartNoLegend, { PiechartData } from '../components/chartjs/PiechartNoLegend';
import '../components/housingmarket/housingmarket.scss';
import Tables, { TablesData } from '../components/tables/Tables';
import Slider from '../components/slider/Slider';
import format from 'date-fns/format';
import da from 'date-fns/locale/da'; // the locale you want

interface EstateRow {
    ba0: string;
    ba1: string;
    ba2: string;
    ba3: string;
    ba4: string;
    ba5: string;
    ba6: string;
    ba7: string;
    beboelses_enheder: string;
    beboet_af_ejer: string;
    bs1: string;
    bs2: string;
    bs3: string;
    bs4: string;
    bs5: string;
    bs6: string;
    bt1: string;
    bt2: string;
    bt3: string;
    bt4: string;
    bt5: string;
    dato: string;
    ef1: string;
    ef2: string;
    ef3: string;
    ef4: string;
    ef5: string;
    ef6: string;
    flexbolig: string;
    husstand_0: string;
    husstand_1: string;
    husstand_2: string;
    husstand_3: string;
    husstand_4: string;
    husstand_5: string;
    // ib1: string;
    // ib2: string;
    // ib3: string;
    kondemnret: string;
    nedrevne: string;
    omraade: string;
    summerhus_bs1: string;
    summerhus_bs2: string;
    summerhus_bs3: string;
    summerhus_bs4: string;
    summerhus_bs5: string;
    summerhus_bs6: string;
    summerhus_husstand_0: string;
    summerhus_husstand_1: string;
    summerhus_husstand_2: string;
    summerhus_husstand_3: string;
    summerhus_husstand_4: string;
    summerhus_husstand_5: string;
    summerhus_kondemnret: string;
    thuf: string;
}
const getDates = (data: EstateRow[]) => {
    const uniqueDates = [...new Set(data.map((item) => item.dato))];
    uniqueDates.sort(
        (a, b) => a.localeCompare(b) //using String.prototype.localCompare() abc...
    );
    return uniqueDates;
};

// createTablesData
const createTablesData = (data, areaCodes, analysisParams, date) => {
    const tablesData: TablesData[] = [];
    for (let i = 0; i < analysisParams.length; i++) {
        const analysisParam = analysisParams[i];
        let tableSum = 0;
        const values: number[] = [];
        for (let i = 0; i < areaCodes.length; i++) {
            const areaCode = areaCodes[i];
            const filteredData = data.length > 0 && data.filter((row) => row.omraade === areaCode && row.dato === date);
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
const createLegendTableData = (data, areaCodes, analysisParams, date) => {
    const legendTableData: LegendTableData[] = [];
    for (let i = 0; i < analysisParams.length; i++) {
        const analysisParam = analysisParams[i];
        let tableSum = 0;
        const values: number[] = [];
        for (let i = 0; i < areaCodes.length; i++) {
            const areaCode = areaCodes[i];
            const filteredData = data.length > 0 && data.filter((row) => row.omraade === areaCode && row.dato === date);
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
const createStackedbarData = (data, areaCodes, analysisParams) => {
    const stackedbarData: StackedbarData = {};
    for (let i = 0; i < areaCodes.length; i++) {
        const areaCode = areaCodes[i];
        const omraadeData = data
            .filter((row) => row.omraade === areaCode)
            .sort((r1, r2) => {
                const d1 = new Date(r1.dato);
                const d2 = new Date(r2.dato);
                return d1.getTime() - d2.getTime();
            });

        stackedbarData[areaCode] = [];
        for (let k = 0; k < analysisParams.length; k++) {
            const code = analysisParams[k].code;
            stackedbarData[areaCode].push({
                name: analysisParams[k].title,
                values: omraadeData.map((item) => item[code]),
                stack: '0',
            });
        }
    }
    return stackedbarData;
};

// createPiechartDataSeries
const createPiechartDataSeries = (data, areaCodes, analysisParams) => {
    const piechartDataSeries: PiechartDataSeries = {};
    for (let i = 0; i < areaCodes.length; i++) {
        const areaCode = areaCodes[i];
        const areaData =
            data.length > 0 &&
            data
                .filter((row) => row.omraade === areaCode)
                .sort((r1, r2) => {
                    const d1 = new Date(r1.dato);
                    const d2 = new Date(r2.dato);
                    return d1.getTime() - d2.getTime();
                });
        piechartDataSeries[areaCode] = [];
        for (let j = 0; j < analysisParams.length; j++) {
            const code = analysisParams[j].code;
            const value: number = areaData && parseInt(areaData[0][code]);
            piechartDataSeries[areaCode].push({
                name: analysisParams[j].title,
                value: value, //parseInt(omraadeData[0][btCode]),
                on: false,
            });
        }
    }
    return piechartDataSeries;
};

interface AnalysisParams {
    title: string;
    code: string;
    on: boolean;
}
interface StackedbarData {
    [key: string]: StackedDataSeries[];
}
interface PiechartDataSeries {
    [key: string]: PiechartData[];
}

const HousingMarketPage: FC = () => {
    const minimap: any = useRef(null);
    const [estateData, setEstateData] = useState([]);
    // const [date, setDate] = useState<string>('2022-02-15 00:00:00.0');
    const [date, setDate] = useState<string>('2020-01-01 00:00:00.0');
    const [housingTypes, setHousingTypes] = useState<AnalysisParams[]>([
        { title: 'Stuehus til landbrugsejendom', code: 'bt1', on: true },
        { title: 'Parcelhus', code: 'bt2', on: true },
        { title: 'Tæt-lav boligbebyggelse', code: 'bt3', on: true },
        { title: 'Bolig i etageejendom', code: 'bt4', on: true },
        { title: 'Andet', code: 'bt5', on: true },
    ]);
    const [ownerships, setOwnerships] = useState<AnalysisParams[]>([
        { title: 'Privatpersoner, incl. I/S', code: 'ef1', on: true },
        { title: 'Almen boligorganisation', code: 'ef2', on: true },
        { title: 'A/S, APS og andre selskaber', code: 'ef3', on: true },
        { title: 'Private andelsboligforeninger', code: 'ef4', on: true },
        { title: 'Lolland Kommune', code: 'ef5', on: true },
        { title: 'Andet', code: 'ef6', on: true },
    ]);
    const [housingSizes, setHousingSizes] = useState<AnalysisParams[]>([
        { title: '0 – 59 m²', code: 'bs1', on: true },
        { title: '60 – 79 m²', code: 'bs2', on: true },
        { title: '80 – 99 m²', code: 'bs3', on: true },
        { title: '100 – 119 m²', code: 'bs4', on: true },
        { title: '120 – 159 m²', code: 'bs5', on: true },
        { title: '> 160 m²', code: 'bs6', on: true },
    ]);
    const [housingAges, setHousingAges] = useState<AnalysisParams[]>([
        { title: 'Opført før 1900', code: 'ba1', on: true },
        { title: '1900 -19', code: 'ba2', on: true },
        { title: '1920-39', code: 'ba3', on: true },
        { title: '1940-59', code: 'ba4', on: true },
        { title: '1960-79', code: 'ba5', on: true },
        { title: '1980-99', code: 'ba6', on: true },
        { title: '2000++', code: 'ba7', on: true },
    ]);
    const [householdSizes, setHouseholdSizes] = useState<AnalysisParams[]>([
        { title: 'Tom bolig', code: 'husstand_0', on: true },
        { title: '1 beboer', code: 'husstand_1', on: true },
        { title: '2 beboere', code: 'husstand_2', on: true },
        { title: '3 beboere', code: 'husstand_3', on: true },
        { title: '4 beboere', code: 'husstand_4', on: true },
        { title: 'Mere end 4 beboere', code: 'husstand_5', on: true },
    ]);
    const [rentalConditions, setRentalConditions] = useState<AnalysisParams[]>([
        { title: 'Beboet af ejer', code: 'beboet_af_ejer', on: true },
        { title: 'Beboet af lejer', code: 'beboet_af_lejer', on: true },
        { title: 'Tom bolig', code: 'husstand_0', on: true },
    ]);
    const onMapReady = (mm) => {
        minimap.current = mm;
        const ses = mm.getSession();
        const ds = ses.getDatasource('lk_talomlolland_boligmarked');
        ds.execute({ command: 'read' }, function (rows: EstateRow[]) {
            const newArr = rows.map((obj) => {
                let beboet_af_lejer = 0;
                beboet_af_lejer += parseInt(obj.husstand_1);
                beboet_af_lejer += parseInt(obj.husstand_2);
                beboet_af_lejer += parseInt(obj.husstand_3);
                beboet_af_lejer += parseInt(obj.husstand_4);
                beboet_af_lejer += parseInt(obj.husstand_5);
                beboet_af_lejer -= parseInt(obj.beboet_af_ejer);
                let beboet_sommer = 0;
                beboet_sommer += parseInt(obj.summerhus_husstand_1);
                beboet_sommer += parseInt(obj.summerhus_husstand_2);
                beboet_sommer += parseInt(obj.summerhus_husstand_3);
                beboet_sommer += parseInt(obj.summerhus_husstand_4);
                beboet_sommer += parseInt(obj.summerhus_husstand_5);
                let sommer_total = 0;
                sommer_total += beboet_sommer;
                sommer_total += parseInt(obj.summerhus_husstand_0);
                return { ...obj, beboet_af_lejer: beboet_af_lejer, beboet_sommer: beboet_sommer, sommer_total: sommer_total };
            });
            setEstateData(newArr);
        });
    };

    const dates = getDates(estateData);

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

    const areaCodes: string[] = ['nakskov', 'maribo', 'roedby', 'landomraader'];
    const areaName: string[] = ['Nakskov', 'Maribo', 'Rødby', 'Øvrigt'];

    // DATA
    // Boligtype
    const housingTypesTableData = createLegendTableData(estateData, areaCodes, housingTypes, date);
    const onHousingTypeToggle = (rowIndex: number) => {
        const updatedHousingTypes = [...housingTypes];
        updatedHousingTypes[rowIndex].on = !updatedHousingTypes[rowIndex].on;
        setHousingTypes(updatedHousingTypes);
    };

    const housingTypesStackedData = createStackedbarData(estateData, areaCodes, housingTypes);
    const housingTypeStackedbar: HTMLDivElement[] = [];
    for (let i = 0; i < areaCodes.length; i++) {
        const areaCode = areaCodes[i];
        const title = areaName[i];
        housingTypeStackedbar.push(
            <div className="column is-3 housing-type-stackedbar" key={areaCode}>
                <StackedbarNoLegend
                    title={title}
                    categories={labels}
                    dataSeries={housingTypesStackedData[areaCode]}
                    visibility={housingTypes.map((item) => item.on)}
                />
            </div>
        );
    }

    const housingTypesPiechartData = createPiechartDataSeries(estateData, areaCodes, housingTypes);
    const housingTypePiechart: HTMLDivElement[] = [];
    for (let i = 0; i < areaCodes.length; i++) {
        const areaCode = areaCodes[i];
        housingTypePiechart.push(
            <div className="column is-3 housing-type-piechart" key={areaCode}>
                <PiechartNoLegend
                    data={housingTypesPiechartData[areaCode]} // : PiechartData;
                    visibility={housingTypes.map((item) => item.on)}
                />
            </div>
        );
    }

    // Ejerforhold
    const ownershipTableData = createLegendTableData(estateData, areaCodes, ownerships, date);
    const onOwnershipToggle = (rowIndex: number) => {
        const updatedOwnerships = [...ownerships];
        updatedOwnerships[rowIndex].on = !updatedOwnerships[rowIndex].on;
        setOwnerships(updatedOwnerships);
    };

    const ownershipsStackedData = createStackedbarData(estateData, areaCodes, ownerships);
    const ownershipStackedbar: HTMLDivElement[] = [];
    for (let i = 0; i < areaCodes.length; i++) {
        const areaCode = areaCodes[i];
        const title = areaName[i];
        ownershipStackedbar.push(
            <div className="column is-3 ownership-stackedbar" key={areaCode}>
                <StackedbarNoLegend
                    title={title}
                    categories={labels}
                    dataSeries={ownershipsStackedData[areaCode]}
                    visibility={ownerships.map((item) => item.on)}
                />
            </div>
        );
    }

    const ownershipsPiechartData = createPiechartDataSeries(estateData, areaCodes, ownerships);
    const ownershipPiechart: HTMLDivElement[] = [];
    for (let i = 0; i < areaCodes.length; i++) {
        const areaCode = areaCodes[i];
        ownershipPiechart.push(
            <div className="column is-3 ownership-piechart" key={areaCode}>
                <PiechartNoLegend
                    data={ownershipsPiechartData[areaCode]} // : PiechartData;
                    visibility={ownerships.map((item) => item.on)}
                />
            </div>
        );
    }

    // Boligstørrelse
    const housingSizeTableData = createLegendTableData(estateData, areaCodes, housingSizes, date);
    const onHousingSizeToggle = (rowIndex: number) => {
        const updatedHousingSizes = [...housingSizes];
        updatedHousingSizes[rowIndex].on = !updatedHousingSizes[rowIndex].on;
        setHousingSizes(updatedHousingSizes);
    };

    const housingSizeStackedData = createStackedbarData(estateData, areaCodes, housingSizes);
    const housingSizeStackedbar: HTMLDivElement[] = [];
    for (let i = 0; i < areaCodes.length; i++) {
        const areaCode = areaCodes[i];
        const title = areaName[i];
        housingSizeStackedbar.push(
            <div className="column is-3 housingSize-stackedbar" key={areaCode}>
                <StackedbarNoLegend
                    title={title}
                    categories={labels}
                    dataSeries={housingSizeStackedData[areaCode]}
                    visibility={housingSizes.map((item) => item.on)}
                />
            </div>
        );
    }

    const housingSizePiechartData = createPiechartDataSeries(estateData, areaCodes, housingSizes);
    const housingSizePiechart: HTMLDivElement[] = [];
    for (let i = 0; i < areaCodes.length; i++) {
        const areaCode = areaCodes[i];
        housingSizePiechart.push(
            <div className="column is-3 housingSize-piechart" key={areaCode}>
                <PiechartNoLegend data={housingSizePiechartData[areaCode]} visibility={housingSizes.map((item) => item.on)} />
            </div>
        );
    }

    // Boligalder
    const housingAgeTableData = createLegendTableData(estateData, areaCodes, housingAges, date);
    const onHousingAgeToggle = (rowIndex: number) => {
        const updatedHousingAges = [...housingAges];
        updatedHousingAges[rowIndex].on = !updatedHousingAges[rowIndex].on;
        setHousingAges(updatedHousingAges);
    };

    const housingAgeStackedData = createStackedbarData(estateData, areaCodes, housingAges);
    const housingAgeStackedbar: HTMLDivElement[] = [];
    for (let i = 0; i < areaCodes.length; i++) {
        const areaCode = areaCodes[i];
        const title = areaName[i];
        housingAgeStackedbar.push(
            <div className="column is-3 housing-age-stackedbar" key={areaCode}>
                <StackedbarNoLegend
                    title={title}
                    categories={labels}
                    dataSeries={housingAgeStackedData[areaCode]}
                    visibility={housingAges.map((item) => item.on)}
                />
            </div>
        );
    }

    const housingAgePiechartData = createPiechartDataSeries(estateData, areaCodes, housingAges);
    const housingAgePiechart: HTMLDivElement[] = [];
    for (let i = 0; i < areaCodes.length; i++) {
        const areaCode = areaCodes[i];
        housingAgePiechart.push(
            <div className="column is-3 housing-age-piechart" key={areaCode}>
                <PiechartNoLegend data={housingAgePiechartData[areaCode]} visibility={housingAges.map((item) => item.on)} />
            </div>
        );
    }

    // Husstand størrelse
    const householdSizeTableData = createLegendTableData(estateData, areaCodes, householdSizes, date);
    const onHouseholdSizeToggle = (rowIndex: number) => {
        const updatedHouseholdSizes = [...householdSizes];
        updatedHouseholdSizes[rowIndex].on = !updatedHouseholdSizes[rowIndex].on;
        setHouseholdSizes(updatedHouseholdSizes);
    };

    const householdSizeStackedData = createStackedbarData(estateData, areaCodes, householdSizes);
    const householdSizeStackedbar: HTMLDivElement[] = [];
    for (let i = 0; i < areaCodes.length; i++) {
        const areaCode = areaCodes[i];
        const title = areaName[i];
        householdSizeStackedbar.push(
            <div className="column is-3 household-size-stackedbar" key={areaCode}>
                <StackedbarNoLegend
                    title={title}
                    categories={labels}
                    dataSeries={householdSizeStackedData[areaCode]}
                    visibility={householdSizes.map((item) => item.on)}
                />
            </div>
        );
    }

    const householdSizePiechartData = createPiechartDataSeries(estateData, areaCodes, householdSizes);
    const householdSizePiechart: HTMLDivElement[] = [];
    for (let i = 0; i < areaCodes.length; i++) {
        const areaCode = areaCodes[i];
        householdSizePiechart.push(
            <div className="column is-3 household-size-piechart" key={areaCode}>
                <PiechartNoLegend
                    data={householdSizePiechartData[areaCode]}
                    visibility={householdSizes.map((item) => item.on)}
                />
            </div>
        );
    }

    // Udlejningsforhold
    const rentalConditionTableData = createLegendTableData(estateData, areaCodes, rentalConditions, date);
    const onRentalConditionToggle = (rowIndex: number) => {
        const updatedRentalConditions = [...rentalConditions];
        updatedRentalConditions[rowIndex].on = !updatedRentalConditions[rowIndex].on;
        setRentalConditions(updatedRentalConditions);
    };

    const rentalConditionStackedData = createStackedbarData(estateData, areaCodes, rentalConditions);
    const rentalConditionStackedbar: HTMLDivElement[] = [];
    for (let i = 0; i < areaCodes.length; i++) {
        const areaCode = areaCodes[i];
        const title = areaName[i];
        rentalConditionStackedbar.push(
            <div className="column is-3 rental-condition-stackedbar" key={areaCode}>
                <StackedbarNoLegend
                    title={title}
                    categories={labels}
                    dataSeries={rentalConditionStackedData[areaCode]}
                    visibility={rentalConditions.map((item) => item.on)}
                />
            </div>
        );
    }

    const rentalConditionPiechartData = createPiechartDataSeries(estateData, areaCodes, rentalConditions);
    const rentalConditionPiechart: HTMLDivElement[] = [];
    for (let i = 0; i < areaCodes.length; i++) {
        const areaCode = areaCodes[i];
        rentalConditionPiechart.push(
            <div className="column is-3 rental-condition-piechart" key={areaCode}>
                <PiechartNoLegend
                    data={rentalConditionPiechartData[areaCode]}
                    visibility={rentalConditions.map((item) => item.on)}
                />
            </div>
        );
    }

    // Egnet til beboelse
    const suitableForHabitationParams = [
        { title: 'Kondemneret', code: 'kondemnret' },
        // { title: 'Antal nedrevne boliger', code: 'nedrevne' },
        { title: 'Kondemneret sommerhus', code: 'summerhus_kondemnret' },
    ];

    const suitableForHabitation = createTablesData(estateData, areaCodes, suitableForHabitationParams, date);

    // Status
    const housingStatusParams = [
        { title: 'Flexboligstatus', code: 'flexbolig' },
        { title: 'Tom helårsbeboelse uden Flexboligstatus', code: 'thuf' },
        { title: 'Beboet sommerhus', code: 'beboet_sommer' },
        { title: 'Sommherhuse total', code: 'sommer_total' },
    ];

    const housingStatus = createTablesData(estateData, areaCodes, housingStatusParams, date);

    const handleDateChange = (event) => {
        setDate(dates[event]);
    };

    return (
        <>
            <div id="estate-tab-content" className="container hidden">
                <div className="columns">
                    <Map id={estateMinimapId} name="estate" size="is-4" onReady={onMapReady} />
                    <div className="column">
                        <div className="content">
                            <p>
                                Alt data i tabeller og lagkagediagrammer er trukket den{' '}
                                {format(new Date(date), 'dd. MMMM yyyy', { locale: da })}.
                            </p>
                            <div className="columns">
                            <div className="column is-8">
                                    
                            <Slider
                                onRangeChange={handleDateChange}
                                maxValue={dates.length - 1}
                                minValue={0}
                                value={dates.findIndex((element) => element === date)}
                            />
                        </div>
                        </div>
                            <label className="label">Ændre datoen ved at flytte på slideren</label>
                            <p>
                                Til søjlediagrammerne tilføjes ny data hvert kvartal. Søjlediagrammerne viser således
                                udviklingen for det på gældende geografiske område.
                            </p>
                            <p>Alle optællinger baserer sig på 4 geografiske områder:</p>
                            <ul>
                                <li>Nakskov som betsår af Sankt Nikolaj Sogn og Stormark Sogn</li>
                                <li>Maribo som betsår af Maribo Domsogn Sogn og Hunseby Sogn</li>
                                <li>Rødby som betsår af Rødby Sogn, Sædinge Sogn, Ringsebølle Sogn og Rødbyhavn Sogn</li>
                                <li>Øvrigt indeholder alle øvrige sogne</li>
                            </ul>
                            <p></p>
                            <p></p>
                        </div>
                    </div>
                </div>
                <div className="block">
                    <div className="content">
                        <h1>Fakta om boligtyper i Lolland Kommune</h1>
                    </div>
                    <div className="columns">
                        <div className="column is-two-fifths">
                            <div id="housing-type-table" className="legend">
                                <LegendTableMulti
                                    headers={['Boligtype', 'Nakskov', 'Maribo', 'Rødby', 'Øvrigt', 'I alt']}
                                    data={housingTypesTableData}
                                    onRowToggle={onHousingTypeToggle}
                                    date={format(new Date(date), 'd. MMMM yyyy', { locale: da })}
                                />
                            </div>
                            <div className="content">
                                <p>
                                    Boligtypen er beregnet på baggrund af BBR, udfra enhedens anvendelskode, fra enhedsniveuet.
                                    EnhAnvendelseKode større end 180 er ikke medtaget i analysen med undtagelse af
                                    EnhAnvendelseKode 190 i BBR.
                                </p>
                                <p>
                                    Tæt/lavt bebyggelse udgøres af EnhAnvendelseKode 130, 131 og 132 i BBR. Andet udgøres af
                                    EnhAnvendelseKode 121, 150, 160 og 190 i BBR.
                                </p>
                            </div>
                        </div>
                        <div className="column is-three-fifths">
                            <div className="columns">{housingTypeStackedbar}</div>
                            <div className="columns">{housingTypePiechart}</div>
                        </div>
                    </div>
                </div>

                <div className="block">
                    <div className="content">
                        <h1>Fakta om ejerforhold i Lolland Kommune</h1>
                    </div>
                    <div className="columns">
                        <div className="column is-two-fifths">
                            <div id="ownership-table" className="legend">
                                <LegendTableMulti
                                    headers={['Ejerforhold', 'Nakskov', 'Maribo', 'Rødby', 'Øvrigt', 'I alt']}
                                    data={ownershipTableData}
                                    onRowToggle={onOwnershipToggle}
                                    date={format(new Date(date), 'd. MMMM yyyy', { locale: da })}
                                />
                            </div>
                            <div className="content">
                                <p>Ejerforhold er beregnet på baggrund af ESR, herunder ejerforholdkode</p>
                                <p>Kategorien 'Andet' indeholder koderne 40, 70, 80, 90, 99, 0 og evt. blandede ejerforhold</p>
                            </div>
                        </div>
                        <div className="column is-three-fifths">
                            <div className="columns">{ownershipStackedbar}</div>
                            <div className="columns">{ownershipPiechart}</div>
                        </div>
                    </div>
                </div>

                <div className="block">
                    <div className="content">
                        <h1>Fakta om boligstørrelse i Lolland Kommune</h1>
                    </div>
                    <div className="columns">
                        <div className="column is-two-fifths">
                            <div id="housing-size-table" className="legend">
                                <LegendTableMulti
                                    headers={['Boligstørrelse', 'Nakskov', 'Maribo', 'Rødby', 'Øvrigt', 'I alt']}
                                    data={housingSizeTableData}
                                    onRowToggle={onHousingSizeToggle}
                                    date={format(new Date(date), 'd. MMMM yyyy', { locale: da })}
                                />
                            </div>
                            <div className="content">
                                <p>
                                    Boligstørrelsen er beregnet ud fra BBR, herunder Enhedens beboelsesareal (Enh_Bebo_Arl) fra
                                    enhedsniveauet
                                </p>
                            </div>
                        </div>
                        <div className="column is-three-fifths">
                            <div className="columns">{housingSizeStackedbar}</div>
                            <div className="columns">{housingSizePiechart}</div>
                        </div>
                    </div>
                </div>

                <div className="block">
                    <div className="content">
                        <h1>Fakta om boligalder i Lolland Kommune</h1>
                    </div>
                    <div className="columns">
                        <div className="column is-two-fifths">
                            <div id="housing-age-table" className="legend">
                                <LegendTableMulti
                                    headers={['Boligalder', 'Nakskov', 'Maribo', 'Rødby', 'Øvrigt', 'I alt']}
                                    data={housingAgeTableData}
                                    onRowToggle={onHousingAgeToggle}
                                    date={format(new Date(date), 'd. MMMM yyyy', { locale: da })}
                                />
                            </div>
                            <div className="content">
                                <p>
                                    Boligens alder er beregnet udfra BBR, herunder Opførelsesår (Opfoerelse_Aar) fra
                                    bygningsniveauet
                                </p>
                            </div>
                        </div>
                        <div className="column is-three-fifths">
                            <div className="columns">{housingAgeStackedbar}</div>
                            <div className="columns">{housingAgePiechart}</div>
                        </div>
                    </div>
                </div>

                <div className="block">
                    <div className="content">
                        <h1>Fakta om husstand størrelse i Lolland Kommune</h1>
                    </div>
                    <div className="columns">
                        <div className="column is-two-fifths">
                            <div id="household-size-table" className="legend">
                                <LegendTableMulti
                                    headers={['Husstand størrelse', 'Nakskov', 'Maribo', 'Rødby', 'Øvrigt', 'I alt']}
                                    data={householdSizeTableData}
                                    onRowToggle={onHouseholdSizeToggle}
                                    date={format(new Date(date), 'd. MMMM yyyy', { locale: da })}
                                />
                            </div>
                            <div className="content">
                                {/* <!-- <p id='text-fra-js'></p> --> */}
                                <p>
                                    Husstand størrelsen beregnes udfra KMD P-data og BBR, vha. sammenstilling på adressen (KVHX)
                                </p>
                            </div>
                        </div>
                        <div className="column is-three-fifths">
                            <div className="columns">{householdSizeStackedbar}</div>
                            <div className="columns">{householdSizePiechart}</div>
                        </div>
                    </div>
                </div>

                <div className="block">
                    <div className="content">
                        <h1>Fakta om udlejningsforhold i Lolland Kommune</h1>
                    </div>
                    <div className="columns">
                        <div className="column is-two-fifths">
                            <div id="rental-conditions-table" className="legend">
                                <LegendTableMulti
                                    headers={['Udlejningsforhold', 'Nakskov', 'Maribo', 'Rødby', 'Øvrigt', 'I alt']}
                                    data={rentalConditionTableData}
                                    onRowToggle={onRentalConditionToggle}
                                    date={format(new Date(date), 'd. MMMM yyyy', { locale: da })}
                                />
                            </div>
                            <div className="content">
                                <p>
                                    Udlejningsforhold beregnes udfra KMD P-data, ESR og BBR, ved henholdsvis sammenstilling på
                                    adressen og via ESR-nummer
                                </p>
                            </div>
                        </div>
                        <div className="column is-three-fifths">
                            <div className="columns">{rentalConditionStackedbar}</div>
                            <div className="columns">{rentalConditionPiechart}</div>
                        </div>
                    </div>
                </div>

                <div className="block">
                    <div className="content">
                        <h1>Fakta om boliger uegnet til beboelse i Lolland Kommune</h1>
                    </div>
                    <div className="columns">
                        <div id="condemnation-table" className="condemnation-legend column is-two-fifths">
                            <Tables
                                headers={['Egnet til beboelse', 'Nakskov', 'Maribo', 'Rødby', 'Øvrigt', 'I alt']}
                                data={suitableForHabitation}
                                date={format(new Date(date), 'd. MMMM yyyy', { locale: da })}
                            />
                        </div>
                        <div className="column">
                            <div className="content">
                                <p>
                                    Egnethed til beboelse beregnes udfra BBR, Kode for Kondemneret boligenhed (BoligKondemKode)
                                    fra enhedsniveauet
                                </p>
                                {/* <p>Samt Lolland Kommunes egne registreringer af nedrevne boliger</p> */}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="block">
                    <div className="content">
                        <h1>Fakta om Status på boliger i Lolland Kommune</h1>
                    </div>
                    <div className="columns">
                        <div id="status-table" className="status-legend column is-two-fifths">
                            <Tables
                                headers={['Status', 'Nakskov', 'Maribo', 'Rødby', 'Øvrigt', 'I alt']}
                                data={housingStatus}
                                date={format(new Date(date), 'd. MMMM yyyy', { locale: da })}
                            />
                        </div>
                        <div className="column">
                            <div className="content">
                                <p>
                                    Flexboligstatus beregnes udfra BBR, Kode for Flexboligtilladelsesart
                                    (FlexboligTilladelsesartKode) fra enhedsniveauet
                                </p>
                                <p>
                                    Tom helårsbeboelse uden flexbolig beregnes udfra BBR og KMD P-data, vha. sammenstilling på
                                    adresse.
                                </p>
                                <p>
                                    Sommerhus og beboede sommerhus beregnes udfra BBR og KMD P-data, vha. sammenstilling på
                                    adresse og sortering på EnhAnvendelseKode (510)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="block">
                    <div className="content">
                        <h1>Fakta om Beliggenhed af boliger i Lolland Kommune</h1>
                    </div>
                    <div className="columns">
                        <div id="location-table" className="location-legend column is-two-fifths">
                            <table className="table is-bordered is-hoverable is-size-7 is-fullwidth is-narrow">
                                <thead>
                                    <tr>
                                        <th>Beliggenhed</th>
                                        <th>
                                            <abbr title="Hele Lolland Kommune">I alt</abbr>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="has-text-left content">Færre end 1000 indbyggere</td>
                                        <td className="has-text-right content">2.142</td>
                                    </tr>
                                    <tr>
                                        <td className="has-text-left content">1000 – 4999 indbyggere</td>
                                        <td className="has-text-right content">3.616</td>
                                    </tr>
                                    <tr>
                                        <td className="has-text-left content">5000 – 9999 indbyggere</td>
                                        <td className="has-text-right content">9.864</td>
                                    </tr>
                                    <tr>
                                        <td className="has-text-left content">Landdistrikt</td>
                                        <td className="has-text-right content">8.755</td>
                                    </tr>
                                    <tr>
                                        <th className="has-text-left content">SUM</th>
                                        <th className="has-text-right content">24.377</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="column">
                            <div className="content">
                                <p>Beliggenhed er beregnet ud fra KMD P-data, Zonekort, BBR</p>
                                <p>
                                    By størrelse er beregnet som antallet af personer med adresse i sammenhængende byzoner eller
                                    tætliggende byzoner
                                </p>
                                <p>
                                    Tallet for beliggenhed viser antallet af boligenheder i sammenhængende byzoner kategoriseret
                                    efter antallet af beboere.
                                </p>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </>
    );
};
export default HousingMarketPage;
