<script setup lang="ts">
import { ref } from 'vue';
import api from '@/api/poboAPI/poboPayeeAccount';

const visible = ref(false);
const isLoading = ref(false);
const list = ref<PromiseSelectReturnType<typeof api.getOperateLogList, 'list'>>([]);

const fetchLogList = (id: number): void => {
    isLoading.value = true;
    api.getOperateLogList({ id, pageNo: 1, pageSize: 999 })
        .then((r) => {
            list.value = r.list;
        })
        .finally(() => {
            isLoading.value = false;
        });
};

const onShowDialog = (val = false, id: number): void => {
    visible.value = val;
    fetchLogList(id);
};

defineExpose({ onShowDialog });
</script>

<template>
    <a-drawer v-model:open="visible" title="操作日志" :width="450" placement="right" @close="list = []">
        <a-spin :spinning="isLoading">
            <a-timeline v-if="list.length">
                <a-timeline-item v-for="(item, i) of list" :key="i">
                    <div class="flex-direction-column">
                        <div class="flex-direction-row">
                            <a-tooltip :title="item.opContent">
                                <span class="desc">{{ item.opContent }}</span>
                            </a-tooltip>
                            <span class="user-wrap margin-left-30">操作人：{{ item.opUserName }}</span>
                        </div>
                        <span>备注：{{ item.opRemark }}</span>
                        <span>{{ item.createTime }}</span>
                    </div>
                </a-timeline-item>
            </a-timeline>
            <a-empty v-else />
        </a-spin>
    </a-drawer>
</template>

<style scoped lang="scss">
.desc {
    width: 200px;
    overflow: hidden;
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.user-wrap {
    padding-right: 20px;
}
</style>
