import React, {useMemo, useState} from "react";

// How quickly the animation accelerates towards larger numbers.
// Must be bigger than 1.
const ANIMATION_ACCELERATION = 1.3;

interface IProps {
    target: number;
    duration: number;
    callback?: () => any;
}

const calcFrameTimes = (steps: number, total: number): number[] => {
    const times = [];
    let totalTimes = 0;
    for (let i = 0; i < steps; i++) {
        const value = ANIMATION_ACCELERATION ** (i + 1);
        times.push(value);
        totalTimes += value;
    }
    return times.map((t) => (t * total) / totalTimes);
};

export const Counter: React.FunctionComponent<IProps> = (props) => {
    const target = Math.round(props.target);
    const distance = Math.abs(target);
    const increment = props.target < 0 ? -1 : 1;

    const frameTimes = useMemo(
        () => calcFrameTimes(distance, props.duration),
        [],
    );

    const [current, setCurrent] = useState<number>(0);

    if (target !== current) {
        setTimeout(() => setCurrent(current + increment), frameTimes[current]);
    } else {
        if (props.callback) {
            props.callback();
        }
    }

    return <span>{current}</span>;
};
