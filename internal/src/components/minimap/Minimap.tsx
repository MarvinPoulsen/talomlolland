import React, { useEffect } from 'react';
import './minimap.scss';

interface mapProps {
    id: string;
    name: string;
    size: string;
    searchDiv?: string;
    infoDiv?: string;
    themeDiv?: string;
    onReady: (mm: any) => void;
}
declare const MiniMap: any;
const Map = (props: mapProps) => {
    useEffect(() => {
        MiniMap.createMiniMap({
            mapDiv: props.name + '-minimapbody',
            minimapId: props.id,
            searchDiv: props.searchDiv ? props.searchDiv : undefined,
            infoDiv: props.infoDiv ? props.infoDiv : undefined,
            themeDiv: props.themeDiv ? props.themeDiv : undefined,
            initCallback: props.onReady,
        });
    }, []);
    return (
        <>
            <div id={props.name + '-minimapbody'} className={'column ' + props.size}></div>
        </>
    );
};
export default Map;
