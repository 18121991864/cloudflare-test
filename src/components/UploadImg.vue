<template>
  <div>
    <a-upload
        v-if="!computedDisabled"
        v-model:file-list="fileList"
        action="/api/v1/file/upload"
        list-type="picture-card"
        :data="uploadData"
        :headers="headers"
        :show-upload-list="false"
        :disabled="loading"
        class="custom-upload"
        accept="image/jpeg,image/png,image/jpg"
        @change="onChange"
    >
      <img v-if="imageUrl" :src="imageUrl" alt="图片"  class="preview"/>
      <div v-else class="upload-hint">
        <loading-outlined v-if="loading"/>
        <plus-outlined v-else/>
        <div class="text">点击上传</div>
      </div>
    </a-upload>
    <div v-if="computedDisabled"  class="upload-img" @click="previewVisible = true">
      <img v-if="imageUrl" alt="图片" :src="imageUrl"  class="preview"/>
    </div>
    <a-modal :open="previewVisible" title="预览" :footer="null" @cancel="previewVisible = false">
      <img alt="图片" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadChangeParam } from 'ant-design-vue';
import { getToken } from '@/utils/common';

export default defineComponent({
    name: 'UploadImage',
    components: {
        PlusOutlined,
        LoadingOutlined
    },
    props: {
        value: { type: String, default: '', required: true },
        fileType: { type: Number, default: 26, required: false },
        readOnly: {
            type: Boolean,
            default: false,
            required: false
        },
        disabled: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    data() {
        return {
            previewVisible: false,
            fileList: [],
            imageUrl: '',
            loading: false,
            uploadData: {
                fileType: this.fileType
            }
        };
    },
    computed: {
        headers() {
            return getToken();
        },
        computedDisabled() {
            return this.readOnly || this.disabled;
        },
        previewImage() {
            return this.imageUrl;
        }
    },
    watch: {
        value(n) {
            this.imageUrl = n;
        }
    },
    methods: {
        onChange(info: UploadChangeParam) {
            if (info.file.status === 'uploading') {
                this.loading = true;
                return;
            }
            if (info.file.status === 'done') {
                this.loading = false;
                const { fullUrl, uri } = info.file.response.data;
                this.$emit('update:value', fullUrl);
                this.$emit('update:suffixUrl', uri);
                this.imageUrl = fullUrl;
                message.success('上传成功');
                return;
            }
            if (info.file.status === 'error') {
                this.loading = false;
                message.error('上传失败');
            }
        },
        handlePreview() {

        }
    }
});
</script>

<style lang="scss" scoped>
.custom-upload {
  :deep(.ant-upload-select-picture-card) {
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
  }
}

.upload-hint {
  color: #0256ff;

  .text {
    font-size: 12px;
    margin-top: 4px;
  }
}

.preview {
  width: 100%;
}

.upload-img {
  width: 148px;
  height: 148px;
  cursor: pointer;
  overflow: hidden;
}
</style>
