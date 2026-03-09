<template>
    <a-modal v-model:open="open" :mask-closable="false" width="fit-content" @ok="handleOk">
        <template #title>
            <div class="display-flex flex-align-items-center">
                <ExclamationCircleOutlined style="color: #faad14; font-size: 16px" />
                <div class="ml-10">失败提醒</div>
            </div>
        </template>
        <div class="warring-flex">
            <div v-if="values.errorLimitValue.length" class="display-flex flex-align-items-center">
                当前用户标签为
                <a-tooltip placement="topLeft">
                    <template #title>{{ typeName(2) }}</template>
                    <div class="font-semibold">{{ typeName(2) }}</div>
                </a-tooltip>
                的标签不存在请填写正确的用户标签
            </div>
            <div v-if="values.alreadySetLimitValue.length" class="display-flex flex-align-items-center">
                当前用户标签为
                <a-tooltip placement="topLeft">
                    <template #title>{{ typeName(1) }}</template>
                    <div class="font-semibold">{{ typeName(1) }}</div>
                </a-tooltip>
                的标签已有对应限制。不可重复添加。
            </div>
            <div v-if="values.notSetLimitValue.length" class="mt-10">
                <div class="display-flex flex-align-items-center">
                    <div>用户标签为</div>
                    <a-tooltip placement="topLeft">
                        <template #title>{{ typeName(3) }}</template>
                        <div class="font-semibold">{{ typeName(3) }}</div>
                    </a-tooltip>

                    <div>的标签可继续添加</div>
                    <SnippetsOutlined class="cursor-pointer" @click="copayTag(typeName(3))" />
                </div>
            </div>
            <div v-if="values.errorUserLimitValue.length" class="display-flex flex-align-items-center mt-10">
                当前用户UID为
                <a-tooltip placement="topLeft">
                    <template #title>{{ typeNameUser(5) }}</template>
                    <div class="font-semibold">{{ typeNameUser(5) }}</div>
                </a-tooltip>
                的用户不存在请填写正确的用户UID
            </div>
            <div v-if="values.alreadyUserSetLimitValue.length" class="display-flex flex-align-items-center">
                当前用户UID为
                <a-tooltip placement="topLeft">
                    <template #title>{{ typeNameUser(4) }}</template>
                    <div class="font-semibold">{{ typeNameUser(4) }}</div>
                </a-tooltip>
                的用户已有对应限制。不可重复添加。
            </div>
            <div v-if="values.notSetUserLimitValue.length" class="mt-10">
                <div class="display-flex flex-align-items-center">
                    <div>用户UID为</div>
                    <a-tooltip placement="topLeft">
                        <template #title>{{ typeNameUser(6) }}</template>
                        <div class="font-semibold">{{ typeNameUser(6) }}</div>
                    </a-tooltip>

                    <div>的用户可继续添加</div>
                    <SnippetsOutlined class="cursor-pointer" @click="copayUId(typeNameUser(6))" />
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import type { AddSwapRateDataRetrun } from '@/api/flashExchange/types.d';
import { computed, ref } from 'vue';
import { ExclamationCircleOutlined, SnippetsOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { copyText } from '@/utils/common';
import { TypeTagList } from '@/api/tag/types.d';

const open = ref(false);
const tagList = ref<TypeTagList[]>([]);
const values = ref<AddSwapRateDataRetrun>({ alreadySetLimitValue: [], errorLimitValue: [], notSetLimitValue: [], alreadyUserSetLimitValue: [], errorUserLimitValue: [], notSetUserLimitValue: [], result: true });
const openWarningModal = (item: AddSwapRateDataRetrun, typeValue: number, tags: TypeTagList[]) => {
    open.value = true;
    values.value = item;
    type.value = typeValue;
    tagList.value = tags;
};
const handleOk = () => {
    open.value = false;
};
const type = ref(2);
const title = computed(() => {
    return type.value === 2 ? '用户标签' : 'UID';
});
const alreadys = computed(() => {
    return (type: 1 | 2 | 3 | 4 | 5 | 6 = 1) => {
        const strs = ['alreadySetLimitValue', 'errorLimitValue', 'notSetLimitValue', 'alreadyUserSetLimitValue', 'errorUserLimitValue', 'notSetUserLimitValue'][type - 1];
        //@ts-ignore
        return values.value[strs].join(',');
    };
});
const tagsName = computed(() => {
    return (type: 1 | 2 | 3 | 4 | 5 | 6 = 1) => {
        const names: string[] = [];
        const strs = ['alreadySetLimitValue', 'errorLimitValue', 'notSetLimitValue', 'alreadyUserSetLimitValue', 'errorUserLimitValue', 'notSetUserLimitValue'][type - 1];
        tagList.value.forEach((item) => {
            //@ts-ignore
            values.value[strs].forEach((item2) => {
                if (item.id === item2) {
                    names.push(item.name as string);
                }
            });
        });
        return names.join(',');
    };
});
const typeName = computed(() => {
    return (types: 1 | 2 | 3 | 4 | 5 | 6 = 1) => {
        return tagsName.value(types);
    };
});

const typeNameUser = computed(() => {
    return (types: 1 | 2 | 3 | 4 | 5 | 6 = 1) => {
        return alreadys.value(types)
    };
});

const copayTag = (id: string) => {
    const res = copyText(id);
    if (!res) return;
    message.success(`复制用户标签成功`);
};

const copayUId = (id: string) => {
    const res = copyText(id);
    if (!res) return;
    message.success(`复制用户UID成功`);
};
defineExpose({ openWarningModal });
</script>

<style lang="scss" scoped>
.warring-flex {
    display: flex;
    justify-content: center;
    flex-direction: column;
    font-size: 16px;
}
.cursor-pointer {
    margin-left: 10px;
    font-size: 20px;
    color: #165dff;
}
.font-semibold {
    font-weight: 550;
    font-size: 18px;
    color: red;
    margin: 0 8px;
    max-width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
