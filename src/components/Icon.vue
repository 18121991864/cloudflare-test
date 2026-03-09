<script setup lang="ts">
import { createFromIconfontCN } from '@ant-design/icons-vue';
const Icon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_5034219_o0ozxgpmfz.js', // 在 iconfont.cn 上生成
});

const props = defineProps({
    iconType: {
        type: String,
        default: () => '',
    },
});
</script>

<template>
    <Icon :type="props.iconType" />
</template>

<style scoped lang="scss"></style>
