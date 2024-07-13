import { useMemo } from "react";

function debounce(callback: Function, delay: number) {
    let timerId: any;
    return function (this: any, ...args: any[]) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            callback.apply(this, args);
        }, delay);
    };
}


export const useDebouncedFunction = <T extends (...args: any[]) => any>(callback: T, delay: number = 600) => {
    return useMemo(() => debounce(callback, delay), [callback, delay]);
};