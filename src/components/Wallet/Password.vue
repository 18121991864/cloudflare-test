<template>
    <a-form-item
        v-bind="itemProps"
        class="w-full wallet-password"
        :class="{ 'wallet-password--level': getIsShowLevel, 'show-message': getShowMessage }"
        :rules="[{ validator: validator, trigger: 'change' }]"
    >
        <a-input-password type="password" :value="value" v-bind="inputProps" @blur="showLevel = false" @focus="onFocus" @change="onChange">
            <template #[key] v-for="key in getSlotKeys">
                <slot :name="key"></slot>
            </template>
        </a-input-password>
        <template v-if="getIsShowLevel || getShowMessage">
            <div class="w-full">
                <div class="flex items-center justify-between overflow-hidden gap-x-4">
                    <div class="flex flex-1 gap-x-1 max-w-[168px] min-h-1 pt-2">
                        <div v-for="item in levels" :key="item.name" class="flex-1 h-1 overflow-hidden rounded-full bg-[#EBEEF2]">
                            <div
                                class="w-0 h-full transition-all duration-300 ease-in-out !min-w-0"
                                :class="{ '!w-full': getPasswordLevel.level >= item.level }"
                                :style="{ backgroundColor: getPasswordLevel.color }"
                            ></div>
                        </div>
                    </div>
                    <div :style="{ color: getPasswordLevel.color }">
                        {{ getPasswordLevel.message }}
                    </div>
                </div>

                <div>
                    <template v-for="rule in getVerifyResult" :key="rule.key">
                        <div :class="{ 'not-checked': !rule.is }">
                            <a-checkbox :checked="rule.is">
                                {{ rule.label }}
                            </a-checkbox>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </a-form-item>
</template>

<script setup lang="ts">
import { usePassword } from '@/use/usePassword';

const props = defineProps({
    modelValue: {
        type: String,
    },
    itemProps: { type: Object, default: () => ({}) },
    inputProps: { type: Object, default: () => ({}) },
});

defineOptions({ inheritAttrs: false });

const slots = useSlots() as Record<string, any>;

const emit = defineEmits(['update:modelValue']);

const showLevel = ref(false);
const focus = ref(false);

const value = ref<undefined | string>();

watchEffect(() => {
    value.value = props.modelValue;
});

const { levels, getVerifyResult, getPasswordLevel } = usePassword(value);

const getSlotKeys = computed(() => Object.keys(slots));

function onChange(e: any) {
    const v = (e.target as HTMLInputElement).value;
    value.value = v;
    emit('update:modelValue', v);
}

const getIsShowLevel = computed(() => unref(focus) && (unref(showLevel) || unref(getVerifyResult).some((item) => !item.is)));

const getShowMessage = computed(() => {
    // @ts-ignore
    return unref(value) && !/^[^\s\u4e00-\u9fa5]+$/.test(unref(value));
});

function validator(rule: any, value: string) {
    if (!/^[^\s\u4e00-\u9fa5]+$/.test(value)) return Promise.reject('此密码包含不支持的字符');
    if (!unref(getVerifyResult).every((item) => item.is) || !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d\S]{8,16}$/.test(value)) {
        return Promise.reject('密码须包含大写字母、小写字母、数字和特殊字符（不含空格），长度8-16位');
    }
    return Promise.resolve();
}

function onFocus() {
    showLevel.value = true;
    focus.value = true;
}
</script>

<style scoped>
.wallet-password.wallet-password--level:not(.show-message) ::v-deep(.ant-form-item-explain-error) {
    @apply hidden;
}

.wallet-password.ant-form-item-has-error .not-checked ::v-deep(.ant-checkbox-inner) {
    /* @apply border-red; */
    border-color: #ff4d4f;
}

.wallet-password.ant-form-item-has-error .not-checked ::v-deep(.ant-checkbox-wrapper) {
    /* @apply text-red; */
    color: #ff4d4f;
}
</style>
