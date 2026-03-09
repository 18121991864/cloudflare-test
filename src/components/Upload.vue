<template>
    <div class="flex" :class="isdeleteBtn ? 'user-isdeleteBtn' : 'flex-wrap'">
        <a-upload-dragger
            ref="upload"
            name="file"
            :show-upload-list="false"
            :custom-request="uploadImage"
            :before-upload="beforeUpload"
            :accept="accept"
            :disabled="disabled"
            :maxCount="maxCount"
        >
            <slot v-if="isdeleteBtn"></slot>
            <div v-else class="custom-box" :style="{ minHeight: !fullUrl ? '150px' : '' }">
                <!-- 上传一个文件 -->
                <div v-if="maxCount === 1">
                    <div v-if="fullUrl" class="custom-item custom-img" @click.stop>
                        <a-image :src="fullUrl" alt="avatar" :height="height" />
                        <a-popconfirm ok-type="danger" :title="`确认删除？`" @confirm="clearImage">
                            <template #icon><question-circle-outlined :style="{ color: 'red' }" /></template>
                            <div class="deleteBtn">
                                <delete-outlined class="delete-icon" />
                            </div>
                        </a-popconfirm>
                    </div>
                    <div class="custom-item" v-else>
                        <div class="outlined">+</div>
                        <div class="upload-text" @click.stop>
                            <slot name="upload-text"></slot>
                            <div>图片大小不超过{{ maxFileSize }}M</div>
                        </div>
                        <div
                            v-if="loading"
                            class="loading display-flex flex-justify-content-center flex-align-items-center"
                            :class="isdeleteBtn ? '' : 'use-loading'"
                            @click.stop
                        >
                            <loading-outlined style="color: white"></loading-outlined>
                        </div>
                    </div>
                </div>
                <!-- 上传多个文件 -->
                <div v-else @click="isStop">
                    <div class="flex flex-wrap" @click="isStop">
                        <div v-for="(item, index) in fullUrlArray" :key="index" class="mr-4 custom-item custom-img max-box" @click.stop>
                            <a-image :src="item" alt="avatar" :height="height" />
                            <a-popconfirm ok-type="danger" :title="`确认删除？`" @confirm="removeMaxImage(index)">
                                <template #icon><question-circle-outlined :style="{ color: 'red' }" /></template>
                                <div class="deleteBtn">
                                    <delete-outlined class="delete-icon" />
                                </div>
                            </a-popconfirm>
                        </div>
                        <div class="custom-item" v-if="maxCount > fullUrlArray.length">
                            <div class="outlined">+</div>
                            <div class="upload-text multiple-upload-text" @click.stop>
                                <slot name="upload-text"></slot>
                                <div>图片大小不超过{{ maxFileSize }}M</div>
                            </div>
                            <div
                                v-if="loading"
                                class="loading display-flex flex-justify-content-center flex-align-items-center"
                                :class="isdeleteBtn ? '' : 'use-loading'"
                                @click.stop
                            >
                                <loading-outlined style="color: white"></loading-outlined>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a-upload-dragger>
        <a-popconfirm v-if="isdeleteBtn" ok-type="danger" :title="`确认删除？`" @confirm="clearImage">
            <template #icon><question-circle-outlined :style="{ color: 'red' }" /></template>
            <a-button v-if="suffixUrl" class="mr-5 red" size="small" :disabled="loading" danger>删除</a-button>
        </a-popconfirm>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { message } from 'ant-design-vue';
import type { UploadDragger } from 'ant-design-vue';
import { LoadingOutlined, QuestionCircleOutlined, DeleteOutlined } from '@ant-design/icons-vue';

import api from '@/api/fetchTest/index';

interface FileItem {
    uid: string;
    name?: string;
    status?: string;
    response?: string;
    url?: string;
    type?: string;
    size: number;
    originFileObj: any;
}

