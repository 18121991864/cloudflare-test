<template>
    <a-form ref="formRef" class="pt-6">
        <a-form-item label="时区切换" name="timezone">
            <a-select ref="select" v-model:value="timeStore.timezone" style="width: 120px" @change="handleChange">
                <a-select-option v-for="item in timeStore.selectTimeOptions" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
        </a-form-item>
    </a-form>
</template>
<script setup lang="ts">
import useTimezoneStore from '@/store/timezone';
import cookies from 'cookies-js';
const timeStore = useTimezoneStore();
const handleChange = (value: string) => {
    const code = timeStore.selectTimeOptions.find((item) => item.value === value)?.code;
    cookies.set('timezone', code);
};
</script>
