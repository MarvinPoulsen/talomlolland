import React, { FC, useRef, useState } from 'react';
import Map from '../components/minimap/Minimap';
import { facilitiesMinimapId } from '../../config';
import Slider from '../components/slider/Slider';
import LegendTableMulti, { LegendTableData } from '../components/chartjs/LegendTableMulti';

export interface FacilitiesRow {
    id: string;
    alder: string;
    koen: string;
    type: string;
    navn: string;
    adresse: string;
    beskrivelse: string;
    distance: string;
    km1: string;
    km2: string;
    km3: string;
    km4: string;
    km5: string;
    km6: string;
    km7: string;
    km8: string;
    km9: string;
    km10: string;
}

export interface MarkingRow {
    isokron: string;
    shape_wkt: { wkt: string };
}

interface AnalysisParams {
    title: string;
    code: string;
    filterValue: (item: FacilitiesRow) => boolean;
    on: boolean;
}

interface FilterKeys {
    isokron: string;
    distance: number;
}

const distances: FilterKeys[] = [
    { isokron: 'km1', distance: 1000 },
    { isokron: 'km2', distance: 2000 },
    { isokron: 'km3', distance: 3000 },
    { isokron: 'km4', distance: 4000 },
    { isokron: 'km5', distance: 5000 },
    { isokron: 'km6', distance: 6000 },
    { isokron: 'km7', distance: 7000 },
    { isokron: 'km8', distance: 8000 },
    { isokron: 'km9', distance: 9000 },
    { isokron: 'km10', distance: 10000 },
];

const createBasisData = (data, distance, analysisParams) => {
    const result: LegendTableData[] = [];
    const dataInside = data.filter((row) => row.distance <= distance && row.distance !== '');
    const dataOutside = data.filter((row) => row.distance > distance || row.distance === '');

    for (let i = 0; i < analysisParams.length; i++) {
        const analysisParam = analysisParams[i];
        const inside = dataInside.filter(analysisParam.filterValue).length;
        const outside = dataOutside.filter(analysisParam.filterValue).length;
        result.push({
            name: analysisParam.title,
            values: [inside, outside, inside + outside],
            on: analysisParam.on,
        });
    }
    return result;
};

const FacilitiesPage: FC = () => {
    const minimap: any = useRef(null);
    const [facilities, setFacilities] = useState<string>('haller');
    const [facilitiesData, setFacilitiesData] = useState<FacilitiesRow[]>([]);
    const [markingData, setMarkingData] = useState([]);
    const [selectedDistance, setSelectedDistanse] = useState<FilterKeys>({ isokron: 'km5', distance: 5000 });
    const [facilitiesAgesGroups, setFacilitiesAgesGroups] = useState<AnalysisParams[]>([
        { title: '0-5 år', code: 'age0_5', filterValue: (item) => item.alder <= 5, on: true },
        { title: '6-17 år', code: 'age6_17', filterValue: (item) => item.alder >= 6 && item.alder <= 17, on: true },
        { title: '18-24 år', code: 'age18_24', filterValue: (item) => item.alder >= 18 && item.alder <= 24, on: true },
        { title: '25-44 år', code: 'age25_44', filterValue: (item) => item.alder >= 25 && item.alder <= 44, on: true },
        { title: '45-64 år', code: 'age45_64', filterValue: (item) => item.alder >= 45 && item.alder <= 64, on: true },
        { title: '65-79 år', code: 'age65_79', filterValue: (item) => item.alder >= 65 && item.alder <= 79, on: true },
        { title: '80+ år', code: 'age80plus', filterValue: (item) => item.alder >= 80, on: true },
    ]);
    const onMapReady = (mm) => {
        minimap.current = mm;
        const ses = mm.getSession();
        const ds = ses.getDatasource('lk_talomlolland_faciliteter_haller_borger');
        ds.execute({ command: 'read' }, function (rows: FacilitiesRow[]) {
            setFacilitiesData(rows);
        });
        const dsMarking = ses.getDatasource('lk_talomlolland_faciliteter_haller_map');
        dsMarking.execute({ command: 'read' }, function (markingRows: MarkingRow[]) {
            setMarkingData(markingRows);
        });
        filterOnDistance;
    };
    const filterOnDistance = () => {
        if (markingData.length > 0) {
            const filteredMarkings = markingData.filter((item) => item.isokron === selectedDistance.isokron);
            for (let i = 0; i < filteredMarkings.length; i++) {
                const shape_wkt = filteredMarkings[i].shape_wkt;
                if (i === 0) {
                    minimap.current.getMapControl().setMarkingGeometry(shape_wkt, true, null, 3000);
                } else {
                    // console.log(shape_wkt);
                }
            }
        }
    };

    const handleSliderChange = (event) => {
        setSelectedDistanse(distances[event]);
        filterOnDistance();
    };

    const facilitiesAgeTableData: LegendTableData[] = createBasisData(facilitiesData, selectedDistance.distance, facilitiesAgesGroups);

    const onFacilitiesAgeToggle = (rowIndex: number) => {
        console.log('rowIndex: ', rowIndex);

        const updatedFacilitiesAgesGroups = [...facilitiesAgesGroups];
        updatedFacilitiesAgesGroups[rowIndex].on = !updatedFacilitiesAgesGroups[rowIndex].on;
        setFacilitiesAgesGroups(updatedFacilitiesAgesGroups);
    };

    const tester = () => {
        const tester = createBasisData(facilitiesData, selectedDistance.distance, facilitiesAgesGroups);
        console.log('tester: ', tester);
    };

    return (
        <>
            <div id="facilities-tab-content" className="container hidden">
                <div className="block">
                    <div className="columns">
                        <Map id={facilitiesMinimapId} name="facilities" size="is-6" infoDiv="infoview" onReady={onMapReady} />
                        <div id="infoview"></div>
                        <div className="column">
                            {/* <div className="control">
                                <button className="button is-info is-light" onClick={tester} value="Tester">
                                    Test
                                </button>
                            </div> */}
                            {/* <div className="field column"> */}
                                <label className="label">Vælg en afstand: {selectedDistance.isokron}</label>
                                <div className="control is-expanded block">
                                {/* <div className="control"> */}
                                    <Slider
                                        onRangeChange={handleSliderChange}
                                        maxValue={9}
                                        minValue={0}
                                        value={distances.findIndex((element) => element.isokron === selectedDistance.isokron)}
                                    />{' '}
                                </div>
                                    <div id="facilities-age-table" className="legend block">
                                        <LegendTableMulti
                                            headers={['Aldersgrupper', 'Indenfor', 'Udenfor', 'I alt']}
                                            data={facilitiesAgeTableData}
                                            onRowToggle={onFacilitiesAgeToggle}
                                        />
                                    </div>
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default FacilitiesPage;
