import cookies from 'cookies-js';
export default defineStore('UseTimezoneStore', () => {
    const timezone = ref('UTC');
    const selectTimeOptions = ref([
        {
            label: 'UTC+0',
            value: 'UTC',
            code: '+UTC+0',
        },
        // {
        //     label: 'UTC+4',
        //     value: 'Asia/Dubai',
        //     code: '+UTC+4',
        // },
        // {
        //     label: 'UTC+8',
        //     value: 'Asia/Shanghai',
        //     code: '+UTC+8',
        // },
    ]);
    const timezoneCallback = (val: Number, isTz: boolean = false) => {
        if (!val) return '';

        return isTz ? dayjs.tz(val, timezone.value) : dayjs(val);
    };
    const initTimezone = () => {
        const value = cookies.get('timezone') || '+UTC+0';
        const item = selectTimeOptions.value.find((item) => item.code === value);
        timezone.value = item?.value || 'UTC';
    };
    const setTimezone = (value: string) => {
        const item = selectTimeOptions.value.find((item) => item.value === value);
        timezone.value = item?.value;
    };

    initTimezone();
    return {
        timezone,
        selectTimeOptions,
        timezoneCallback,
        setTimezone,
    };
});
