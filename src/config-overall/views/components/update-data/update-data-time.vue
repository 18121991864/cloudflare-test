<template>
    <a-form-item :label="item.label" :name="isRequire(item.value, item?.isRuqire)">
        <a-range-picker
            :disabled="item.disabled"
            v-model:value="useUpdateTime.dates"
            class="w-10/12"
            format="YYYY-MM-DD HH:mm:ss"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            :placeholder="['开始时间', '结束时间']"
            :disabled-date="disabledDate"
            :disabled-time="disabledTime"
            @change="changeTime"
            :show-time="true"
        />
    </a-form-item>
</template>

<script lang="ts" setup>
import type { FromType } from '@/config-overall/interface';
import type { UpdateConstructionItem } from '@/config-overall/interface/update';
import dayjs, { Dayjs } from 'dayjs';
import useUpdateTimeStore from '@/store/config-overall/update-data-time';
const props = withDefaults(
    defineProps<{
        type: FromType;
        format: 'timeStamp' | 'date';
        item: UpdateConstructionItem;
        open: boolean;
        formState: any;
        isRequire: (value: string, require?: boolean) => string;
    }>(),
    {
        type: 'timePicker',
        format: 'timeStamp',
        open: false,
    }
);
const useUpdateTime = useUpdateTimeStore();

const currentDate = dayjs();
const disabledDate = (current: Dayjs) => {
    // 禁用当前时间之前的日期
    return current && current.isBefore(currentDate, 'day');
};

const disabledTime = (selectedDate: Dayjs) => {
    if (selectedDate && selectedDate.isSame(currentDate, 'day')) {
        // 获取当前时间的小时、分钟和秒
        const currentHour = currentDate.hour();
        const currentMinute = currentDate.minute();
        const currentSecond = currentDate.second();

        return {
            disabledHours: () => {
                const hours = Array.from({ length: 24 }, (_, i) => i);
                // 禁用当前小时之前的小时
                return hours.filter((hour) => hour < currentHour);
            },
            disabledMinutes: () => {
                const minutes = Array.from({ length: 60 }, (_, i) => i);
                // 禁用当前分钟之前的分钟
                if (selectedDate.hour() === currentHour) {
                    return minutes.filter((minute) => minute < currentMinute);
                }
                return [];
            },
            disabledSeconds: () => {
                const seconds = Array.from({ length: 60 }, (_, i) => i);
                // 禁用当前秒之前的秒
                if (selectedDate.hour() === currentHour && selectedDate.minute() === currentMinute) {
                    return seconds.filter((second) => second <= currentSecond);
                }
                return [];
            },
        };
    }
};
const changeTime = (date: Array<string | null>) => {
    if (props.format === 'date') return false;
    const time1 = date[0] ? dayjs(date[0]).unix() : '';
    const time2 = date[1] ? dayjs(date[1]).unix() : '';
    props.formState[props.item.value] = String(time1);
    props.formState[props.item?.value1] = String(time2);
};
watch(
    () => props.open,
    (val) => {
        if (!val) {
            useUpdateTime.setDates('', '');
        }
    }
);
</script>

<style lang="scss" scoped>
.user-radio {
    display: flex;
    flex-direction: row;
}
</style>
