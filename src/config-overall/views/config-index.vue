<template>
    <!-- tabs -->
    <tabs-pane
        v-if="configFrom.tabsPangeConfig?.show"
        ref="tabsRef"
        v-model:active-key="configFrom.tabsPangeConfig.activeKey"
        :active-data="configFrom.tabsPangeConfig.activeData"
        :handle-on-submit="handelSubmit"
    />
    <!-- 自定义插槽 -->
    <slot v-if="configFrom?.slotType?.slotName" :name="configFrom?.slotType?.slotName" :data="{ ...configFrom?.slotType.slotData }"></slot>
    <!-- 非tabs -->
    <template v-if="isTabs">
        <!-- 表单筛选 -->
        <query-form :config-from="configFrom" :form-state="formState" @changeTime="changeTime" :handelSearch="handelSearch">
            <template #formButton>
                <query-button
                    ref="queryButtonRef"
                    :config-from="configFrom"
                    :load-export-excel="loadExportExcel"
                    :hand-export="handExport"
                    :handel-upate-data="handelUpateData"
                    :handel-search="handelSearch"
                    :handel-reset-fields="handelResetFields"
                >
                    <template #button="{ data }">
                        <slot name="button" :data="data"> </slot>
                    </template>
                    <template #queryItem="{ item }">
                        <slot name="queryItem" :item="{ ...item }"></slot>
                    </template>
                    <template #addBtn>
                        <slot name="addBtn"></slot>
                    </template>
                </query-button>
            </template>
        </query-form>

        <!-- 统计 -->
        <a-space v-if="configFrom?.statistics?.show" :size="20" style="margin-bottom: 20px">
            <slot name="pleamoutCount" :data="pleamoutCount">
                <a-space v-if="configFrom?.statistics?.isType && configFrom?.statistics?.isType === 2" :size="25">
                    <div class="flex flex-col" v-for="(item, i) of pleamoutCount" :key="i">
                        <span>{{ item.label }}:</span>
                        <span>{{ $filters.dataThousands(item.amount) }} {{ item.currency }}</span>
                    </div>
                </a-space>
                <template v-else>
                    <span v-for="(item, index) in configFrom.statistics?.AmountList" :key="index">
                        <span>{{ item.label }} : </span>
                        <span v-if="pleamoutCount[item.value]">{{ amountTotal(pleamoutCount[item.value]) }}</span>
                        <span v-else>0</span>
                        <span v-if="item.currenty" class="ml-2">{{ item.currenty }}</span>
                    </span>
                </template>
            </slot>
        </a-space>

        <!-- 表格 -->
        <table-config
            :pagination-config="{ ...paginationConfig, pageSize: formState.pageSize, current: formState.pageNo }"
            :is-loading="isLoading"
            :data-source="tableData"
            :tabel-config="configFrom.tabelConfig"
            :handle-size-change="handleSizeChange"
            :row-class-name="getRowClassName"
        >
            <template #operate="{ data: { column, text, record } }">
                <!-- column.width ? column.width : 'fit-content' -->
                <div class="display-flex" :class="[configFrom.btns.editBtns?.order ? 'order-item' : '']" :style="{ ...tableStyle(column) }">
                    <slot name="operate" :data="{ column, text, record }"></slot>
                    <a-button
                        v-if="permissionShow('editBtns')"
                        :style="{ order: configFrom.btns.editBtns?.order || '' }"
                        type="link"
                        @click="handelUpateData('edit', configFrom.btns.editBtns as any, record)"
                    >
                        {{ $t(`${configFrom.btns.editBtns?.title}`) || '编辑' }}
                    </a-button>
                    <a-button
                        v-if="permissionShow('infoButs')"
                        :style="{ order: configFrom.btns.editBtns?.order || '' }"
                        type="link"
                        @click="handelUpateData('info', configFrom.btns.infoButs as any, record)"
                    >
                        {{ configFrom.btns.infoButs?.title || '详情' }}
                    </a-button>
                </div>
            </template>
            <template #customDataIndex="{ data: { column, text, record } }">
                <slot name="customDataIndex" :data="{ column, text, record }"></slot>
            </template>
        </table-config>

        <!-- 弹窗/新增/编辑/详情 -->
        <update-data ref="updateRef" @handleOk="handelSubmit">
            <template #itemUpdata="{ formState, data }">
                <slot name="itemUpdata" :formState="formState" :data="{ ...data }"></slot>
            </template>
            <template #lable="{ dataIndex, data }">
                <slot name="lable" :data-index="dataIndex" :data="{ ...data }"></slot>
            </template>
            <template #infoSlots="{ data, dataIndex }">
                <slot name="infoSlots" :data="{ ...data }" :data-index="dataIndex"></slot>
            </template>
            <template #footer="{ operate }">
                <slot name="footer" :operate="{ ...operate }"></slot>
            </template>
        </update-data>
    </template>
    <template v-else-if="!isTabs">
        <a-result status="404" title="404" sub-title="暂无该页面权限">
            <template #extra>
                <!-- <a-button type="primary">Back Home</a-button> -->
            </template>
        </a-result>
    </template>
