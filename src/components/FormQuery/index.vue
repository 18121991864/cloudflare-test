<template>
    <div class="action-btm display-flex flex-justify-content-space-between">
        <div>
            <slot name="btn-query"></slot>
        </div>
        <div class="display-flex">
            <a-button block type="primary" size="small" class="search-submit-btn" @click.stop="handleSearch">
                <template #icon>
                    <SearchOutlined />
                </template>
                搜索
            </a-button>
            <a-button block size="small" class="search-reset-btn" @click.stop="handleResetForm">
                <template #icon>
                    <RedoOutlined />
                </template>
                重置
            </a-button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons-vue';
const emits = defineEmits<{
    (e: 'handleSearch'): void;
    (e: 'handleResetForm'): void;
}>();
const handleSearch = () => {
    emits('handleSearch');
};
const handleResetForm = () => {
    emits('handleResetForm');
};
</script>
