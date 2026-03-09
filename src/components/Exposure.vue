<template>
    <div class="flex items-center">
        <a-switch v-model:checked="formState[data.value]" :checkedValue="true" :unCheckedValue="false" />
        <span class="ml-10" v-if="!formState[data.value]">全局曝光</span>
    </div>
    <template v-if="formState[data.value]">
        <a-form-item class="translate-y-2" :name="selectValue">
            <template v-if="!multiple">
                <a-radio-group v-model:value="formState[selectValue]">
                    <a-radio :value="2">用户标签</a-radio>
                    <a-radio :value="3">用户UID</a-radio>
                </a-radio-group>
            </template>
            <template v-else>
                <a-checkbox-group v-model:value="formState[selectValue]">
                    <a-checkbox :value="2" name="rangeType">用户标签</a-checkbox>
                    <a-checkbox :value="3" name="rangeType">用户UID</a-checkbox>
                </a-checkbox-group>
            </template>
        </a-form-item>

        <a-form-item v-if="showRangeType(2)" :name="value">
            <a-select
                v-model:value="ProductsTabsId"
                mode="multiple"
                :auto-clear-search-value="autoClearSearchValue"
                placeholder="请选择用户标签"
                :max-tag-count="4"
                :filter-option="filterOption"
                :options="tagList"
                :field-names="{
                    label: 'name',
                    value: 'id',
                }"
                :allow-clear="true"
            >
                <template #option="{ name, color }">
                    <a-tag :color="color">{{ name }}</a-tag>
                </template>

                <template #tagRender="props">
                    <a-tag v-if="props.option" :color="props.option.color" :closable="true" @close="props.onClose">{{ props.option.name }}</a-tag>
                </template>
            </a-select>
            <div class="tips" v-if="data.tips">
                {{ data.tips }}
            </div>
        </a-form-item>
        <a-form-item v-if="showRangeType(3)" :name="value1">
            <a-textarea v-model:value="formState[value1]" placeholder="请输入用户UID" />
        </a-form-item>
    </template>
</template>
<script lang="ts" setup>
import type { TypeTagList } from '@/api/tag/types.d';
import type { UpdateConstructionItem } from '@/config-overall/interface/update';
import UpdateTabsStore from '@/store/config-overall/update-data-tabs';
import useUpdateData from '@/store/config-overall/update-data';
const updateData = useUpdateData();
const updateTabsStore = UpdateTabsStore();
const props = withDefaults(
    defineProps<{
        formState: any;
        data: UpdateConstructionItem;
        type: 'add' | 'edit';
        // 是否多选
        multiple: boolean;
        value: string;
        value1: string;
        selectValue: string;
        selectValue1: string;
    }>(),
    {
        formState: () => ({
            expoType: false,
        }),
        multiple: true,
        value: 'labelIds',
        value1: 'accountIds',
        selectValue: 'rangeValue',
        selectValue1: 'rangeType',
    }
);

