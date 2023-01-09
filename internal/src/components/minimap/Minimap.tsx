import React, { FC, useEffect } from 'react';
import './minimap.scss';

interface mapProps {
  id: string;
  name: string;
  size: string;
  onReady: (mm: any) => void;
}
declare const MiniMap: any;
const Map: FC = (props: mapProps) => {
  useEffect(() => {
    MiniMap.createMiniMap({
      mapDiv: props.name + '-minimapbody',
      minimapId: props.id,
      initCallback: props.onReady,
    });
  }, []);
  return (
    <>
      <div id={props.name + '-minimapbody'} className={'column '+props.size}></div>
    </>
  );
};
export default Map;
