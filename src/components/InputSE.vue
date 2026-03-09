<template>
  <a-space direction="horizontal">
    <a-input v-model:value="start" size="small" placeholder="请输入"/> ~
    <a-input v-model:value="end" size="small" placeholder="请输入"/>
  </a-space>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
    name: 'InputSE',
    props: {
        mode: { type: String, default: undefined }, // 模式 week , month , date
        modelValue: { type: Array, required: true }
    },
    setup(props, context) {
        const start = computed<string|null>({
            get() {
                const [start] = props.modelValue ?? [];
                return start ? String(start) : null;
            },
            set(val:string|null) {
                // eslint-disable-next-line no-use-before-define
                context.emit('update:modelValue', [val ?? null, end.value ?? null]);
            }
        });
        const end = computed<string|null>({
            get() {
                const [, end] = props.modelValue ?? [];
                return end ? String(end) : null;
            },
            set(val:string|null) {
                context.emit('update:modelValue', [start.value ?? null, val ?? null]);
                context.emit('onChange');
            }
        });

        return {
            start,
            end
        };
    }
});
</script>
