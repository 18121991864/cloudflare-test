import dayjs, { Dayjs } from 'dayjs';
interface types {
    data: any;
    value1: string;
    value2: string;
}
export default defineStore('useUpdateTime', () => {
    // @ts-ignore
    const dates = ref<[Dayjs, Dayjs]>([]);
    const setDates = (start: any, end: any, item?: types) => {
        dates.value[0] = start;
        dates.value[1] = end;

        if (start === '' || end === '') return false;
        const time1 = dayjs(start).unix();
        const time2 = dayjs(end).unix();
        if (item) {
            item.data[item.value1] = time1;
            item.data[item.value2] = time2;
        }
    };

    return {
        dates,
        setDates,
    };
});
