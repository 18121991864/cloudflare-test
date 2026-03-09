export function transMapBySelectOptions<T = any, U = any, R = any>(
    map: Map<T, U>,
    callback?: (key: T, value: U) => R
): U[] | R[] {
    if (callback) {
        const result: R[] = [];
        map.forEach((value, key) => {
            result.push(callback(key, value));
        });
        return result;
    } else {
        return Array.from(map.values());
    }
}

export function unshiftSelectOptionAll<T = any>(options: T[]) {
    options.unshift({ label: '全部', value: '' } as T);
}
