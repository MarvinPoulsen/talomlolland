import React from 'react';
import './slider.scss';

export interface Sliderprops {
    onRangeChange: (value: number) => void;
    maxValue: number;
    minValue: number;
    value: number;
}

const Slider = (props: Sliderprops) => {
    // console.log('Sliderprops: ',props)
    const handleChange = (e) => {
        props.onRangeChange(e.target.value);
    };

    const getBackgroundSize = () => {
        return {
            backgroundSize: `${
                ((props.value - props.minValue) * 100) /
                (props.maxValue - props.minValue)
            }% 100%`,
        };
    };
    return (
        <>
                    <input
                        type="range"
                        min={props.minValue}
                        max={props.maxValue}
                        onChange={handleChange}
                        style={getBackgroundSize()}
                        value={props.value}
                    />
        </>
    );
};

export default Slider;
