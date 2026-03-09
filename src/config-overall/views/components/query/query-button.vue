<template>
    <div class="action-btm display-flex flex-justify-content-space-between">
        <div class="display-flex">
            <a-button
                v-if="showBtns['exportBtns']"
                block
                type="primary"
                size="small"
                class="search-submit-btn"
                :loading="loadExportExcel"
                @click="handExport"
            >
                <template #icon>
                    <VerticalAlignBottomOutlined />
                </template>
                导出
            </a-button>
            <slot name="addBtn">
                <a-button
                    v-if="showBtns['addBtns']"
                    block
                    type="primary"
                    size="small"
                    style="padding: 0 8px; box-sizing: content-box"
                    class="search-submit-btn"
                    @click.stop="handelUpateData('add', configFrom.btns.addBtns as any)"
                >
                    <template #icon>
                        <PlusOutlined />
                    </template>
                    {{ configFrom.btns.addBtns?.title || '新增' }}
                </a-button>
            </slot>
            <a-button
                v-if="showBtns['setshotBtns']"
                :loading="ShotButton"
                block
                type="primary"
                size="small"
                class="search-submit-btn"
                @click.stop="handelUpdateShot(configFrom)"
            >
                <template #icon>
                    <TagsOutlined />
                </template>
                {{ configFrom.btns.setshotBtns?.title || '生成快照' }}
            </a-button>
            <slot name="button" :data="configFrom">
                <div></div>
            </slot>
        </div>
        <div class="display-flex">
            <a-button v-if="showBtns['queryBtns']" block type="primary" size="small" class="search-submit-btn" @click.stop="handelSearch">
                <template #icon>
                    <SearchOutlined />
                </template>
                {{ $t('common.search') }}
            </a-button>
            <a-button v-if="showBtns['queryBtns']" block size="small" class="search-reset-btn" @click.stop="handelResetFields">
                <template #icon>
                    <RedoOutlined />
                </template>
                {{ $t('common.Reset') }}
            </a-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { ConstructionFrom } from '@/config-overall/interface';

import type { UpdateConstructionType } from '@/config-overall/interface/update';
import { SearchOutlined, RedoOutlined, PlusOutlined, VerticalAlignBottomOutlined, TagsOutlined } from '@ant-design/icons-vue';
import useComputed from '@/config-overall/hook/useBtnsEvent/use-computed';
import useEvnet from '@/config-overall/hook/useBtnsEvent/use-evnet';
import updateStore from '@/config-overall/views/store/updateStore';

const props = withDefaults(
    defineProps<{
        configFrom: ConstructionFrom;
        loadExportExcel: boolean;
        handExport: () => void;
        handelUpateData: (type: 'add' | 'info' | 'edit', item: UpdateConstructionType, data?: any) => void;
        handelSearch: () => void;
        handelResetFields: () => void;
    }>(),
    {
        loadExportExcel: false,
    }
);
const getShowButtons = (configFrom: ConstructionFrom) => {
    getShowButton(configFrom);
};

const store = updateStore();

watch(
    () => [props.configFrom.tabsPangeConfig?.activeKey, store.tabsActiveKey],
    (value) => {
        if (!value.length) return false;
        getShowButtons(props.configFrom);
    }
);

const { getShowButton, showBtns } = useComputed();
const { handelUpdateShot, ShotButton } = useEvnet();

defineExpose({
    getShowButtons,
    showBtns,
});
</script>

<style lang="less" scoped></style>
