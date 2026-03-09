<template>
    <div class="table-container">
        <config-index ref="configRef">
            <template
                #customDataIndex="{
                    data: {
                        column: { dataIndex },
                        record: { linkUrl },
                        text,
                    },
                }"
            >
                <template v-if="['txHash'].includes(dataIndex as string)">
                    <a-button type="link" @click="openLinkURL(linkUrl)" v-if="buttonPermissions('info') && linkUrl">{{ text }}</a-button>
                    <span v-else>{{ text || '--' }}</span>
                </template>
            </template>
        </config-index>
    </div>
</template>

<script lang="ts" setup>
import queryConfig from './config/query-item';
const configRef = ref<ComponentInstance['ConfigIndex']>();
onActivated(() => {
    configRef.value?.SetConfigFrom(queryConfig.value);
});
const openLinkURL = (url: string) => {
    window.open(url);
};
</script>

<style lang="scss" scoped></style>