</template>

<script lang="ts" setup>
import useTableConf from '@/use/useTableConf';
import NProgress from 'nprogress';
import useComputeHook from '../hook/index';
import addUpdate from '../hook/add-update';
import _ from 'lodash';
import useEvent from '../hook/useAttribute/use-event';
import useQuery from '../hook/useAttribute/use-query';
import usePermissions from '../hook/useAttribute/use-permissions';
import { ConstructionFrom } from '../interface';
import { useI18n } from 'vue-i18n';
import i18n from '@/setup/i18n-setup';
const tableData = ref(Object.create([]));
const updateRef = ref<ComponentInstance['UpdateData']>();
const { t } = useI18n();
const emits = defineEmits(['handExport', 'onSearch', 'handelRest', 'changeTime']);
const route = useRoute();
const handelSubmit = async () => {
    if (!isTabs.value) return false;
    isLoading.value = true;
    NProgress.start();

    const { handelSubmit } = configFrom.value.btns.queryBtns;
    tableData.value = [];
    const tabsPangeConfig = configFrom.value.tabsPangeConfig;
    updatePagination(1, 10, 0);
    if (tabsPangeConfig) {
        const activeData = tabsPangeConfig.activeData;
        const item = activeData.find((item) => item.key === tabsPangeConfig.activeKey)!;
        const handelSubmit = item.activeConstring.btns.queryBtns.handelSubmit;
        await paramsSubmit(handelSubmit);
        return false;
    }
    await paramsSubmit(handelSubmit);
};
const paramsSubmit = (handelSubmit: (params: any) => Promise<any>) => {
    handelSubmit({
        ...formState.value,
    })
        .then(({ list, totalSize, pageSize, pageNo }) => {
            updatePagination(pageNo, pageSize, totalSize);
            if (list && list.length) {
                tableData.value = list.map((item) => ({ ...item, isLoading: false }));
            } else {
                tableData.value = [];
            }

            if (!configFrom.value?.statistics?.show) return false;
            queryAmoutTotal();
        })
        .finally(() => {
            isLoading.value = false;
            NProgress.done();
        });
};
const {
    copyformState,
    amountTotal,
    configFrom,
    formState,
    tabsRef,
    onSearch,
    paginationConfig,
    isLoading,
    tableStyle,
    formReset,
    updatePagination,
    handelRest,
} = useComputeHook(handelSubmit);
const evnetQuery = { configFrom, formState, emits };
const { handExport, loadExportExcel, pleamoutCount, queryAmoutTotal, handleSizeChange } = useQuery({ ...evnetQuery, isLoading, handelSubmit });
const evnetData = { ...evnetQuery, copyformState, handelRest, onSearch, handelSubmit };
const { SetConfigFrom, handelResetFields, changeTime, handelSearch } = useEvent(evnetData);
const { handelUpateData } = addUpdate(updateRef as Ref<ComponentInstance['UpdateData']>);
const queryButtonRef = ref<ComponentInstance['QueryButton']>();
const { isTabs } = usePermissions(configFrom, queryButtonRef, handelSubmit);

const getRowClassName = (row: { parentId: number; mainId: number }) =>
    (row.parentId === 0 && route.name === 'photon-easy-detaile') || (row.mainId && route.name === 'deduction-order') ? 'table-striped' : null;

defineExpose({
    SetConfigFrom,
    handelSubmit: handelSearch,
    queryButtonRef,
    handelUpateData,
});
</script>

<style lang="scss" scoped>
.order-item {
    :deep(button) {
        order: 2;
    }
    :deep(button:nth-child(2)) {
        order: 4;
    }
}
</style>
