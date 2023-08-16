
import colors from './colors';
export const toPrettyNumber = (numValue) => {
	return new Intl.NumberFormat().format(numValue);
}

export const getBackgroundColor = (start)=>{
	if (start){
	  const arr1 = colors.bgColors.slice(start);
	  const arr2 = colors.bgColors.slice(0,start);
	  return arr1.concat(arr2); 
	} else {
	  return colors.bgColors;
	}
}

export const getBorderColor = (start)=>{
  if (start){
    const arr1 = colors.borderColors.slice(start);
    const arr2 = colors.borderColors.slice(0,start);
    return arr1.concat(arr2); 
  } else {
    return colors.borderColors;
  }
}