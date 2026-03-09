<template>
    <!-- @vue-ignore -->
    <a-table
        :loading="isLoading"
        :data-source="dataSource"
        :columns="Tableheaders(tabelConfig).map((item) => ({ ...item, title: t(`${item.title}` as any) }))"
        :scroll="{
            x: tabelConfig.scroll?.x || 1100,
            y: tabelConfig.scroll?.y || 500,
        }"
        :pagination="paginationConfig"
        :row-selection="tabelConfig.rowSelection"
        @change="handleSizeChange"
        :row-key="(record) => record[tabelConfig.rowKey || 'id']"
        :key="renderKey"
    >
        <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'operate'">
                <slot name="operate" :data="{ column, text, record }"></slot>
            </template>
            <template v-else-if="tabelConfig?.imgCustom?.includes(column.dataIndex as string)">
                <a-image :width="70" :src="text" v-if="text" />
                <img :width="70" :src="fallback" v-else />
            </template>
            <template v-else-if="tabelConfig?.headersCustom?.includes(column.dataIndex as string)">
                <slot name="customDataIndex" :data="{ column, text, record }"></slot>
            </template>
            <template v-else-if="tabelConfig?.copyCustom?.includes(column.dataIndex as string)">
                <div class="config-user-link-text" :style="{ ...tableStyle(column) }">
                    <span @click="copyText(text, true)">{{ text }}</span>
                    <CopyOutlined class="icon-copy" @click="copyText(text, true)" />
                </div>
            </template>
            <template v-else>
                <a-tooltip v-if="tabelConfig?.tooltip?.show" :placement="tabelConfig.tooltip.placement">
                    <template #title>{{ text }}</template>
                    <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                        {{ text }}
                    </div>
                </a-tooltip>
                <span v-else-if="text === 0">0</span>
                <span v-else-if="!text">--</span>
                <!-- <span v-else class="inline-block" :style="{ width: column.width }">{{ text }}</span> -->
            </template>
        </template>
    </a-table>
</template>

<script lang="ts" setup>
import type { tabelConfigType, PaginationConfType } from '@/config-overall/interface/table';

import { PagingDefaultConf } from '@/use/useTableConf';
import { copyText } from '@/utils/common';
import { CopyOutlined } from '@ant-design/icons-vue';
import { Item } from 'ant-design-vue/es/menu';
import { ColumnType } from 'ant-design-vue/es/table';
import { useI18n } from 'vue-i18n';
import i18n from '@/setup/i18n-setup';
const { t } = useI18n();
const props = withDefaults(
    defineProps<{
        dataSource: any[];
        paginationConfig: PaginationConfType;
        isLoading: boolean;
        handleSizeChange: ({ pageSize, current }: { pageSize: number; current: number }) => void;
        tabelConfig: tabelConfigType;
    }>(),
    {
        dataSource: () => [],
        paginationConfig: () => PagingDefaultConf,
        isLoading: false,
        tabelConfig: () => ({
            headersCustom: [''],
            scroll: { x: 1100 },
            headers: [],
            tooltip: {
                show: false,
                placement: 'topLeft',
            },
        }),
    }
);
const fallback = ref(
    'data:image/png;base64,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'
);
const Tableheaders = computed(() => {
    return (tabelConfig: tabelConfigType) => {
        tabelConfig.headers.forEach((item) => {
            if (!item.align) {
                const align = tabelConfig.align;
                item.align = align ? align : 'left';
            }
            if (!item.width) {
                if (typeof tabelConfig.width === 'number') {
                    item.width = `${tabelConfig.width || 120}px`;
                } else {
                    item.width = tabelConfig.width;
                }
            }
            if (typeof item.width === 'number') {
                item.width = `${item.width}px`;
            }
        });

        return tabelConfig.headers;
    };
});
const tableStyle = computed(() => {
    return (column: ColumnType) => {
        const aligns = {
            center: 'center',
            left: 'flex-start',
            right: 'flex-end',
        };
        // @ts-ignore
        const justifyContent = aligns[column.align];
        return {
            justifyContent,
            width: '100%',
        };
    };
});
</script>

<style lang="scss" scoped></style>
