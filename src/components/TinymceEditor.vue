<template>
    <Editor :id="'' + currId + new Date().getTime()" v-model="currContent" :init="editorProps" :disable="disable" />
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, reactive, watch } from 'vue';
import Editor from '@tinymce/tinymce-vue';
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/silver/theme';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/themes/mobile';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/fullpage';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/hr';
// import 'tinymce/plugins/image'; // 插入上传图片插件
// import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/noneditable';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/print';
import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/spellchecker';
import 'tinymce/plugins/tabfocus';
import 'tinymce/plugins/table';
import 'tinymce/plugins/template';
import 'tinymce/plugins/textpattern';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';
import api from '@/api/fetchTest/index';
import i18n from '@/setup/i18n-setup';

interface EditorType {
    selector?: string;
    width: number;
    height: number;
    // eslint-disable-next-line camelcase
    language_url: string;
    language: string;
    // eslint-disable-next-line camelcase
    skin_url?: string;
    menubar: boolean;
    statusbar: boolean;
    // eslint-disable-next-line camelcase
    convert_urls: boolean;
    toolbar: string[];
    inline?: boolean;
    plugins: string[];
    // eslint-disable-next-line camelcase
    images_upload_handler?: Function;
    encoding?: string;
    doctype?: string;
    // eslint-disable-next-line camelcase
    extended_valid_elements?: string;
    // eslint-disable-next-line camelcase
    fullpage_default_encoding?: string;
    // eslint-disable-next-line camelcase
    fontsize_formats: string;
    // eslint-disable-next-line camelcase
    fullpage_default_font_size: string;
}
const plugins = [
    'advlist anchor autolink autoresize autosave charmap code codesample directionality fullpage fullscreen help hr image imagetools insertdatetime link lists nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textpattern visualblocks visualchars wordcount',
];
// Details see: https://www.tinymce.com/docs/advanced/editor-control-identifiers/#toolbarcontrols
const toolbar = [
    'searchreplace fontsizeselect bold italic underline strikethrough alignleft aligncenter alignright outdent indent blockquote undo redo removeformat subscript superscript code codesample help',
    'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime table charmap forecolor backcolor fullpage fullscreen',
];

export default defineComponent({
    name: 'TinymceEditor',
    components: { Editor },
    props: {
        width: {
            // 宽度
            type: Number,
            default: () => 800,
        },
        height: {
            // 高度
            type: Number,
            default: () => 300,
        },
        value: {
            type: String,
            default: () => '',
            require: true,
        },
        menubar: {
            // 菜单栏
            type: String,
            default: 'file edit insert view format table',
        },
        hasId: {
            type: String,
            default: () => 'tinymce',
            require: true,
        },
        disable: {
            // 是否禁用
            type: Boolean,
            default: () => false,
        },
    },
    setup(props) {
        const editorProps = reactive<EditorType>({
            width: props.width,
            height: props.height,
            language_url: '',
            language: '',
            skin: 'oxide',
            skin_url: '../../tinymce/skins/ui/oxide',
            menubar: true,
            statusbar: false,
            convert_urls: false,
            fullpage_default_font_size: '16px',
            fullpage_default_encoding: 'UTF-8',
            extended_valid_elements: 'img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name]',
            fontsize_formats: '12px 14px 16px 18px 24px 36px 48px', // 文字大小
            toolbar,
            plugins,
            inline: false,
            images_upload_handler: (fileInfo: any, success: Function, fullUrl: Function) => {
                const params = { file: fileInfo.blob() };
                api.uploadFile(params)
                    .then((data) => {
                        success(`/api${data}`);
                    })
                    .catch(() => {
                        fullUrl('上传失败');
                    });
            },
        });

        watch(
            () => i18n.global.locale,
            () => {
                // 切换语言
                tinymce.EditorManager.execCommand('mceRemoveEditor', true, props.hasId);
                editorProps.language_url = new URL('../../public/tinymce/langs/zh_CN.js', import.meta.url).toString();
                editorProps.language = 'zh_CN';
                tinymce.init({});
                tinymce.EditorManager.execCommand('mceAddEditor', true, props.hasId);
            },
            { deep: true, immediate: true }
        );

        const currContent = computed(() => props.value);
        const currId = computed(() => props.hasId); // currId是唯一的
        onBeforeMount(() => {
            tinymce.init({});
        });
        return {
            currId,
            editorProps,
            currContent,
        };
    },
});
</script>
