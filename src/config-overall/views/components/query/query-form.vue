<template>
    <a-form ref="formReset" :model="formState" layout="horizontal" class="form-list">
        <a-space class="w-full flex-wrap-wrap">
            <template v-for="(item, index) in configFrom.construction" :key="index">
                <a-form-item
                    v-if="item.type === 'date'"
                    :label="t(`${item.label}`)"
                    :name="item.value"
                    class="mr-2 wrap-box-time"
                    :class="[...className(configFrom.constrClassName), ...className(item.className)]"
                >
                    <date-range-picker
                        v-model="formState[item.value]"
                        :format="item.format"
                        :time-format="item.timeFormat || 'date'"
                        :style="{ width: item.width || '400px' }"
                        @onChange="changeTime($event, item)"
                        :default-select-option="item?.defaultSelectOption"
                        @default-change="
                            ($event) => {
                                changeTime($event, item);
                                handelSearch();
                            }
                        "
                    />
                </a-form-item>
                <slot name="queryItem" :item="item" v-else-if="item.type === 'slot'"></slot>
                <a-form-item
                    v-else
                    :label="t(`${item.label}`)"
                    :name="item.value"
                    :class="[...className(configFrom.constrClassName), ...className(item.className)]"
                >
                    <a-input v-if="item.type === 'input'" v-model:value="formState[item.value]" :placeholder="t(item.placeholder)" />
                    <a-select
                        :mode="item.mode === 'multiple' ? 'multiple' : null"
                        v-if="item.type === 'select'"
                        ref="select"
                        v-model:value="formState[item.value]"
                        :placeholder="$t(item.placeholder)"
                        :show-search="item.isSearch"
                        :filter-option="filterOption"
                    >
                        <a-select-option v-if="showAll(configFrom, item).show && item.isAll !== 2" :value="showAll(configFrom, item).value"
                            >{{ t(`common.${showAll(configFrom, item).label}`) }}
                        </a-select-option>
                        <a-select-option
                            v-for="optionsItem in item?.options"
                            :label="optionsItem.label"
                            :key="optionsItem.value"
                            :value="optionsItem.value"
                            >{{ t(`${optionsItem.label}`) }}</a-select-option
                        >
                    </a-select>
                    <SCoin
                        v-if="item.type === 'coinId'"
                        v-model="formState[item.value]"
                        :pure="!showAll(configFrom, item).show"
                        :placeholder="item.placeholder"
                        :all-value="showAll(configFrom, item).value"
                    />
                    <SLabelIds v-if="item.type === 'labelId'" v-model="formState[item.value]" />
                    <SDitchCard
                        v-if="item.type === 'cardId'"
                        v-model="formState[item.value]"
                        :pure="!showAll(configFrom, item).show"
                        :placeholder="item.placeholder"
                        :all-value="showAll(configFrom, item).value"
                        :ditchCode="item.ditchCode"
                    />
                </a-form-item>
            </template>
        </a-space>
        <!-- 按钮 -->
        <slot name="formButton"></slot>
    </a-form>
</template>

<script lang="ts" setup>
import useComputed from '@/config-overall/hook/useFormAttribute/use-computed';
import useEvnet from '@/config-overall/hook/useFormAttribute/use-evnet';
import type { ConstructionFrom } from '@/config-overall/interface';
import { useI18n } from 'vue-i18n';
withDefaults(
    defineProps<{
        configFrom: ConstructionFrom;
        formState: any;
        handelSearch: () => void;
    }>(),
    {}
);
const { showAll, className } = useComputed();
const { t } = useI18n();
const filterOption = (input: string, option: any) => option.value?.toLowerCase().indexOf(input?.toLowerCase()) >= 0 || option.label?.includes(input);

const emits = defineEmits<{
    changeTime: [...args: any];
}>();
const { changeTime } = useEvnet({ emits });
</script>

<style lang="scss" scoped>
.wrap-box-time {
    width: 490px;
}
</style>
