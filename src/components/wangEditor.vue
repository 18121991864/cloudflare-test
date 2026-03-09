<template>
  <div>
    <div style="border: 1px solid #ccc">
      <Toolbar
        :editor="editorRef"
        :default-config="toolbarConfig"
        :mode="mode"
        style="border-bottom: 1px solid #ccc"
      />
      <Editor
        :default-config="editorConfig"
        :mode="mode"
        :model-value="valueHtml"
        style="min-height: 200px; overflow-y: hidden"
        class="user-editor"
        @onCreated="handleCreated"
        @onChange="handleChange"
        @onDestroyed="handleDestroyed"
        @onFocus="handleFocus"
        @onBlur="handleBlur"
        @customAlert="customAlert"
        @customPaste="customPaste"
        @click.stop="handleClick"
      />
    </div>
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import { onBeforeUnmount, ref, shallowRef, onMounted, watch } from 'vue';

import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

const props = defineProps({
    valueHtml: {
        type: String,
        default: '',
    },
    valueText: {
        type: String,
        default: '',
    },
});
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();

// 模拟 ajax 异步获取内容

const toolbarConfig = {
    excludeKeys: ['group-image', 'group-video'],
};
const editorConfig = { placeholder: '请输入内容...' };

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;

    editor.destroy();
});
const handleClick = (e) => {
    editorRef.value.focus();
};

// 编辑器回调函数
const handleCreated = (editor) => {
    editorRef.value = editor; // 记录 editor 实例，重要！

    handelInitialization(editor);
};
const emit = defineEmits(['update:valueText', 'update:valueHtml']);
const handleChange = (editor) => {
    if (!editor.getText()) return false;
    emit('update:valueHtml', editor.getHtml());
    emit('update:valueText', editor.getText(), true);
};
const handleDestroyed = (editor) => {
    //   console.log("destroyed", editor);
};
const handleFocus = (editor) => {
    //   console.log("focus", editor);
};
const handleBlur = (editor) => {
    // console.log("blur", editor);
    emit('update:valueHtml', editor.getHtml());
    emit('update:valueText', editor.getText(), true);
};
const customAlert = (info, type) => {
    // alert(`【自定义提示】${type} - ${info}`);
};
const handelInitialization = (editor) => {
    editorRef.value.blur();
    console.log('editor.getHtml()', editor);
    emit('update:valueHtml', editor.getHtml());
    emit('update:valueText', editor.getText(), false);
};

const customPaste = (editor, event, callback) => {
    // console.log("ClipboardEvent 粘贴事件对象", event);

    // 自定义插入内容
    editor.insertText(event.getText());

    // 返回值（注意，vue 事件的返回值，不能用 return）
    callback(false); // 返回 false ，阻止默认粘贴行为
    // callback(true) // 返回 true ，继续默认的粘贴行为
};

const insertText = () => {
    const editor = editorRef.value;
    if (editor == null) return;

    editor.insertText('hello world');
};

const printHtml = () => {
    const editor = editorRef.value;
    if (editor == null) return;
    console.log(editor.getHtml());
};

const disable = () => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.disable();
};
</script>
