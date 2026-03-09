<script setup lang="ts">
import { ref, watch } from 'vue';
import CodeInput from '@/components/CodeInput.vue';
import { SIX_NUMBER } from '@/utils/constant';
import { handlePaste } from '@/utils/common';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const { title } = defineProps({
    title: {
        type: String,
        require: true,
        default: () => 'login.2FAVerification',
    },
});
const emits = defineEmits(['setCodeVal']);

const router = useRouter();
const visible = ref(false);
const codeArr = ref<string[]>([]);

const onPaste = async () => {
    // code 粘贴事件
    codeArr.value = await handlePaste();
};

const resetInputs = () => {
    codeArr.value = [];
};

const handleShowDialog = (val = false): void => {
    visible.value = val;
};

watch(
    () => codeArr.value,
    (newValue) => {
        const isNotEmpty = newValue.every((item) => item !== '');
        if (!SIX_NUMBER.test(codeArr.value.join(''))) return;

        if (isNotEmpty && newValue.length === 6) {
            visible.value = false;
            emits('setCodeVal', codeArr.value.join(''));
            codeArr.value = [];
        }
    }
);

defineExpose({ handleShowDialog, resetInputs });
</script>

<template>
    <a-modal v-model:open="visible" :title="t(title)" :footer="null" @cancel="resetInputs">
        <div class="flex justify-between items-center btn-layout">
            <span>{{ t('login.PleaseEnterTheGoogleVerificationCode') }}</span>
            <a-button class="paste-btn" type="link" @click.stop="onPaste">{{ t('login.Paste') }}</a-button>
        </div>
        <CodeInput v-model="codeArr" />
    </a-modal>
</template>

<style scoped lang="scss">
.input-wrap {
    padding: 30px;
}

.input-item {
    outline: none;
    width: 46px;
    height: 50px;
    border: 1px solid #cccccc;
    border-radius: 4px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;

    &:focus {
        border-color: #1890ff;
    }
}

.btn-layout {
    padding-left: 30px;
    padding-right: 16px;
    box-sizing: border-box;
}

.paste-btn {
    cursor: pointer;
    color: var(--primary-color);

    &:hover {
        color: #ff9600;
    }
}
</style>