const ProductsTabsId = ref<string[]>([]);
const exAccountIds = ref<string>('');
const exlabelIds = ref<string[]>([]);
const isFirst = ref(false);
const { tagList } = toRefs(updateTabsStore);
const showRangeType = computed(() => {
    return (type: 2 | 3 = 2) => {
        if (props.multiple) {
            return props.formState[props.selectValue].includes(type);
        } else {
            return props.formState[props.selectValue] === type;
        }
    };
});
const autoClearSearchValue = ref(true);
const filterOption = (input: string, option: TypeTagList) => {
    const inputs = input.split(',');
    let isOptions = false;
    inputs.map((item) => {
        if ((option.name as string).includes(item.toLocaleUpperCase())) {
            isOptions = true;
        }
    });
    if (isOptions) {
        autoClearSearchValue.value = false;
    }
    return isOptions;
};
const changeIsGobal = (isGobal: boolean) => {
    if (!isGobal) {
        props.formState[props.selectValue] = props.multiple ? [1] : 1;
        props.formState[props.selectValue1] = 1;
        ProductsTabsId.value = [];
        props.formState[props.value] = '';
    }
};
watch(
    () => props.formState[props.data.value],
    (isGobal) => {
        if (!isGobal) {
            changeIsGobal(isGobal);
        }
    },
    {
        immediate: true,
        deep: true,
    }
);
watch(
    () => props.formState[props.value],
    (labelIds) => {
        if (!updateData.open) return false;

        if (labelIds) {
            ProductsTabsId.value = (labelIds as string).split(',');
        }
    },
    {
        immediate: true,
    }
);
watch(
    () => [ProductsTabsId.value],
    ([tabsId]) => {
        props.formState[props.value] = tabsId.length ? tabsId.join(',') : '';
    }
);
watch(
    () => updateData.open,
    (val) => {
        if (!val) {
            ProductsTabsId.value = [];
            exlabelIds.value = [];
            exAccountIds.value = '';
            props.formState.expoType = false;
        } else {
            updateTabsStore.getTagList();
        }
    },
    {
        immediate: true,
    }
);
/**
 * 设置范围类型的值
 * @param rangeType 当前选择的范围类型
 * @param oldRangeType 之前选择的范围类型
 */
const setRangeTypeValue = (rangeType: any, oldRangeType: any) => {
    // 单选模式
    if (!props.multiple) {
        // 选择用户标签
        if (rangeType === 2) {
            // 获取标签列表
            updateTabsStore.getTagList();
            // // 保存当前用户ID到临时变量
            exAccountIds.value = props.formState[props.value1];
            // // 清空表单中的用户ID
            props.formState[props.value1] = '';
            // 恢复之前保存的标签ID
            if (exlabelIds.value.length) {
                ProductsTabsId.value = exlabelIds.value;
            }
        }
        // 选择用户UID
        else if (rangeType === 3) {
            // 保存当前标签ID到临时变量
            exlabelIds.value = ProductsTabsId.value;
            // 清空标签ID
            ProductsTabsId.value = [];
            // 恢复之前保存的用户ID
            if (exAccountIds.value) {
                props.formState[props.value1] = exAccountIds.value;
            }
        }
    }
    // 多选模式
    else {
        // 新增选择用户标签
        if (rangeType.includes(2) && !oldRangeType.includes(2)) {
            // 获取标签列表
            updateTabsStore.getTagList();
            // 恢复之前保存的标签ID
            ProductsTabsId.value = exlabelIds.value;
        } else if (oldRangeType.includes(2) && !rangeType.includes(2)) {
            // 保存当前标签ID到临时变量
            exlabelIds.value = ProductsTabsId.value;
            // 清空标签ID
            ProductsTabsId.value = [];
        }
        // 新增选择用户UID
        if (rangeType.includes(3) && !oldRangeType.includes(3)) {
            // 恢复之前保存的用户ID
            props.formState[props.value1] = exAccountIds.value;
        } else if (oldRangeType.includes(3) && !rangeType.includes(3)) {
            // 保存当前用户ID到临时变量
            exAccountIds.value = props.formState[props.value1];
            // 清空表单中的用户ID
            props.formState[props.value1] = '';
        }
    }
};
watch(
    () => props.formState[props.selectValue],
    (rangeValue, oldRangeValue = []) => {
        if (!updateData.open) return false;
        if (props.multiple) {
            props.formState[props.selectValue1] = (rangeValue as any[]).join(',');
        } else {
            props.formState[props.selectValue1] = rangeValue;
        }
        if (props.formState.expoType) {
            props.formState.expoType = false;
            return false;
        }

        setRangeTypeValue(rangeValue, oldRangeValue);
    },
    {
        immediate: true,
        deep: true,
    }
);
</script>

<style lang="scss" scoped>
.tips {
    color: #ff4d4f;
}
</style>
