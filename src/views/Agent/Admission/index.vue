<template>
    <div class="table-container">
        <config-index ref="configRef">
            <template
                #operate="{
                    data: {
                        text,
                        record: { status, id },
                    },
                }"
            >
                <template v-if="status === 3">
                    <a-button type="link" class="text-color-green" @click="handelAudit(id)" v-if="buttonPermissions('admission-examine')"
                        >审核</a-button
                    >
                </template>
            </template>
            <template
                #customDataIndex="{
                    data: {
                        column: { dataIndex },
                        text,
                        record: { status, globalCode },
                    },
                }"
            >
                <template v-if="['statusName'].includes(dataIndex as string)">
                    <span :class="stateList(Number(status))?.color">{{ text }}</span>
                </template>
                <template v-else-if="['phone'].includes(dataIndex as string)">
                    <span>{{ `${globalCode} ${text}` }}</span>
                </template>
            </template>
        </config-index>
        <update-data ref="auditRef" @handleOk="configRef?.handelSubmit" />
    </div>
</template>

<script lang="ts" setup>
import queryConfig from './config/query-item';
const configRef = ref<ComponentInstance['ConfigIndex']>();
const auditRef = ref<ComponentInstance['UpdateData']>();

onActivated(() => {
    configRef.value?.SetConfigFrom(queryConfig.value);
});
const stateList = computed(() => {
    return (state: number) => {
        const list = [
            { value: 1, label: '通过', color: 'text-color-green' },
            { value: 2, label: '拒绝', color: 'text-color-red' },
            { value: 3, label: '申请中', color: 'text-color-orange' },
        ];
        return list.find((item) => item.value === state);
    };
});
const handelAudit = (id: number) => {
    auditRef.value?.openCallback(queryConfig.value.btns.auditBtns, 'edit', {
        id,
    });
};
</script>

<style lang="scss" scoped></style>
