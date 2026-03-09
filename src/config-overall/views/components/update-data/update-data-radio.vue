<template>
    <a-radio-group v-model:value="formState[item.value]">
        <template v-if="item.type === 'radio-input'">
            <a-radio
                @change="changeRadio"
                :disabled="item.disabled"
                v-for="list in item.selectOptions"
                :key="list.value"
                class="itemRedio"
                :value="list.value"
            >
                <div class="flex">
                    <span>{{ list.label }}</span>
                    <template v-if="list.suffixLable">
                        <a-input
                            class="w-20 mx-2.5 mb-2.5 self-center"
                            v-model:value="formState[list.data as string]"
                            :placeholder="item.placeholder1"
                            :disabled="list.disabled || item.disabled"
                            @change="changeInput"
                        />
                        <span> {{ list.suffixLable }}</span>
                    </template>
                </div>
            </a-radio>
        </template>
        <template v-else-if="item.type === 'radio-button'">
            <div :class="item.redioButtonOptions?.show ? ['mt-1 h-14'] : ''">
                <a-radio @change="changeRadio" :disabled="item.disabled" v-for="list in item.selectOptions" :key="list.value" :value="list.value">
                    {{ list.label }}
                </a-radio>
                <div class="text-left use-title" v-if="item.redioButtonOptions?.show">
                    <a-button type="link" class="p-0" :disabled="disabledClick(item)" @click="handelClick">{{
                        item.redioButtonOptions?.title
                    }}</a-button>
                    <component :is="item.redioButtonOptions.components?.componentName" v-if="item.redioButtonOptions.components" />
                </div>
            </div>
        </template>
    </a-radio-group>
</template>

<script lang="ts" setup>
import type { FromType } from '@/config-overall/interface';
import type { UpdateConstructionItem } from '@/config-overall/interface/update';

const props = withDefaults(
    defineProps<{
        type: FromType;
        item: UpdateConstructionItem;
        formState: any;
        constructionItem: any;
    }>(),
    {
        type: 'radio-input',
        name: '',
    }
);
const changeRadio = (e: any) => {
    const redioButtonOptions = props.item.redioButtonOptions;
    const redioInputOptions = props.item.redioInputOptions;

    if (redioButtonOptions) {
        redioButtonOptions.callback(props.item, e.target.value, props.constructionItem);
    } else if (redioInputOptions) {
        redioInputOptions.callback(props.item, e.target.value, props.constructionItem);
    }
};
const changeInput = (e: any) => {
    props.item.redioInputOptions?.change(props.item, e.target.value);
};
const handelClick = () => {
    const clickCallback = props.item.redioButtonOptions?.clickCallback;
    if (clickCallback) {
        clickCallback(props.item);
    }
};
const disabledClick = computed(() => {
    return (item: UpdateConstructionItem) => {
        if (item.redioButtonOptions?.disabled === false) {
            return false;
        }
        if (item.disabled) {
            return true;
        }
        return false;
    };
});
</script>

<style lang="scss" scoped>
.itemRedio {
    display: flex;
    align-items: center;
    &:nth-child(1) {
        margin-bottom: 10px;
    }
    span {
        margin-top: 6px;
    }
    :deep(.ant-radio) {
        margin-top: 6px;
        align-self: start;
    }
}
.use-title {
    position: absolute;
    left: 0;
    bottom: -8px;
}
.ant-input-disabled {
    background-color: rgba(0, 0, 0, 0.04) !important;
    border-color: #d9d9d9 !important;
}
.ant-input-status-error {
    background-color: #fff;
    &:hover {
        background-color: #fff;
    }
}
</style>
