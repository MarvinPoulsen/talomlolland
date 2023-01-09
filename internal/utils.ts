
export const toPrettyNumber = (numValue) => {
	return new Intl.NumberFormat().format(numValue);
}