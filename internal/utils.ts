
import colors from './colors';
export const toPrettyNumber = (numValue: number) => {
	return new Intl.NumberFormat().format(numValue);
}

export const getBackgroundColor = (start: number)=>{
	if (start){
	  const arr1 = colors.bgColors.slice(start);
	  const arr2 = colors.bgColors.slice(0,start);
	  return arr1.concat(arr2); 
	} else {
	  return colors.bgColors;
	}
}

export const getBorderColor = (start: number)=>{
  if (start){
    const arr1 = colors.borderColors.slice(start);
    const arr2 = colors.borderColors.slice(0,start);
    return arr1.concat(arr2); 
  } else {
    return colors.borderColors;
  }
}

export const getForcedMapExtent = () => {
    const minx = parseInt('[cbinfo.map.minx.wc]');
    const maxx = parseInt('[cbinfo.map.maxx.wc]');
    const miny = parseInt('[cbinfo.map.miny.wc]');
    const maxy = parseInt('[cbinfo.map.maxy.wc]');
    const mapExtent: number[] = [minx,miny,maxx,maxy];
    return mapExtent
}