export default defineComponent({
    name: 'Upload',
    components: {
        LoadingOutlined,
        QuestionCircleOutlined,
        DeleteOutlined,
    },
    props: {
        disabled: { type: Boolean, default: false },
        fileType: { type: Number, default: 1 },
        accept: { type: String, default: 'image/*' },
        suffixUrl: { type: String, default: '' },
        fullUrl: { type: String, default: '' },
        limitSize: { type: Boolean, default: false },
        maxFileSize: { type: Number, default: 10 },
        customSize: { type: Boolean, default: false },
        platform: { type: String, default: '' },
        proportion: { type: Number, default: 3 / 1 },
        isdeleteBtn: { type: Boolean, default: true },
        height: { type: String, default: 'auto' },
        maxCount: { type: Number, default: 1 },
        suffixUrlArray: { type: Array, default: () => [] },
        fullUrlArray: { type: Array, default: () => [] },
    },
    setup(props, context) {
        const beforeUpload = async (file: FileItem) => {
            if (props.limitSize) {
                await checkImgwh(file);
            }
            const isLt2M = file.size / 1024 / 1024 < props.maxFileSize;
            console.log(file.type, props.accept);
            const type = file.type as string;
            const accepts = type.split('');
            const index = type.search('/') + 1;
            const accept = accepts.splice(index).join('');

            if (!props.accept.includes(accept) && props.accept !== 'image/*') {
                message.error(`上传文件格式错误,请上传格式为${props.accept}`);
                return false;
            }
            const accept1 = accepts.splice(0, index - 1).join('');
            if (props.accept == 'image/*' && !props.accept.includes(accept1)) {
                message.error('请上传图片');
                return false;
            }
            if (!isLt2M) {
                message.error(`${props.accept.includes(accept1) ? '图片' : '文件'}不得大于${props.maxFileSize}MB!`);
                return false;
            }
            return isLt2M;
        };

        const checkImgwh = (file: FileItem) => {
            return new Promise((resolve, reject) => {
                const filereader = new FileReader();
                // @ts-ignore
                filereader.readAsDataURL(file);
                filereader.onload = (e) => {
                    // @ts-ignore
                    const src = e.target.result;
                    const image = new Image();
                    console.log(props.customSize);

                    if (props.customSize) {
                        customAspectRatio(image, resolve, reject);
                    } else {
                        checkonloadSize(image, resolve, reject);
                    }

                    image.onerror = reject;
                    image.src = src as string;
                };
            });
        };
        const checkonloadSize = (image: HTMLImageElement, resolve: (reason?: any) => void, reject: (reason?: any) => void) => {
            image.onload = function () {
                if (144 <= image.width && 144 <= image.height) {
                    resolve(true);
                } else {
                    message.error('上传图片宽高不得小于144');
                    reject(false);
                }
            };
        };
        const customAspectRatio = (image: HTMLImageElement, resolve: (reason?: any) => void, reject: (reason?: any) => void) => {
            image.onload = function () {
                console.log('props.proportion', props.proportion);
                const PlatformRatio = props.platform === 'pc' ? 16 / 9 : props.proportion;
                const ratio = image.naturalWidth / image.naturalHeight;
                const distance = Math.abs(ratio - PlatformRatio);
                const proportionText = props.proportion == 3 / 1 ? '3:1' : '4:3';
                if (distance < 0.1) {
                    resolve(true);
                } else {
                    message.error(`平台${props.platform}:上传图片宽高比必须等于${props.platform === 'pc' ? '16:9' : proportionText}`);
                    reject(false);
                }
            };
        };
        const loading = ref<boolean>(false);
        const uploadImage = (file: any) => {
            loading.value = true;
            if (props.platform) {
                const platform = props.platform === 'pc' ? 1 : 2;
                api.uploadBanner({ file: file.file, fileType: props.fileType, platform })
                    .then(({ fullUrl, uri }) => {
                        if (uri) context.emit('update:suffixUrl', uri); // 半路径
                        if (fullUrl) context.emit('update:fullUrl', fullUrl); // 全路径
                    })
                    .finally(() => {
                        loading.value = false;
                    })
                    .catch(() => {
                        message.error('上传失败');
                    });
            } else {
                api.uploadFile({ file: file.file, fileType: props.fileType })
                    .then(({ fullUrl, uri }) => {
                        if (props.maxCount === 1) {
                            if (uri) context.emit('update:suffixUrl', uri); // 半路径
                            if (fullUrl) context.emit('update:fullUrl', fullUrl); // 全路径
                        } else {
                            if (uri) context.emit('update:suffixUrlArray', [...props.suffixUrlArray, uri]); // 半路径
                            if (fullUrl) context.emit('update:fullUrlArray', [...props.fullUrlArray, fullUrl]); // 全路径
                        }
                    })
                    .finally(() => {
                        loading.value = false;
                    })
                    .catch(() => {
                        message.error('上传失败');
                    });
            }
        };

        const clearImage = () => {
            context.emit('update:suffixUrl', '');
            context.emit('update:fullUrl', '');
        };
        const removeMaxImage = (index: number) => {
            props.fullUrlArray.splice(index, 1);
            props.suffixUrlArray.splice(index, 1);
            context.emit('update:suffixUrlArray', props.suffixUrlArray); // 半路径
            context.emit('update:fullUrlArray', props.fullUrlArray);
        };
        const isStop = (e: any) => {
            if (props.fullUrlArray.length >= props.maxCount) {
                return e.stopPropagation();
            }
        };
        return {
            beforeUpload,
            loading,
            isStop,
            uploadImage,
            removeMaxImage,
            clearImage,
        };
    },
});
</script>

<style lang="scss" scoped>
.loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgb(0 0 0 / 70%);
}

.ant-upload-text {
    color: white;
    font-size: 12px;
}

::v-deep(.ant-upload) {
    border: none !important;
}

::v-deep(.ant-upload-btn) {
    padding: 0 !important;
}
.use-loading {
    width: 104px;
    height: 100px;
}
.custom-box {
    position: relative;
    background-color: #fff;
    // margin-left: 5px;
    cursor: auto;
    .custom-item {
        position: relative;
        margin-bottom: 10px;

        .outlined {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100px;
            height: 100px;
            border: 1px solid #ddd;
            font-size: 38px;
            font-weight: normal;
            color: #00000075;
            cursor: pointer;
        }

        &.custom-img {
            display: flex;
            align-items: center;
            .deleteBtn {
                align-self: flex-end;
                cursor: pointer;
                .delete-icon {
                    color: #ff2020;
                    font-size: 20px;
                    margin-left: 20px;
                }
            }
            :deep(.ant-image-img) {
                width: 100px;
                object-fit: cover;
                display: flex;
                justify-content: start;
            }
        }
        &.max-box {
            .deleteBtn {
                .delete-icon {
                    margin-left: 10px !important;
                }
            }
        }
    }
    .upload-text {
        position: absolute;
        font-size: 12px;
        color: #333333cf;
        cursor: auto;
        width: 300px;
        &.multiple-upload-text {
            position: static;
        }
        div {
            text-align: left;
            margin-top: 5px;
            &:nth-child(1) {
                margin-top: 0;
            }
        }
    }
}
.user-isdeleteBtn {
    :deep(.ant-upload-btn) {
        .ant-btn {
            margin-right: 5px !important;
        }
    }
    .ant-btn {
        margin-right: 5px !important;
    }
}
</style>
