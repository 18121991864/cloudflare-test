import { ConstructionFrom, ConstructionItem } from '@/config-overall/interface';

interface updateEvent {
    emits: (params: any, ...args: any) => any;
}

export default ({ emits }: updateEvent) => {
    // 时间筛选
    const changeTime = (times: Array<number | string>, item: ConstructionItem) => {
        times.forEach((item, index) => {
            times[index] = item || '';
        });
        if (!item.timeValue || !Array.isArray(item.timeValue)) {
            throw new Error('时间筛选 请传入timeValue数组！！');
        }
        if (item.timeValue.length < 2) {
            throw new Error('timeValue必须传两个值');
        }
        emits('changeTime', times, item);
    };
    return {
        changeTime,
    };
};
