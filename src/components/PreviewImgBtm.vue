<template>
  <div>
    <a-button size="small" class="upload-btm info" @click="setVisible(true)">查看</a-button>
    <a-image
:style="{ display: 'none' }" :src="`${url}`"
             :preview="{visible,onVisibleChange: setVisible,}"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { message } from 'ant-design-vue';

export default defineComponent({
    name: 'PreviewImgBtm',
    props: {
        url: { type: String, default: '' },
        accept: { type: String, default: 'image/*' }
    },
    setup(props) {
        const visible = ref<boolean>(false);
        const setVisible = (value:boolean) => {
            if (props.url) {
                if (props.accept === 'image/*') visible.value = value;
                else window.open(`${window.location.origin}/api${props.url}`);
            } else message.error('暂无资源路径');
        };
        return {
            visible,
            setVisible
        };
    }
});
</script>
