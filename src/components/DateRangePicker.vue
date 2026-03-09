<template>
    <a-space direction="horizontal">
        <a-form-item-rest>
            <a-date-picker
                v-if="mode === 'time'"
                v-model:value="start"
                style="width: 190px"
                :disabled-date="disabledStartDate"
                :show-time="props.format === 'YYYY-MM-DD' ? false : { defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
                :placeholder="$t('common.StartTime')"
                :showNow="false"
            >
            </a-date-picker>
            <a-date-picker
                style="width: 220px"
                v-else
                v-model:value="start"
                :disabled-date="disabledStartDate"
                :placeholder="$t('common.StartTime')"
                :mode="mode"
                :showToday="false"
            >
            </a-date-picker>
            ~
            <a-date-picker
                v-if="mode === 'time'"
                v-model:value="end"
                style="width: 190px"
                :disabled-date="disabledEndDate"
                :show-time="props.format === 'YYYY-MM-DD' ? false : { defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
                :placeholder="$t('common.EndTime')"
                :showNow="false"
            >
            </a-date-picker>
            <a-date-picker
                v-else
                v-model:value="end"
                :disabled-date="disabledEndDate"
                :placeholder="$t('common.EndTime')"
                :mode="mode"
                @ok="calendarChange"
                :showToday="false"
            />
        </a-form-item-rest>
    </a-space>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { Dayjs, ManipulateType } from 'dayjs';
import dayjs from 'dayjs';
import cookies from 'cookies-js';
const format = 'YYYY-MM-DD HH:mm:ss';

interface DateRangePickerProps {
    mode?: 'time' | 'week' | 'month' | 'date';
    modelValue: (string | number | undefined)[];
    format?: string;
    timeFormat?: string;
    defaultSelectOption?: {
        time: number;
        format?: ManipulateType;
    };
    dayNumber?: number;
}

const props = withDefaults(defineProps<DateRangePickerProps>(), {
    mode: 'time',
    format,
    timeFormat: 'timeStamp',
});
const emit = defineEmits(['update:modelValue', 'onChange', 'defaultChange']);
const isDefalutSelect = ref(false);
const timezone = cookies.get('timezone');
const getDate = (value: string | number | undefined, format: string, timeFormat: string) => {
    if (timeFormat === 'date') {
        return value ? dayjs(String(value)) : null;
    } else {
        return value ? dayjs(value, format) : null;
    }
};

const formatDate = (value: Dayjs | null, format: string) => {
    return value ? value.format(format) : '';
};

const start = computed<Dayjs | null>({
    get() {
        const [start] = props.modelValue ?? [];
        const time = getDate(start, props.format, props.timeFormat);
        return time;
    },
    set(val: Dayjs | null) {
        const formattedStart = formatDate(val, props.format);
        const formattedEnd = formatDate(end.value, props.format);
        emit('update:modelValue', [formattedStart, formattedEnd]);
        emit('onChange', [formattedStart, formattedEnd]);
    },
});

const end = computed<Dayjs | null>({
    get() {
        const [, end] = props.modelValue ?? [];
        return getDate(end, props.format, props.timeFormat);
    },
    set(val: Dayjs | null) {
        const formattedStart = formatDate(start.value, props.format);
        const formattedEnd = formatDate(val, props.format);
        emit('update:modelValue', [formattedStart, formattedEnd]);
        emit('onChange', [formattedStart, formattedEnd]);
    },
});

const disabledStartDate = (current: Dayjs) => {
    if (!current) return false;
    // dayNumber 限制：如果传了 dayNumber，开始时间不能早于（结束时间 - dayNumber天）
    if (props.dayNumber && end.value) {
        const minStartDate = dayjs(end.value).subtract(props.dayNumber, 'day').startOf('day');
        return current < minStartDate || current > dayjs(end.value).endOf('day');
    }
    
    // 原有限制：开始时间不能晚于结束时间
    if (end.value && current > dayjs(end.value).endOf('day')) {
        return true;
    }
    
    
    return false;
};

const disabledEndDate = (current: Dayjs) => {
    if (!current) return false;
    // dayNumber 限制：如果传了 dayNumber，结束时间不能晚于（开始时间 + dayNumber天）
    if (props.dayNumber && start.value) {
        const maxEndDate = dayjs(start.value).add(props.dayNumber, 'day').endOf('day');
        return current > maxEndDate || current < dayjs(start.value).startOf('day');
    }
    
    // 原有限制：结束时间不能早于开始时间
    if (start.value && current < dayjs(start.value).startOf('day')) {
        return true;
    }
    
    
    return false;
};

const defaultSelectDate = () => {
    if (props.defaultSelectOption && !isDefalutSelect.value) {
        isDefalutSelect.value = true;
        const format = props.defaultSelectOption?.format;

        props.defaultSelectOption!.format = format ? format : 'hours';
        let offset = 0;

        if (timezone === '+UTC+4') {
            offset = 4;
        } else if (timezone === '+UTC+8') {
            offset = 8;
        }
        const strt = dayjs().subtract(props.defaultSelectOption!.time, props.defaultSelectOption!.format).utcOffset(offset);
        const end = dayjs().utcOffset(offset);
        const formattedStart = formatDate(strt, props.format);
        const formattedEnd = formatDate(end, props.format);

        emit('update:modelValue', [formattedStart, formattedEnd]);
        emit('defaultChange', [formattedStart, formattedEnd]);
    }
};

defaultSelectDate();

defineOptions({
    name: 'DateRangePicker',
});
</script>
