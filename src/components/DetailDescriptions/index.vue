<template>
    <a-descriptions size="small">
        <template v-for="column in columns" :key="column.field">
            <a-descriptions-item
                :label="column.title"
                v-bind="omit(column, ['slots', 'title', 'field'])"
                v-if="
                    hiddenEmpty ? !isNull(get(data, column.field)) && !isUndefined(get(data, column.field)) && get(data, column.field) !== '' : true
                "
            >
                <template v-if="column.slots?.label" #label>
                    <slot :name="column.slots.label" :title="column.title" :column="column" :data="data"></slot>
                </template>

                <template v-if="column.slots?.default">
                    <slot :name="column.slots.default" :text="get(data, column.field)" :column="column" :record="data"></slot>
                </template>
                <template v-else>
                    <div>{{ get(data, column.field) || '--' }}</div>
                </template>
            </a-descriptions-item>
        </template>
    </a-descriptions>
</template>

<script setup lang="ts">
import { omit, get, isNull, isUndefined } from 'lodash-es';
import { PropType } from 'vue';

const props = defineProps({
    columns: {
        type: Array as PropType<Record<string, any>[]>,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
    hiddenEmpty: {
        type: Boolean,
        default: false,
    },
});
</script>

<style scoped></style>
