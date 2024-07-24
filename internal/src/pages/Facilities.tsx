// Import statements
import React, { FC, useRef, useState, useEffect } from 'react';
import Map from '../components/minimap/Minimap';
import { facilitiesMinimapId, forceMapExtent } from '../../config';
import Slider from '../components/slider/Slider';
import { LegendTableData } from '../components/chartjs/LegendTableMulti';
import MapTable from '../components/chartjs/MapTable';
import Select from 'react-select';
import { getForcedMapExtent } from '../../utils';

// Interface definitions
export interface FacilitiesRow {
    id: string;
    alder: string;
    koen: string;
    facilitet: string;
    navn: string;
    distance: string;
    isokron: string;
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
    [key: string]: string;
}
export interface MarkingRow {
    isokron: string;
    shape_wkt: { wkt: string };
}

export interface LocalitiesRow {
    id: string;
    type: string;
    navn: string;
    adresse: string;
    beskrivelse: string;
    distance: string;
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

interface SelectOptions {
    value: string;
    label: string;
}

// Constants
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

// Helper functions
/**
 * Denne funktion opretter tabeldata baseret på facilitetsdata, afstand, analyseparametre, kolonneparametre og en specifik streng.
 *
 * @param {FacilitiesRow[]} data - En liste af facilitetsdata.
 * @param {number} distance - En numerisk værdi, der repræsenterer afstanden.
 * @param {AnalysisParams[]} analysisParams - En liste af analyseparametre.
 * @param {FilterKeys[]} columnParams - En liste af kolonneparametre.
 * @param {string} specific - En valgfri streng, der bruges til at filtrere dataene.
 * @returns {LegendTableData[]} - Returnerer en liste af LegendTableData objekter.
 */
const createTableData = (
    data: FacilitiesRow[], // Inputdata som skal analyseres.
    distance: number, // Afstandsværdi til filtrering af data.
    analysisParams: AnalysisParams[], // Parametre for analyse af data.
    columnParams: FilterKeys[], // Parametre for kolonnefiltrering.
    specific?: string // Specifik værdi til filtrering af data.
) => {
    // Initialiserer et tomt array til at holde resultaterne.
    const result: LegendTableData[] = [];
    
    // Filtrerer dataene for rækker, hvor afstanden er større end den angivne afstand, eller afstanden er tom.
    const dataOutside = data.filter((row) => parseFloat(row.distance) > distance || row.distance === '');
    
    // Itererer over hvert analyseparameter.
    for (let i = 0; i < analysisParams.length; i++) {
        const analysisParam = analysisParams[i];
        
        // Initialiserer et tomt array til at holde værdierne.
        const values: number[] = [];
        
        // Itererer over hvert kolonneparameter.
        for (let j = 0; j < columnParams.length; j++) {
            const columnParam = columnParams[j];
            
            // Filtrerer dataene baseret på det specifikke kriterium, hvis det er angivet, ellers baseret på afstanden.
            const dataInside = specific
                ? data.filter((item) => item[columnParam.isokron].includes(specific))
                : data.filter((row) => parseFloat(row.distance) <= columnParam.distance && row.distance !== '');
            
            // Beregner antallet af rækker, der opfylder filterværdien for det aktuelle analyseparameter.
            const value = dataInside.filter(analysisParam.filterValue).length;
            values.push(value);
        }
        
        // Tilføjer antallet af rækker uden for den angivne afstand, der opfylder filterværdien for det aktuelle analyseparameter.
        values.push(dataOutside.filter(analysisParam.filterValue).length);
        result.push({
            name: analysisParam.title,
            values,
            on: analysisParam.on,
        });
    }
    return result;
};


const getLocalities = (data: FacilitiesRow[]) => {
    const uniqueLocalities = [...new Set(data.map((item) => item.navn))];
    uniqueLocalities.sort(
        (a, b) => b.localeCompare(a) //using String.prototype.localCompare()
    );
    return uniqueLocalities;
};

// Component
const FacilitiesPage: FC = () => {
    // useState hooks
    // const [facilities, setFacilities] = useState<string>('haller');
    const [locality, setLocality] = useState<string | undefined>(undefined);
    const [localitiesData, setLocalitiesData] = useState<LocalitiesRow[]>([]);
    const [facilitiesData, setFacilitiesData] = useState<FacilitiesRow[]>([]);
    const [selectOptions, setSelectOptions] = useState<SelectOptions[] | undefined>(undefined);
    const [markingData, setMarkingData] = useState<MarkingRow[]>([]);
    const [selectedDistance, setSelectedDistanse] = useState<FilterKeys>({ isokron: 'km5', distance: 5000 });
    const [facilitiesAgesGroups, setFacilitiesAgesGroups] = useState<AnalysisParams[]>([
        {
            title: '0-5 år',
            code: 'age0_5',
            filterValue: (item) => parseInt(item.alder) <= 5,
            on: true,
        },
        {
            title: '6-17 år',
            code: 'age6_17',
            filterValue: (item) => parseInt(item.alder) >= 6 && parseInt(item.alder) <= 17,
            on: true,
        },
        {
            title: '18-24 år',
            code: 'age18_24',
            filterValue: (item) => parseInt(item.alder) >= 18 && parseInt(item.alder) <= 24,
            on: true,
        },
        {
            title: '25-44 år',
            code: 'age25_44',
            filterValue: (item) => parseInt(item.alder) >= 25 && parseInt(item.alder) <= 44,
            on: true,
        },
        {
            title: '45-64 år',
            code: 'age45_64',
            filterValue: (item) => parseInt(item.alder) >= 45 && parseInt(item.alder) <= 64,
            on: true,
        },
        {
            title: '65-79 år',
            code: 'age65_79',
            filterValue: (item) => parseInt(item.alder) >= 65 && parseInt(item.alder) <= 79,
            on: true,
        },
        {
            title: '80+ år',
            code: 'age80plus',
            filterValue: (item) => parseInt(item.alder) >= 80,
            on: true,
        },
    ]);

    // useRef hooks
    const minimap: any = useRef(null);

    // Functions
    const onMapReady = (mm: MiniMap.Widget) => {
        // console.log(mm);
        minimap.current = mm;
        const ses = mm.getSession();
        const ds = ses.getDatasource('lk_talomlolland_faciliteter_haller_borger');
        ds.execute({ command: 'read' }, function (rows: FacilitiesRow[]) {
            setFacilitiesData(rows);
            const uniqueLocalities: string[] = getLocalities(rows);
            const options = uniqueLocalities.map((element) => {
                const value = element;
                const label = element;
                return {
                    value,
                    label,
                };
            });
            setSelectOptions(options);
        });
        const dsMarking = ses.getDatasource('lk_talomlolland_faciliteter_haller_map');
        dsMarking.execute({ command: 'read' }, function (markingRows: MarkingRow[]) {
            setMarkingData(markingRows);
        });
        const dsLocalities = ses.getDatasource('lk_talomlolland_faciliteter_lokalitet');
        dsLocalities.execute({ command: 'read' }, function (localitiesRows: LocalitiesRow[]) {
            setLocalitiesData(localitiesRows);
        });
    };

    const handleSliderChange = (event: number) => {
        setSelectedDistanse(distances[event]);
    };

    const onFacilitiesAgeToggle = (rowIndex: number) => {
        const updatedFacilitiesAgesGroups = [...facilitiesAgesGroups];
        updatedFacilitiesAgesGroups[rowIndex].on = !updatedFacilitiesAgesGroups[rowIndex].on;
        setFacilitiesAgesGroups(updatedFacilitiesAgesGroups);
    };

    const handleLocalityFilter = (event: SelectOptions | null) => {
        const locality = event ? event.value : undefined;
        setLocality(locality);
    };

    // useEffect hooks
    useEffect(() => {
        if (minimap.current) {
            if (locality) {
                // console.log('locality er sat!');
                const filteredLocalitiesData = localitiesData.filter((item) => item.navn === locality);
                const markingItem = filteredLocalitiesData.find((item) => item.isokron === selectedDistance.isokron);
                if (markingItem) {
                    const filteredMarkings = markingItem.shape_wkt;
                    minimap.current.getMapControl().setMarkingGeometry(filteredMarkings, true, null, 3000);
                }
            } else {
                // console.log('locality er IKKE sat!');
                const markingItem = markingData.find((item) => item.isokron === selectedDistance.isokron);
                if (markingItem) {
                    const filteredMarkings = markingItem.shape_wkt;
                    minimap.current.getMapControl().setMarkingGeometry(filteredMarkings, false, null, 3000);
                    const mapExtent = forceMapExtent
                        ? getForcedMapExtent()
                        : minimap.current.getMapControl()._mapConfig.getExtent();
                    minimap.current.getMapControl().zoomToExtent(mapExtent);
                }
            }
        }
    }, [selectedDistance, markingData, locality]);

    const facilitiesLocalityTableData: LegendTableData[] = createTableData(
        facilitiesData,
        selectedDistance.distance,
        facilitiesAgesGroups,
        distances,
        locality
    );

    const headers = locality
        ? ['Aldersgrupper', 'km1', 'km2', 'km3', 'km4', 'km5', 'km6', 'km7', 'km8', 'km9', 'km10']
        : [
              'Aldersgrupper',
              'km1',
              'km2',
              'km3',
              'km4',
              'km5',
              'km6',
              'km7',
              'km8',
              'km9',
              'km10',
              `>${selectedDistance.isokron}`,
          ];

    // const handleConsoleLog = () => {
    //     console.log('facilitiesData: ', facilitiesData);
    // };

    // Component return
    return (
        <>
            <div id="facilities-tab-content" className="container hidden">
                <div className="block">
                    <div className="columns">
                        <Map id={facilitiesMinimapId} name="facilities" size="is-6" infoDiv="infoview" onReady={onMapReady} />
                        <div id="infoview"></div>
                        <div className="column">
                            <div className="columns">
                                <div className="column is-6">
                                    <label className="label">Vælg en lokalitet</label>
                                    <Select
                                        name="locality"
                                        options={selectOptions}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        isClearable={true}
                                        isSearchable={true}
                                        onChange={handleLocalityFilter}
                                        placeholder="Filtrer på lokalitet"
                                        theme={(theme) => ({
                                            ...theme,
                                            borderRadius: 4,
                                            colors: {
                                                ...theme.colors,
                                                primary25: '#e4eff9',
                                                primary50: '#3e8ed040',
                                                primary: '#3082c5',
                                            },
                                        })}
                                    />
                                </div>
                                <div className="column is-6">
                                    <label className="label">Vælg en afstand: {selectedDistance.isokron}</label>
                                    <div className="control block">
                                        <Slider
                                            onRangeChange={handleSliderChange}
                                            maxValue={9}
                                            minValue={0}
                                            value={distances.findIndex(
                                                (element) => element.isokron === selectedDistance.isokron
                                            )}
                                        />{' '}
                                    </div>
                                </div>
                            </div>

                            <div id="facilities-localities-table" className="legend block">
                                <MapTable
                                    headers={headers}
                                    data={facilitiesLocalityTableData}
                                    onRowToggle={onFacilitiesAgeToggle}
                                    selectedColumn={selectedDistance.isokron}
                                />
                            </div>
                            {/* <div className="control">
                                <button className="button is-info is-light" onClick={handleConsoleLog} value="console">
                                    Console.log()
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default FacilitiesPage;
