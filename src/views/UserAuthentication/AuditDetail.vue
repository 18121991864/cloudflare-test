<template>
    <div class="view-wrapper">
        <a-row :gutter="[20, 20]">
            <template v-for="(item, index) in detail?.documentList" :key="index">
                <a-col class="base-info-wrapper" :span="16">
                    <div class="sub-title">{{ item.documentTypeName }}信息</div>
                    <a-descriptions bordered>
                        <a-descriptions-item label="UID" :span="2">
                            {{ item?.accountId }}
                        </a-descriptions-item>
                        <a-descriptions-item label="性别">
                            {{ item?.sex }}
                        </a-descriptions-item>

                        <a-descriptions-item label="姓">
                            {{ item?.xing }}
                        </a-descriptions-item>
                        <a-descriptions-item label="名">
                            {{ item?.ming }}
                        </a-descriptions-item>
                        <a-descriptions-item label="中间名">
                            {{ item?.middleMing }}
                        </a-descriptions-item>

                        <a-descriptions-item label="证件类型">
                            {{ item.documentTypeName }}
                        </a-descriptions-item>
                        <a-descriptions-item label="证件号" :span="2">
                            {{ item?.documentNumber }}
                        </a-descriptions-item>

                        <a-descriptions-item label="证件签发国家/地区">
                            {{ item?.countryCodeName }}
                        </a-descriptions-item>
                        <a-descriptions-item label="居住国家/地区">
                            {{ item?.livingCountryName }}
                        </a-descriptions-item>
                        <a-descriptions-item label="国籍">
                            {{ item?.nationalityName }}
                        </a-descriptions-item>

                        <a-descriptions-item label="证件签发日期">
                            {{ item?.issuingDate }}
                        </a-descriptions-item>
                        <a-descriptions-item label="证件到期日期">
                            {{ item?.expirationDate }}
                        </a-descriptions-item>
                        <a-descriptions-item label="用户出生日期">
                            {{ item?.dob }}
                        </a-descriptions-item>
                        <a-descriptions-item label="用户登记地址" :span="4">
                            {{ item?.documentAddress }}
                        </a-descriptions-item>
                        <a-descriptions-item label="提交认证时间" :span="4">
                            {{ item?.createTime }}
                        </a-descriptions-item>
                    </a-descriptions>
                </a-col>
                <a-col :span="8">
                    <template v-if="detail">
                        <div class="sub-title">审核结果</div>
                        <div class="audit-result">
                            <a-alert :message="getStatus(item.reviewAnswer).message" :type="getStatus(item.reviewAnswer).type" show-icon>
                                <template #description>
                                    <div>
                                        <div v-if="item.clientComment">
                                            <a-tag color="red">
                                                {{ item.clientComment }}
                                            </a-tag>
                                        </div>
                                        <div>{{ getStatus(item.reviewAnswer).text }}</div>
                                    </div>
                                </template>
                            </a-alert>
                        </div>
                    </template>
                    <template v-else>&nbsp;</template>
                </a-col>
                <a-col :span="24">
                    <a-divider />
                </a-col>
                <a-col v-if="detail" :span="24">
                    <div class="auth-file-wrapper">
                        <div :style="`--column-number:${item.documentType === 1 ? 2 : 1}`">
                            <div class="sub-title">{{ item.documentTypeName }}-证明材料</div>
                            <div class="file-list-wrapper">
                                <a-card hoverable title="证件正面：">
                                    <div>
                                        <a-image v-if="item.frontUri" :src="item.frontUri" />
                                        <a-empty v-else />
                                    </div>
                                </a-card>
                                <a-card v-if="item.documentType === 1" hoverable title="证件背面：">
                                    <div>
                                        <a-image v-if="item.backUri" :src="item.backUri" />
                                        <a-empty v-else />
                                    </div>
                                </a-card>
                            </div>
                        </div>
                    </div>
                </a-col>
            </template>

            <a-col v-if="detail" :span="12">
                <div style="--column-number: 2">
                    <div class="sub-title">高级活体检测材料</div>
                    <div class="mb-5 ml-20 text-base">提交认证时间 {{ detail?.createTime }}</div>
                    <div class="file-list-wrapper">
                        <a-card hoverable title="自拍：">
                            <div style="text-align: center">
                                <a-image v-if="detail.faceUri" :src="detail.faceUri" width="30%" />
                                <a-empty v-else style="height: 300px" />
                            </div>
                        </a-card>
                    </div>
                </div>
            </a-col>
            <a-col :span="8">
                <template v-if="detail">
                    <div class="sub-title">审核结果</div>
                    <div class="audit-result">
                        <a-alert :message="getStatus(detail.faceAnswer).message" :type="getStatus(detail.faceAnswer).type" show-icon>
                            <template #description>
                                <div>
                                    <div v-if="detail.rejectLabels">
                                        <a-tag color="red">
                                            {{ detail.rejectLabels }}
                                        </a-tag>
                                    </div>
                                    <div>{{ getStatus(detail.faceAnswer).text }}</div>
                                </div>
                            </template>
                        </a-alert>
                    </div>
                </template>
                <template v-else>&nbsp;</template>
            </a-col>
        </a-row>
        <div style="margin-top: 16px">
            <a-button type="primary" @click="handleBack">返回</a-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/userAPI';
import { computed, ref, unref } from 'vue';
import useTagsView from '@/store/tagsView';
import { userIdTypeEnum } from '@/enums/userEnum';
import type { DocumentList } from '@/api/userAPI/types';

defineOptions({ name: 'UserAuthDetail' });
const route = useRoute();
const detail = ref<PromiseReturnType<typeof api.fetchUserAuthDetail>>();

async function queryDetailData() {
    detail.value = await api.fetchUserAuthDetail({ accountId: route.params.id });
}

queryDetailData();

const { back } = useRouter();
const tagsView = useTagsView();

const getStatus = computed(() => {
    return (type: 'WAIT' | 'GREEN' | 'RED') => {
        const typeList = [
            { type: 'info', text: '用户还未认证信息', message: '未认证', rejectTag: [], value: 'WAIT' },
            { type: 'success', text: '用户认证信息已通过', message: '已通过', rejectTag: [], value: 'GREEN' },
            { type: 'error', text: '用户认证信息未通过', message: '未通过', rejectTag: [], value: 'RED' },
        ];
        const item = typeList.find((item) => item.value === type);

        return item ? item : typeList[0];
    };
});

const handleBack = () => {
    back();
    tagsView.deleteVisitedViewByName('UserAuthDetail', true);
};

const isShowIdBack = computed(() => !(unref(detail)?.documentType === userIdTypeEnum.PASSPORT));

// watch(() => route.params.id, queryDetailData);
</script>

<style scoped lang="scss">
.view-wrapper {
    position: relative;
    margin: 50px 22px 50px 20px;
    padding: 20px;
    background: #fff;

    .sub-title {
        font-size: 16px;
        margin-bottom: 16px;
        color: #000;
        font-weight: 550;
    }

    .auth-file-wrapper {
        display: flex;
        column-gap: 20px;

        & > div {
            flex: var(--column-number);
        }

        .file-list-wrapper {
            display: flex;
            column-gap: 20px;

            & > div {
                flex: 1;
            }
        }

        ::v-deep(.ant-image) {
            height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
                max-height: 100%;
                max-width: 100%;
                width: unset;
            }
        }

        ::v-deep(.ant-empty) {
            height: 400px;
        }
    }
}
</style>
