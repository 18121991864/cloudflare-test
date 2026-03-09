<template>
    <a-modal :open="visible" title="审核详情" :mask-closable="false" @cancel="handleCancel" @ok="handleCancel" width="800px">
        <a-table :columns="tableColumns" :data-source="tableData" />
    </a-modal>
</template>
<script lang="ts" setup>
import api from '@/newApi/digitAsset/withdraw/index';
import { FormInstance } from 'ant-design-vue/es';
const props = withDefaults(
    defineProps<{
        visible: boolean;
        editData: PromiseReturnType<typeof api.getWithdrawList>['list'][0];
    }>(),
    {
        visible: false,
        editData: () => Object.create(null),
    }
);
const emit = defineEmits(['update:visible', 'onSuccess']);
const tableColumns = [
    { title: '审核时间', dataIndex: 'createTime' },
    { title: '审核人', dataIndex: 'sysUserName' },
    { title: '审核类型', dataIndex: 'typeName' },
    { title: '审核结果', dataIndex: 'checkStateName' },
    { title: '拒绝理由', dataIndex: 'opinion' },
];
const tableData = ref<PromiseReturnType<typeof api.getWithdrawReviewList>>([]);
const formRef = ref<FormInstance>();
const handleCancel = () => {
    emit('update:visible', false);
};
const loading = ref<boolean>(false);
watchEffect(() => {
    if (props.visible) {
        api.getWithdrawReviewList({ id: props.editData.id }).then((res) => {
            tableData.value = res;
        });
    }
});
</script>
