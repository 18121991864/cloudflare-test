<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="UID" class="mr-22 width-250" name="accountId">
                    <a-input v-model:value="formState.accountId" size="small" placeholder="请输入" @pressEnter="handleSearch" />
                </a-form-item>
                <a-form-item label="已提交认证证件" class="mr-22 width-250" name="documentType">
                    <a-select
                        v-model:value="formState.documentType"
                        placeholder="请选择"
                        :mode="ismultiple('documentType')"
                        @change="changeDocumentType('documentType')"
                    >
                        <a-select-option v-for="item of idTypeOptions" :key="item.value" :value="item.value">{{ item.label }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="证件颁发国家" class="mr-22 w-[250px]" name="countryCode">
                    <a-select
                        v-model:value="formState.countryCode"
                        :mode="ismultiple('countryCode')"
                        class="is-bottom"
                        placeholder="请选择"
                        show-search
                        :options="countryList"
                        :field-names="{
                            label: 'nameZh',
                            value: 'alpha3',
                        }"
                        :filter-option="countryFilterOption"
                        @change="changeDocumentType('countryCode')"
                    >
                    </a-select>
                </a-form-item>
                <a-form-item label="国籍" class="mr-22 w-[250px]" name="nationality">
                    <a-select
                        v-model:value="formState.nationality"
                        :mode="ismultiple('nationality')"
                        class="is-bottom"
                        placeholder="请选择"
                        show-search
                        :options="countryList"
                        :field-names="{
                            label: 'nameZh',
                            value: 'alpha3',
                        }"
                        :filter-option="countryFilterOption"
                        @change="changeDocumentType('nationality')"
                    >
                    </a-select>
                </a-form-item>
                <a-form-item label="身份证认证" class="mr-22 width-250" name="idCardAudit">
                    <a-select v-model:value="formState.idCardAudit" placeholder="请选择" @change="handleSearch">
                        <a-select-option :value="''"> 全部</a-select-option>
                        <a-select-option v-for="item of authStatus" :key="item.value" :value="item.value">{{ item.name }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="护照认证" class="mr-22 width-250" name="passportAudit">
                    <a-select v-model:value="formState.passportAudit" placeholder="请选择" @change="handleSearch">
                        <a-select-option :value="''"> 全部</a-select-option>
                        <a-select-option v-for="item of authStatus" :key="item.value" :value="item.value">{{ item.name }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="人脸认证" class="mr-22 width-250" name="faceAudit">
                    <a-select v-model:value="formState.faceAudit" placeholder="请选择" @change="handleSearch">
                        <a-select-option :value="''"> 全部</a-select-option>
                        <a-select-option v-for="item of authStatus" :key="item.value" :value="item.value">{{ item.name }} </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="创建日期" class="mr-22" name="time">
                    <DateRangePicker v-model="formState.time" @onChange="handleSearch" />
                </a-form-item>
            </div>
            <div class="action-btm display-flex">
                <div v-if="buttonPermissions('settingAuthenticationGrade')">
                    平台认证等级设置：
                    <a-radio-group :value="currentLevel" button-style="solid" @change="handleLevelChange">
                        <a-radio-button value="0">初级认证</a-radio-button>
                        <a-radio-button value="1">高级认证</a-radio-button>
                    </a-radio-group>
                </div>
                <div v-else>&nbsp;</div>
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
        </a-form>
        <a-table
            size="small"
            :pagination="false"
            :loading="loading"
            :columns="tableColumns"
            row-key="id"
            :data-source="tableData"
            :scroll="{ x: 1900 }"
        >
            <template #bodyCell="{ column: { dataIndex }, record, text }">
                <template v-if="['idCardAuthStatus', 'passportAuthStatus','faceAuthStatus'].includes(dataIndex as string)">
                    <span :class="authStatusItem(text)?.color">{{ authStatusItem(text)?.name }}</span>
                </template>

                <template v-else-if="dataIndex === 'action'">
                    <a-button
                        type="link"
                        @click="
                            $router.push({
                                name: 'UserAuthDetail',
                                params: { id: record.accountId },
                            })
                        "
                    >
                        审核详情
                    </a-button>
                </template>
            </template>
        </a-table>

        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />
    </div>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, reactive, ref, onActivated, unref, getCurrentInstance, createVNode } from 'vue';
import NProgress from 'nprogress';
import { Modal, TableColumnType } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { SearchOutlined, RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import api from '@/api/userAPI';
import { PagingDefaultConf } from '@/utils/constant';
import { userIdTypeMap, subSumStatusMap } from '@/enums/userEnum';
import { transMapBySelectOptions, unshiftSelectOptionAll } from '@/utils/component';
import UserAuthCell from '../User/UserAuthCell.vue';

const instance = getCurrentInstance();

defineOptions({ name: 'userAuthentication' });

const idTypeOptions = transMapBySelectOptions(userIdTypeMap);
unshiftSelectOptionAll(idTypeOptions);

const subSumStatusOptions = transMapBySelectOptions(subSumStatusMap);
unshiftSelectOptionAll(subSumStatusOptions);

const currentLevel = ref();

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => {
    const result: TableColumnType[] = [
        { title: 'UID', dataIndex: 'accountId', fixed: 'left' },
        { title: '性别', dataIndex: 'sex', width: 80 },
        { title: 'ApplicantId', dataIndex: 'applicantId' },
        { title: '已提交认证证件', dataIndex: 'documentTypeListing' },
        { title: '证件颁发国家', dataIndex: 'countryListing' },
        { title: '国籍', dataIndex: 'nationalListing' },
        { title: '护照名', dataIndex: 'passportMing' },
        { title: '护照中间名', dataIndex: 'passportMiddle' },
        { title: '护照姓', dataIndex: 'passportXing' },
        { title: '身份证名', dataIndex: 'idCardMing' },
        { title: '身份证中间名', dataIndex: 'idCardMiddle' },
        { title: '身份证姓', dataIndex: 'idCardXing' },
        { title: '身份证认证', dataIndex: 'idCardAuthStatus', width: 90 },
        { title: '护照认证', dataIndex: 'passportAuthStatus', width: 80 },
        { title: '人脸认证', dataIndex: 'faceAuthStatus', width: 80 },
        { title: '创建日期', dataIndex: 'createTime', width: 100 },
    ];

    if (instance?.proxy?.buttonPermissions('userAuthenticationDetail')) {
        result.push({
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            width: 200,
        });
    }
    console.log(result);

    return result;
});

const formState = reactive({
    accountId: '',
    time: [],
    documentType: '', // 证件类型
    countryCode: '', // 证件颁发国家
    nationality: '', // 国籍
    idCardAudit: '', // 身份证认证
    passportAudit: '', // 护照认证
    faceAudit: '', // 人脸认证
});
const documentType = ref('');
const countryCode = ref('');
const nationality = ref('');
const pagination = reactive({ ...PagingDefaultConf });
const loading = ref(false);
const tableData = ref(Object.create([]));
const authStatus = [
    { name: '通过验证', value: 'GREEN', color: 'text-green-400' },
    { name: '拒绝', value: 'RED', color: 'text-red-400' },
    { name: '未认证', value: 'WAIT', color: 'text-neutral-800' },
];
const authStatusItem = computed(() => {
    return (value: string) => {
        return authStatus.find((item) => item.value === value);
    };
});
const handleOnSubmit = () => {
    loading.value = true;
    NProgress.start();
    const { pageNo, pageSize } = pagination;
    const { time, ...formValues } = formState;
    const [startTime, endTime] = time;

    api.fetchUserAuthList({
        ...formValues,
        startTime,
        endTime,
        pageNum: pageNo,
        pageSize,

        documentType: documentType.value,
        countryCode: countryCode.value,
        nationality: nationality.value,
    })
        .then(({ list, totalSize }: PromiseReturnType<typeof api.fetchUserAuthList>) => {
            [tableData.value, pagination.total] = [list, totalSize];
        })
        .finally(() => {
            loading.value = false;
            NProgress.done();
        });
};

(async () => {
    currentLevel.value = await api.fetchGetUserAuthLevel();
})();

const formReset = ref();
const countryList = ref<Array<Record<string, any>>>([]);
const getDitchCountryList = async () => {
    countryList.value = await api.fetchUapyCountryList();
    countryList.value.unshift({ alpha3: '', nameZh: '全部' });
};
const handleResetForm = (): void => {
    // 重置表单
    pagination.pageNo = 1;
    documentType.value = '';
    countryCode.value = '';
    nationality.value = '';
    formReset.value.resetFields();
    handleOnSubmit();
};

const handleSearch = () => {
    pagination.pageNo = 1;
    handleOnSubmit();
};

const route = useRoute();
onMounted(() => {
    if (route.hash === '#no-refresh') return; // 不需要刷新
    getDitchCountryList();
    handleResetForm();
});

const isModalOpen = ref<boolean>(false);
const modalType = ref<'edit' | 'info'>('info');
const activeData = ref(Object.create(null)); // modal打开时激活的数据
const handleOpenModal = (record: PromiseReturnType<typeof api.fetchAccountList>, type: 'edit' | 'info') => {
    // 打开新增/编辑弹框
    activeData.value = record || Object.create(null);
    [isModalOpen.value, modalType.value] = [true, type];
};

function handleLevelChange(e: any) {
    const { value } = e.target;

    const text = +value === 0 ? '初级认证' : '高级认证';

    Modal.confirm({
        title: '修改平台认证等级',
        icon: createVNode(ExclamationCircleOutlined),
        content: `请确认是否修改平台所有用户的认证等级为“${text}”，修改后所有用户将只做“${text}”。`,
        wrapClassName: 'not-cover-class',
        onOk() {
            return api.fetchSetUserAuthLevel({ value }).then(() => {
                currentLevel.value = value;
            });
        },
        okText: '确认',
        cancelText: '取消',
    });
}
const ismultiple = computed(() => {
    return (type: 'documentType' | 'countryCode' | 'nationality') => {
        const typeList = [
            { data: documentType, value: 'documentType' },
            { data: countryCode, value: 'countryCode' },
            { data: nationality, value: 'nationality' },
        ];
        const item = typeList.find((item) => item.value === type);
        return item!.data.value ? 'multiple' : 'combobox';
    };
});
const changeDocumentType = (type: 'documentType' | 'countryCode' | 'nationality') => {
    const typeList = [
        { data: documentType, value: 'documentType' },
        { data: countryCode, value: 'countryCode' },
        { data: nationality, value: 'nationality' },
    ];
    const item = typeList.find((item) => item.value === type);
    if (Array.isArray(formState[item!.value]) && formState[item!.value].includes('')) {
        item!.data!.value = '';
        formState[item!.value] = '';
        handleSearch();
        return false;
    }
    if (typeof formState[item!.value] === 'object' && Object.keys(formState[item!.value]).length === 0) {
        item!.data!.value = '';
        formState[item!.value] = '';
    }

    if (!formState[item!.value]) {
        item!.data!.value = '';
        formState[item!.value] = '';
    } else {
        const type = Array.isArray(formState[item!.value]) ? formState[item!.value].join(',') : String(formState[item!.value]);

        item!.data!.value = type;
    }

    handleSearch();
};
const countryFilterOption = (input: string, option: any) => !!option.nameZh?.includes(input);
</script>
<style lang="scss" scoped>
.action-btm {
    justify-content: space-between;
}
</style>
