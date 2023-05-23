import React, { FC, useRef, useState } from 'react';
import Map from '../components/minimap/Minimap';
import { residentagesMinimapId } from '../../config';

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
    shape_wkt: { wkt: string };
}
const ResidentAgesPage: FC = () => {
    const minimap: any = useRef(null);
    const [residentAgesData, setResidentAgesData] = useState([]);
    const [cityArea, setCityArea] = useState(['Nakskov']); // alternativ 'Maribo'
    const [residentialArea, setResidentialArea] = useState(['']); // alternativ 'Maribo'
    const onMapReady = (mm) => {
        minimap.current = mm;
        const ses = mm.getSession();
        const ds = ses.getDatasource('lk_talomlolland_bolig_aar_beboer_alder');
        ds.execute({ command: 'read' }, function (rows: ResidentAgesRow[]) {
            setResidentAgesData(rows);
        });
    };
    console.log('residentAgesData: ',residentAgesData)
    return (
        <>
            <div id="residentages-tab-content" className="container hidden">
                <div className="block">
                    <div className="columns">
                        <Map id={residentagesMinimapId} name="residentages" size="is-6" onReady={onMapReady} />
                        <div className="column is-6"></div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ResidentAgesPage;
