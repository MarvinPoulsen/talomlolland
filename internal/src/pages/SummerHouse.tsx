import React, { FC, useRef, useState } from 'react';
import Map from '../components/minimap/Minimap';
import SummerhouseCountChart from '../components/summerhousecount/SommerhouseCountChart';
import SummerhouseCountTable from '../components/summerhousecount/SummerhouseCountTable';
import SummerhouseOwnerTable from '../components/summerhouseowner/SummerhouseOwnerTable';
import SummerhouseOwnerBarchart from '../components/summerhouseowner/SummerhouseOwnerBarchart';
import { summerhouseMinimapId } from '../../config';

export interface SummerhouseRow {
    tomme_sommerhusgrunde_count: string;
    ubeboede_count: string;
    beboede_count: string;
    id: string;
    navn: string;
    shape_wkt: { wkt: string };
}
export interface SummerhouseOwnerRow {
    region: string;
    count: string;
    id: string;
}
const SummerHousePage: FC = () => {
    const minimap: any = useRef(null);
    const [summerhouseData, setSummerhouseData] = useState<SummerhouseRow[]>([]);
    const [summerhouseOwnerData, setSummerhouseOwnerData] = useState<SummerhouseOwnerRow[]>([]);
    const onMapReady = (mm) => {
        minimap.current = mm;
        const ses = mm.getSession();
        const ds = ses.getDatasource('lk_talomlolland_sommerhusomrader_navne');
        ds.execute({ command: 'read' }, function (rows: SummerhouseRow[]) {
            setSummerhouseData(rows);
        });
        const dsRegion = ses.getDatasource('lk_talomlolland_ejer_bopalsregion');
        dsRegion.execute({ command: 'read' }, function (ownerRows: SummerhouseOwnerRow[]) {
            setSummerhouseOwnerData(ownerRows);
        });
    };
    const onChartHover = (omraade?: SummerhouseRow) => {
        if (omraade) {
            minimap.current.getMapControl().setMarkingGeometry(omraade.shape_wkt, false, null, 3000);
        } else {
            minimap.current.getMapControl().setMarkingGeometry();
        }
    };
    const onChartClick = (omraade?: SummerhouseRow) => {
        if (omraade) {
            minimap.current.getMapControl().setMarkingGeometry(omraade.shape_wkt, true, null, 2500);
        } else {
            minimap.current.getMapControl().setMarkingGeometry();
        }
    };
    const tommeSommerhusgrundeSum: number = summerhouseData.reduce(
        (total, currentItem) => (total = total + parseInt(String(currentItem.tomme_sommerhusgrunde_count || 0))),
        0
    );

    let sommerhusSum = 0;

    const ubeboedeSommerhusSum: number = summerhouseData.reduce(
        (total, currentItem) => (total = total + parseInt(String(currentItem.ubeboede_count || 0))),
        0
    );
    const beboedeSommerhusSum: number = summerhouseData.reduce(
        (total, currentItem) => (total = total + parseInt(String(currentItem.beboede_count || 0))),
        0
    );
    sommerhusSum = ubeboedeSommerhusSum + beboedeSommerhusSum;

    return (
        <>
            <div id="summerhouse-tab-content" className="container">
                <div className="block">
                    <div className="columns">
                        <Map id={summerhouseMinimapId} name="summerhouse" size="is-5" onReady={onMapReady} />
                        <div className="column">
                            <div className="block">
                                {minimap.current && (
                                    <SummerhouseCountChart
                                        data={summerhouseData}
                                        onHover={onChartHover}
                                        onClick={onChartClick}
                                    />
                                )}
                            </div>
                            <div className="block">
                                <div className="content">
                                    <h1>Fakta om sommerhuse i Lolland Kommune</h1>
                                    <p id="total-summerhouse">
                                        I Lolland Kommune findes {sommerhusSum} sommerhuse inden for sommerhusområderne.
                                    </p>
                                    <p id="empty-summerhouse">
                                        Desuden findes {tommeSommerhusgrundeSum} tomme sommerhusgrunde i allerede lokalplanlagte
                                        sommerhusområder.
                                    </p>
                                    <p>
                                        Bebyggelsen i sommerhusområderne reguleres dels af lokalplaner og dels af deklarationer.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="block">
                    <div className="columns">
                        <SummerhouseCountTable data={summerhouseData} />
                    </div>
                </div>
                <div className="block">
                    <div className="columns">
                        <div className="column is-7">
                            <div className="content">
                                <h6>Sommerhusejernes bopæl vist som tabel</h6>
                                <SummerhouseOwnerTable data={summerhouseOwnerData} />
                            </div>
                        </div>
                        <div className="column">
                            <div className="block">
                                <div className="content">
                                    <h6>Sommerhusejernes bopæl vist som graf</h6>
                                    <SummerhouseOwnerBarchart
                                        data={summerhouseOwnerData}
                                        onHover={onChartHover}
                                        onClick={onChartClick}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default SummerHousePage;
