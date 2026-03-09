export const userDebounce = () => {
    let time: null | any = null;
    return (callback: () => void, timeliness?: number) => {
        if (time) {
            clearTimeout(time);
            time = null;
        }
        time = setTimeout(() => {
            clearTimeout(time);
            time = null;
            callback();
        }, timeliness || 1000);
    };
};
