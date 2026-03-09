<template>
    <a-modal :open="visible" title="添加币种" @ok="handleOk" @cancel="handleCancel">
        <a-table
            class="margin-top-10"
            size="small"
            :pagination="false"
            :loading="loading"
            :columns="tableColumns"
            :row-key="
                ({ coinId }) => {
                    return coinId;
                }
            "
            :data-source="tableData"
            width="600px"
            :scroll="{ x: 480 }"
        >
            <template #bodyCell="{ column: { dataIndex }, record }">
                <template v-if="['isAdd'].includes(dataIndex)">
                    <div :class="record.isAdd ? 'text-color-green' : 'text-color-red'">
                        {{ stateText(record[dataIndex]) }}
                    </div>
                </template>
                <template v-else-if="['coinStatus'].includes(dataIndex)">
                    <div :class="record.coinStatus === 1 ? 'text-color-green' : 'text-color-red'">
                        {{ record.coinStatus === 1 ? '启用' : '禁用' }}
                    </div>
                </template>

                <template v-else-if="dataIndex === 'operate'">
                    <a-switch
                        v-model:checked="record.isState"
                        checked-children="已启用"
                        un-checked-children="已禁用"
                        @change="handleChange(record)"
                        :disabled="record.isAdd || record.coinStatus == 2"
                    />
                </template>
            </template>
        </a-table>
    </a-modal>
</template>
<script lang="ts" setup>
import api from '@/newApi/digitAsset/address/index';
import { message, TableColumnType } from 'ant-design-vue/es';
const props = withDefaults(
    defineProps<{
        visible: boolean;
        editData: PromiseReturnType<typeof api.getAddressPage>['list'][0];
        type: 1 | 2 | 3;
    }>(),
    {
        visible: false,
        editData: () => Object.create(null),
        type: 1,
    }
);
const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: '链', dataIndex: 'chainName' },
    { title: '币种', dataIndex: 'coinSymbol' },

    { title: '操作', dataIndex: 'operate' },
]);
const emit = defineEmits(['update:visible', 'success']);
const handleOk = () => {
    emit('success');
    handleCancel();
};
const handleCancel = () => {
    emit('update:visible', false);
    tableData.value = [];
};
const loading = ref(false);
const tableData = ref<PromiseReturnType<typeof api.getAddressCoinList>>([]);
const stateText = computed(() => {
    return (isAdd: boolean) => {
        const status = isAdd ? '启用' : '禁用';

        return status;
    };
});
const getAddressCoinList = () => {
    const res = api
        .getAddressCoinList({
            id: props.editData.id,
        })
        .then((res) => {
            res.forEach((item) => {
                item.isState = item.isAdd;
            });
            tableData.value = res;
            loading.value = false;
        })
        .finally(() => {
            loading.value = false;
        });
};
watchEffect(() => {
    if (props.visible) {
        loading.value = true;
        getAddressCoinList();
    }
});
const handleChange = (record: PromiseReturnType<typeof api.getAddressCoinList>[0]) => {
    loading.value = true;
    api.addAddressCoin({
        id: record.id,
        coinId: record.coinId,
    })
        .then(() => {
            message.success('更改状态成功');
            getAddressCoinList();
        })
        .finally(() => {
            loading.value = false;
        });
};
</script>
