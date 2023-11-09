import React, { FC, useRef, useState } from 'react';
import Map from '../components/minimap/Minimap';
import { heatplanMinimapId } from '../../config';

export interface HeatPlanRow {
    id: number;
    navn: string;
    dato: Date;
    varmeinstallation: string;
    total_count: number;
    samlerhvervareal: number;
    bygningenssamlboligareal: number;
    shape_wkt: { wkt: string };
}

const HeatPlanPage: FC = () => {
    const minimap: any = useRef(null);
    const [heatPlanData, setHeatPlanData] = useState([]);
    const onMapReady = (mm) => {
        minimap.current = mm;
        const ses = mm.getSession();
        const ds = ses.getDatasource('lk_varmeplan_landsbyer_varmeplan');
        ds.execute({ command: 'read' }, function (rows: HeatPlanRow[]) {
            setHeatPlanData(rows);
        });
    };

console.log('heatPlanData: ',heatPlanData)

    return (
        <>
        <div id="heatplan-tab-content" className="container">
            <div className="block">
                <div className="columns">
                    <Map id={heatplanMinimapId} name="heatplan" size="is-5" onReady={onMapReady} />
                    <div className="column">
                        <div className="block">
                            {minimap.current && (
                                <p>Varmeplan</p>
                            )}
                        </div>
                        </div>
                    </div>
                </div>
                </div>
        </>
    );
};
export default HeatPlanPage;
