import React, { FC, useRef, useState } from 'react';
import Map from '../components/minimap/Minimap';
import MovesInChart from '../components/movingpatterns/MovesInChart';
import MovesOutChart from '../components/movingpatterns/MovesOutChart';
import { summerhouseMinimapId } from '../../config';

export interface MovingPatternsRow {
    regionsnavn: string;
    tilflyttere: string;
    fraflyttere: string;
    id: string;
    aar: string;
    shape_wkt: { wkt: string };
}
const MovingPatternsPage: FC = () => {
    const minimap: any = useRef(null);
    const [movingPatternsData, setMovingPatternsData] = useState<MovingPatternsRow[]>([]);
    const onMapReady = (mm) => {
        minimap.current = mm;
        const ses = mm.getSession();
        const ds = ses.getDatasource('lk_dem_flytning_flyttedata');
        ds.execute({ command: 'read' }, function (rows: MovingPatternsRow[]) {
            setMovingPatternsData(rows);
        });
    };

    // LABELS
    const years: any[] = [...new Set(movingPatternsData.map((item) => item.aar))];

    // SUGGESTED MAX
    let max = 0;
    years.forEach((element) => {
        const filteredData = movingPatternsData.filter((te) => te.aar === element);
        const fraflyttereTotal: number = filteredData.reduce(
            (total, currentItem) => (total = total + parseInt(currentItem.fraflyttere || '0')),
            0
        );
        const tilflyttereTotal: number = filteredData.reduce(
            (total, currentItem) => (total = total + parseInt(currentItem.tilflyttere || '0')),
            0
        );
        if (tilflyttereTotal > max) {
            max = tilflyttereTotal;
        }
        if (fraflyttereTotal > max) {
            max = fraflyttereTotal;
        }
    });

    return (
        <>
            <div id="patterns-tab-content" className="container">
                <div className="block">
                    <div className="columns">
                        <Map id={summerhouseMinimapId} name="movingpatterns" size="is-5" onReady={onMapReady} />
                        <div className="column">
                            <div className="columns">
                                <div className="column is-half">
                                    <div className="block">
                                        <div className="content">
                                            <p>Tilflytninger</p>
                                            <MovesInChart data={movingPatternsData} max={max} labels={years} />
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="block">
                                        <div className="content">
                                            <p>Fraflytninger</p>
                                            <MovesOutChart data={movingPatternsData} max={max} labels={years} />
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
export default MovingPatternsPage;
