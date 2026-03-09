<template>
    <a-modal :open="visible" :mask-closable="false" width="700px" @ok="handleOk" @cancel="handelCancel">
        <template #title>{{ title }}</template>
        <div @click="handelselectOpen">
            <a-form ref="formRef" :model="formState" name="form" autocomplete="off" :rules="fromRules">
                <a-form-item label="语言" name="language">
                    <a-select ref="select" v-model:value="formState.language" placeholder="请选择语言" @change="handleChangeLanguage">
                        <a-select-option v-for="item in languageList" :key="item.language" :value="item.language">{{ item.value }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item v-if="activeIndex == 1" label="菜单区" name="parentId">
                    <a-select
                        v-model:value="formState.parentId"
                        :disabled="!formState.language"
                        :open="selectOpen"
                        :options="menuAreaList"
                        :field-names="{ label: 'name', value: 'id' }"
                        placeholder="请选择菜单区"
                        @click.stop="swatchSelectOpen"
                    >
                        <template #dropdownRender="{ menuNode: menu }">
                            <div class="menu-list">
                                <div class="item-list">
                                    <div v-if="menuAreaList.length">
                                        <div
                                            v-for="(item, index) in menuAreaList"
                                            :key="item.id"
                                            class="item"
                                            :class="formState.parentId == item.id ? 'active' : ''"
                                            @click="selectData(item)"
                                        >
                                            <div v-if="item.id !== editData.id" class="item-name">{{ item.name }}</div>
                                            <div v-if="isEdit && item.id == editData.id" class="edit-item">
                                                <a-input v-model:value="editData.name" placeholder="请输入" @click.stop />
                                                <div class="edit-icon">
                                                    <close-circle-outlined class="icon-item" @click.stop="closeAdd(1)" />
                                                    <check-circle-outlined class="icon-item check-icon" @click.stop="appMenuArea(1)" />
                                                </div>
                                            </div>
                                            <div v-if="item.id !== editData.id" class="item-icon">
                                                <div>
                                                    <delete-outlined class="icon-item" @click.stop="deleteMenuArea(item)" />
                                                    <edit-outlined class="icon-item edit-icon" @click.stop="editMenuArea(item)" />
                                                </div>
                                                <div v-if="formState.parentId == item.id">
                                                    <check-outlined class="icon-item check-icon" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="isAdd" class="add-item">
                                        <a-input v-model:value="valueName" placeholder="请输入" class="user-select" />
                                        <div class="add-icon">
                                            <close-circle-outlined class="icon-item" @click="closeAdd(2)" />
                                            <check-circle-outlined class="icon-item check-icon" @click="appMenuArea(2)" />
                                        </div>
                                    </div>
                                </div>
                                <!-- 空状态 -->
                                <a-empty v-if="!menuAreaList.length && !isAdd" :image="Empty.PRESENTED_IMAGE_SIMPLE" image-style=" height: 50px" />
                                <a-divider style="margin: 4px 0" />
                                <div class="btn" @click="isAdd = true">
                                    <a-button type="primary" size="mini">
                                        <template #icon>
                                            <plus-outlined />
                                        </template>
                                        新增
                                    </a-button>
                                </div>
                            </div>
                        </template>
                    </a-select>
                </a-form-item>
                <a-form-item label="菜单名称" name="name">
                    <a-input v-model:value="formState.name" placeholder="菜单名称" />
                </a-form-item>

                <a-form-item label="菜单图标(白天模式)" name="icon">
                    <div class="icon-flex">
                        <a-input v-model:value="formState.icon" placeholder="请输入菜单图标" class="user-select" />
                        <Upload v-model:suffixUrl="formState.icon" v-model:fullUrl="formState.icon" :limit-size="true">
                            <a-button type="primary" size="small" class="mr-5 ml-5 upload-btm">上传</a-button>
                        </Upload>
                        <PreviewImgBtm :url="formState.icon" />
                    </div>
                </a-form-item>

                <a-form-item label="菜单图标(黑夜模式)" name="darkIcon">
                    <div class="icon-flex">
                        <a-input v-model:value="formState.darkIcon" placeholder="请输入菜单图标" class="user-select" />
                        <Upload v-model:suffixUrl="formState.darkIcon" v-model:fullUrl="formState.darkIcon" :limit-size="true">
                            <a-button type="primary" size="small" class="mr-5 ml-5 upload-btm">上传</a-button>
                        </Upload>
                        <PreviewImgBtm :url="formState.darkIcon" />
                    </div>
                </a-form-item>

                <a-form-item label="菜单唯一标识" name="key">
                    <a-input v-model:value="formState.key" placeholder="请输入菜单唯一标识" class="user-select" />
                </a-form-item>
                <a-form-item label="请选择路径类型" name="type">
                    <a-select v-model:value="formState.type" class="user-select">
                        <a-select-option v-for="item in typeList" :key="item.id" :value="item.id">{{ item.name }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item v-if="formState.type == 2" label="菜单本地路径" name="url">
                    <a-input v-model:value="formState.url" placeholder="请输入菜单本地路径" class="user-select" />
                </a-form-item>
                <a-form-item v-else label="菜单外部链接" name="url">
                    <a-input v-model:value="formState.url" placeholder="请输入菜单外部链接" class="user-select" />
                </a-form-item>
                <a-form-item label="菜单位置" name="position">
                    <a-input-number v-model:value="formState.position" :min="1" :controls="false" placeholder="请输入菜单位置" class="user-select" />
                </a-form-item>
                <a-form-item label="请输入菜单显示类型" name="state">
                    <a-select v-model:value="formState.state" class="user-select">
                        <a-select-option v-for="item in stateList" :key="item.id" :value="item.id">{{ item.name }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="是否需要登录" name="loginRequired">
                    <a-radio-group v-model:value="formState.loginRequired" name="loginRequired" placeholder="请选择是否需要登录">
                        <a-radio :value="true">是</a-radio>
                        <a-radio :value="false">否</a-radio>
                    </a-radio-group>
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed, ref, reactive, watch, nextTick } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { message, Form, Empty, Modal } from 'ant-design-vue';
import { DeleteOutlined, EditOutlined, CheckOutlined, PlusOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';
import type { AppMenuList, ContentType, languageType, AppMenuAreaList } from '@/api/appAdmin/types.d';
import UploadImg from '@/components/UploadImg.vue';
import api from '@/api/appAdmin/index';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    messageTyep: {
        type: Number,
        default: 1,
    },

    mItem: {
        type: Object,
        default: () => ({}),
    },
    activeIndex: {
        type: Number,
        default: 1,
    },
    languageList: {
        type: Array as PropType<languageType[]>,
        default: () => [],
    },
});
watch(
    () => props.messageTyep,
    (val) => {
        if (val > 1) {
            if (val == 3) {
                const types = ['language', 'name', 'parentId', 'key'];
                Object.keys(formState.value).forEach((key) => {
                    if (!types.includes(key)) {
                        // @ts-ignore
                        formState.value[key] = props.mItem[key];
                    }
                });
            } else {
                // @ts-ignore
                formState.value = props.mItem;
            }

            if (props.activeIndex == 1) {
                handleChangeLanguage(false);
            }
        }
    },
    {
        deep: true,
    }
);

const { useForm } = Form;
const formRef = ref<FormInstance | null>(null);
const uploadFileRef = ref<InstanceType<typeof UploadImg>>();
const formState = ref<AppMenuList>({
    icon: '',
    darkIcon: '',
    key: '',
    loginRequired: false,
    name: '',
    path: '',
    position: '',
    state: 0,
    type: 1,
    parentId: undefined,
    url: '',
    language: undefined,
});
const deepFormState = JSON.parse(JSON.stringify(formState.value));
// const { resetFields, validate, validateInfos } = useForm(
//   formState,
//   reactive({
//     'name.zh-CN': [{ required: true, trigger: 'blur', message: '请填写菜单名称(中文)' }],
//     'name.ar-AE': [{ required: true, trigger: 'blur', message: '请填写菜单名称(阿拉伯语)' }],
//     'name.ru-RU': [{ required: true, trigger: 'blur', message: '请填写菜单名称(俄语)' }],
//     'name.en-US': [{ required: true, trigger: 'blur', message: '请填写菜单名称(英文)' }],
//   })
// );
const selectOpen = ref(false);
const valueName = ref('');
const editData = ref({
    name: '',
    id: '',
    language: '',
});
const isAdd = ref(false);
const isEdit = ref(false);
const validateParentId = (rule: any, value: any, callback: any) => {
    if (!formState.value.language) {
        return Promise.reject('请先选择语言');
    }
    if (!value) {
        return Promise.reject('请选择菜单区');
    }
    return Promise.resolve();
};
const validatePosition = (rule: any, value: any, callback: any) => {
    if (!value) return Promise.reject('请输入菜单位置');

    // 不能输入小数
    if (String(value).includes('.')) return Promise.reject('不能输入小数');
    return Promise.resolve();
};
const fromRules = {
    language: [{ required: true, trigger: 'blur', message: '请选择语言' }],
    name: [{ required: true, trigger: 'blur', message: '请填写菜单名称' }],
    parentId: [{ required: true, validator: validateParentId, trigger: 'change' }],
    icon: [{ required: true, trigger: 'blur', message: '请填写白天模式菜单图标' }],
    darkIcon: [{ required: true, trigger: 'blur', message: '请填写黑夜模式菜单图标' }],
    path: [{ required: true, trigger: 'blur', message: '请填写菜单本地路径' }],
    key: [{ required: true, trigger: 'blur', message: '请填写菜单唯一标识' }],
    loginRequired: [{ required: true, trigger: 'blur', message: '请选择是否需要的登录' }],
    position: [{ required: true, trigger: 'blur', validator: validatePosition }],
    url: [
        {
            required: true,
            trigger: 'blur',
            message: '请输入菜单外部链接',
        },
    ],
    state: [{ required: true, trigger: 'blur', message: '请选择菜单状态' }],
    type: [{ required: true, trigger: 'blur', message: '请选择菜单类型' }],
};

const stateList = [
    { id: 0, name: '显示' },
    { id: 1, name: '隐藏' },
];
const typeList = [
    { id: 1, name: '外部链接' },
    { id: 2, name: '本地路径' },
];
const title = computed(() => `${[1, 3].includes(props.messageTyep) ? '新增' : '编辑'}${props.activeIndex === 1 ? '更多' : '信用卡'}菜单`);

const emit = defineEmits(['update:visible', 'handleOk']);
const handelCancel = () => {
    // resetFields();

    selectOpen.value = false;
    formRef.value?.resetFields();
    emit('update:visible', false);
    uploadFileRef.value?.fileList.splice(uploadFileRef.value?.fileList.length);
    closeAdd(1);
    closeAdd(2);
    formState.value = JSON.parse(JSON.stringify(deepFormState));
};
const menuAreaList = ref<AppMenuAreaList[]>([]);
const handelselectOpen = () => {
    if (selectOpen.value) {
        selectOpen.value = false;
    }
    closeAdd(1);
    closeAdd(2);
};
const handleOk = async () => {
    // await validate();
    await formRef.value?.validate();
    const Cardfeatchs = ['fetchAppCardMenuAdd', 'fetchAppCardMenuEdit'];
    const fetchs = ['fetchAppMenuAdd', 'fetchAppMenuEdit'];
    const Apis = props.activeIndex == 1 ? fetchs : Cardfeatchs;
    const fetch = [1, 3].includes(props.messageTyep) ? Apis[0] : Apis[1];
    // @ts-ignore
    await api[fetch](formState.value);
    message.success(`${title.value}成功`);
    const language = formState.value.language as string;
    handelCancel();
    emit('handleOk', language);
};

const selectData = (item: { id: number | string; name: string }) => {
    formState.value.parentId = item.id;
    selectOpen.value = false;
};

const getAppMenuAreaList = () => {
    api.fetchappMenuAreaList({
        language: formState.value.language as string,
    }).then((res) => {
        menuAreaList.value = res;
    });
};
const appMenuAreaAdd = () => {
    const language = formState.value.language as string;
    api.fetchappMenuAreaAdd({
        language,
        name: valueName.value,
    })
        .then((res) => {
            message.success('新增菜单区成功');
            isAdd.value = false;
            getAppMenuAreaList();
            closeAdd(2);
        })
        .catch(() => {
            message.error('新增菜单区失败');
        });
};
const appMenuAreaEdit = () => {
    api.fetchappMenuAreaUpdate({
        ...editData.value,
    })
        .then((res) => {
            message.success('修改菜单区成功');
            isEdit.value = false;
            closeAdd(1);
            getAppMenuAreaList();
        })
        .catch(() => {
            message.error('修改菜单区失败');
        });
};
const editMenuArea = (item: AppMenuAreaList) => {
    isEdit.value = true;
    editData.value.name = item.name;
    editData.value.id = item.id + '';
    editData.value.language = formState.value.language as string;
};
const closeAdd = (type: 1 | 2 | 3) => {
    if (type == 1) {
        isEdit.value = false;
        editData.value.name = '';
        editData.value.id = '';
    } else {
        isAdd.value = false;
        valueName.value = '';
    }
};
const appMenuArea = (type: 1 | 2) => {
    if (!formState.value.language) return message.warning('请选择语言');
    type == 1 ? appMenuAreaEdit() : appMenuAreaAdd();
};
const handleChangeLanguage = (isRest: boolean = true) => {
    if (props.activeIndex !== 1) return;
    getAppMenuAreaList();
    const { parentId } = formState.value;
    formState.value.parentId = isRest ? undefined : parentId;
    formRef.value?.resetFields(['parentId']);
};
const deleteMenuArea = (item: AppMenuAreaList) => {
    Modal.confirm({
        title: '删除',
        content: '是否要删除该菜单区',
        okText: '确定',
        width: '430px',
        cancelText: '取消',
        class: 'user-moadl-warning',
        async onOk() {
            api.fetchappMenuAreadelete({
                id: item.id,
            }).then(() => {
                message.success('删除成功');
                getAppMenuAreaList();
            });
        },
    });
};
const swatchSelectOpen = () => {
    selectOpen.value = !selectOpen.value;
    if (selectOpen.value) return;
    closeAdd(1);
    closeAdd(2);
};
</script>

<style lang="scss" scoped>
.user-select {
    width: 300px;
}

:deep(.ant-form-item-label) {
    min-width: 90px;
    text-align: left;
}

.user-dowload {
    width: 240px;
    margin-right: 10px;
}

.ant-input[disabled] {
    background-color: #f5f5f5;
}

.ant-select-disabled {
    :deep(.ant-select-selector) {
        background-color: #f5f5f5 !important;
    }
}

.icon-flex {
    display: flex;
}

.menu-list {
    .item-list {
        padding: 2px 0;

        .item {
            display: flex;
            align-items: center;
            color: #000000d9;
            cursor: pointer;
            min-height: 32px;
            padding: 8px 12px;
            font-size: 16px;
            font-weight: normal;
            line-height: 22px;
            transition: background 0.3s;

            &:hover {
                background-color: #f5f5f5;
            }

            &.active {
                background-color: #e6f7ff;
                color: #222526;
            }

            .item-name {
                min-width: 65px;
                margin-right: 10px;
            }

            .edit-item {
                display: flex;
                align-items: center;

                .ant-input {
                    width: 200px !important;
                    margin-right: 10px;
                }

                .edit-icon {
                    .icon-item {
                        font-size: 20px;
                        color: red;
                        cursor: pointer;

                        &.check-icon {
                            margin-left: 10px;
                            color: #219f69;
                        }
                    }
                }
            }

            .item-icon {
                flex: 1;
                display: flex;
                justify-content: space-between;
                font-size: 18px;

                .icon-item {
                    &.edit-icon {
                        margin-left: 10px;
                    }

                    &.check-icon {
                        color: #219f69;
                    }
                }
            }
        }

        .add-item {
            padding-left: 10px;
            margin-top: 10px;
            display: flex;
            align-items: center;

            .ant-input {
                margin-right: 10px;
            }

            .add-icon {
                color: red;
                cursor: pointer;

                .icon-item {
                    font-size: 20px;
                }

                .check-icon {
                    margin-left: 10px;
                    color: #219f69;
                }
            }
        }
    }

    .btn {
        padding: 8px 0 5px 5px;
    }
}
</style>
