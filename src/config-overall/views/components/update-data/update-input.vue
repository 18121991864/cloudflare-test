<template>
    <a-input-number
        v-model:value="formState[item.value]"
        :disabled="item.disabled"
        :placeholder="t(item.placeholder)"
        :controls="false"
        v-if="type === 'input-number'"
    />
    <div v-else-if="type === 'input-button'">
        <a-input
            class="w-3/4"
            :disabled="item.disabled"
            :style="{ width: item.inputButtonOptions?.width }"
            :placeholder="t(item.placeholder)"
            v-model:value="formState[item.value]"
            @blur="handelBulur"
        />
        <a-button type="link" :disabled="item.disabled" @click="handelClick">{{ item.inputButtonOptions?.title }}</a-button>
    </div>
    <div v-else-if="item.type === 'textarea'">
        <a-textarea v-model:value="formState[item.value]" show-count :maxlength="200" />
    </div>
</template>

<script lang="ts" setup>
import type { FromType } from '@/config-overall/interface';
import type { UpdateConstructionItem } from '@/config-overall/interface/update';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();


const props = withDefaults(
    defineProps<{
        type: FromType;
        item: UpdateConstructionItem;
        formState: any;
    }>(),
    {
        type: 'input-number',
    }
);
const handelClick = async () => {
    props.item.inputButtonOptions?.callback(props.item);
};
const handelBulur = async () => {
    const blur = props.item.inputButtonOptions?.blur;

    if (blur && typeof blur === 'function') {
        blur(props.item);
    }
};
</script>

<style lang="scss" scoped>
.ant-input[disabled] {
    background-color: #f5f5f5;
}
</style>
