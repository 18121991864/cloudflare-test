<template>
    <a-modal
        :open="visible"
        :confirm-loading="isSubmitLoading"
        cancel-text="取消"
        ok-text="确定"
        :mask-closable="false"
        :after-close="formRef.resetFields"
        :cancel-button-props="{ disabled: isSubmitLoading }"
        @cancel="$emit('onClose')"
        @ok="handelSubmit"
    >
        <template #title>{{ title }}</template>
        <a-form ref="formRef" class="form-list" :label-col="{ span: 5 }" :rules="formRules" :model="formState">
            <a-form-item label="跳转链接" name="linkUrl">
                <a-input v-model:value="formState.linkUrl" size="small" placeholder="请输入" />
            </a-form-item>
            <a-form-item v-if="type === 'add'" name="language" label="语言">
                <a-select v-model:value="formState.language" :options="langArr" size="small" placeholder="请选择" @change="handleSearch" />
            </a-form-item>
            <a-form-item name="platform" label="平台">
                <a-select v-model:value="formState.platform" size="small" placeholder="请选择" @change="handleSearch">
                    <a-select-option :value="1">APP</a-select-option>
                    <a-select-option :value="2">PC</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item name="state" label="状态">
                <a-radio-group v-model:value="formState.state" name="state">
                    <a-radio :value="1">启用</a-radio>
                    <a-radio :value="2">禁用</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item class="width-400 mr-20" name="fullImageUri" label="卡片图">
                <div class="display-flex flex-align-items-center">
                    <a-input v-model:value="formState.fullImageUri" class="flex-1" size="small" placeholder="请上传卡片图" />
                    <Upload
                        v-model:suffixUrl="formState.uri"
                        v-model:fullUrl="formState.fullImageUri"
                        :disabled="uploadDisabled"
                        :max-file-size="5"
                        :limit-size="true"
                        :custom-size="true"
                        :platform="formState.platform == 2 ? 'pc' : 'app'"
                    >
                        <a-button type="primary" size="small" class="ml-5 mr-5 upload-btm" @click="handelDisabled">上传 </a-button>
                    </Upload>
                    <PreviewImgBtm :url="formState.fullImageUri" />
                </div>
                <div class="info-circle">
                    <info-circle-outlined class="info-icon" />
                    <span>图片规定尺寸为{{ infoDesc }}，最大上传大小不超过5M</span>
                </div>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script lang="ts">
import type { FormInstance } from 'ant-design-vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { computed, defineComponent, reactive, ref, watch, PropType } from 'vue';
import { message } from 'ant-design-vue';
import { langArr } from "@/utils/constant";

import api from '@/api/userAPI/userList';

const FormParams = {
    language: 'zh-CN', // 语言：zh-CN en-US
    id: '', //
    platform: 1, // 平台：1=app,2=pc
    state: 2, // 1启用，2禁用
    uri: '', // URI
    fullImageUri: '',
    linkUrl: '',
};

export default defineComponent({
    emits: ['onClose', 'onSuccess'],
    props: {
        visible: { type: Boolean, required: true },
        type: { type: String as PropType<'add' | 'edit'>, required: true },
        activeData: { type: Object, default: () => Object.create(null) },
    },
    components: {
        InfoCircleOutlined,
    },
    setup(props, { emit }) {
        const formState = reactive({ ...FormParams });
        const uploadDisabled = ref(true);
        const formRules = computed(() => ({
            // 表单规则
            linkUrl: [{ required: true, trigger: 'blur', message: '请输入' }],
            fullImageUri: [{ required: true, trigger: 'blur', message: '请上传' }],
            platform: [{ required: true, trigger: 'blur', message: '请选择' }],
            language: [{ required: true, trigger: 'blur', message: '请选择' }],
            state: [{ required: true, trigger: 'blur', message: '请选择' }],
        }));

        const title = computed(() => `${props.type === 'add' ? '添加' : '修改'}banner-${props.activeData?.id || ''}`);
        const infoDesc = computed(() => (formState.platform == 2 ? '242*136pt' : '343*114pt'));

        const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
        const handleAddOrUpdate = () => {
            if (isSubmitLoading.value) return;
            isSubmitLoading.value = true;
            const { type } = props;
            const isApi = type === 'add' ? 'fetchBannerAdd' : 'fetchBannerUpdate';
            const isParams = type === 'add' ? { ...formState } : { ...formState };

            // @ts-ignore
            return api[isApi]({ ...isParams })
                .then(() => {
                    emit('onClose');
                    message.success('操作成功');
                })
                .finally(() => {
                    isSubmitLoading.value = false;
                });
        };

        const formRef = ref<FormInstance>(Object.create(null));
        const handelSubmit = async () => {
            // 提交
            formRef.value.validate().then(() => handleAddOrUpdate()?.then(() => emit('onSuccess')));
        };
        const handelDisabled = () => {
            if (!formState.platform && uploadDisabled.value) {
                return message.error('请选择比列类型');
            }
        };
        watch(
            () => props.visible,
            (n, o) => {
                // 用于填充modal数据
                if (n !== o && n) {
                    Object.entries(FormParams).forEach(([key]: any) => {
                        // @ts-ignore 回填填充formState数据
                        formState[key] = props.type === 'add' ? undefined : props.activeData[key];
                    });
                }
            }
        );
        watch(
            () => formState.platform,
            (val) => {
                console.log(222);

                uploadDisabled.value = !val;
            },
            {
                immediate: true,
            }
        );

        return {
            title,
            formRef,
            langArr,
            formState,
            isSubmitLoading,
            formRules,
            uploadDisabled,
            infoDesc,
            handelDisabled,
            handelSubmit,
        };
    },
});
</script>
<style lang="scss" scoped>
.info-circle {
    margin-top: 10px;

    .info-icon {
        color: red;

        margin-right: 5px;
    }

    span {
        font-size: 12px;
    }
}
</style>
