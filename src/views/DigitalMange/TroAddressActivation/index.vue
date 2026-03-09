<template>
    <div class="table-container">
        <config-index ref="configRef">
            <template
                #customDataIndex="{
                    data: {
                        column: { dataIndex },
                        record: { txHash },
                    },
                }"
            >
                <template v-if="dataIndex === 'txHash'">
                    <a-tooltip :title="txHash">
                        <p class="w-32 truncate">{{ txHash }}</p>
                    </a-tooltip>
                </template>
            </template>
            <template #button>
                <!-- <a-button type="primary" @click="handleAdd" v-if="buttonPermissions('add')">
                    <template #icon>
                        <PlusOutlined />
                    </template>
                    设置出币地址
                </a-button> -->
            </template>
        </config-index>
        <update-data ref="updateRef" @handleOk="configRef?.handelSubmit()"> </update-data>
    </div>
</template>

<script lang="ts" setup>
import queryCallback from './config/query-item';
import api from '@/api/tron/address';
import { PlusOutlined } from '@ant-design/icons-vue';
import { fliterDiscountInfo } from './config/updata-data';
import { ConstructionFrom } from '@/config-overall/interface';
const configRef = ref<ComponentInstance['ConfigIndex']>();
const updateRef = ref<ComponentInstance['UpdateData']>();
const queryConfig = ref<ConstructionFrom>();
onActivated(() => {
    queryConfig.value = queryCallback().value as ConstructionFrom;
    configRef.value?.SetConfigFrom(queryConfig.value);
});
const handleAdd = async () => {
    const data = await api.getissueInfo();
    const updateConstruction = await fliterDiscountInfo(data);
    updateRef.value?.openCallback(updateConstruction.value, 'edit', { ...updateConstruction.value.formState });
};
</script>

<style lang="scss" scoped></style>
