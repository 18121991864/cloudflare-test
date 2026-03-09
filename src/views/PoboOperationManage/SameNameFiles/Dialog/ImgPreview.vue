<script setup lang="ts">
import { ref } from 'vue';
import api from '@/api/poboAPI/poboRemitterAccount';

const props = defineProps({
    isPreview: {
        type: Boolean,
        require: true,
        default: () => true,
    },
});

const requestId = ref(0);
const open = ref(false);
const visible = ref(false);
const isLoading = ref(false);
const btnLoading = ref(false);
const imgList = ref<PromiseReturnType<typeof api.preview>>([]);

const fetchFileInfo = (val: number): void => {
    isLoading.value = true;
    api.preview({ id: val })
        .then((r) => {
            imgList.value = r;
        })
        .finally(() => {
            isLoading.value = false;
        });
};

const onShowDialog = (val = false, id: number): void => {
    open.value = val;
    fetchFileInfo(id);
    requestId.value = id;
};

const onOk = (): void => {
    open.value = false;
};

defineExpose({ onShowDialog });
</script>

<template>
    <a-modal v-model:open="open" title="预览" :width="550" :confirm-loading="btnLoading" @cancel="imgList = []" @ok="onOk">
        <a-spin :spinning="isLoading">
            <div class="flex-direction-column align-center">
                <a-image v-if="imgList.length" :preview="{ visible: false }" :width="500" :src="imgList[0]" @click="visible = true" />
                <div v-if="imgList.length" style="display: none">
                    <a-image-preview-group :preview="{ visible, onVisibleChange: (vis) => (visible = vis) }">
                        <a-image v-for="(item, i) of imgList" :key="i" :width="500" :src="item" />
                    </a-image-preview-group>
                </div>
                <a-empty v-else description="暂无数据" />
            </div>
        </a-spin>
    </a-modal>
</template>

<style scoped lang="scss"></style>
