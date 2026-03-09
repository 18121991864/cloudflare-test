import { message, Modal } from 'ant-design-vue';
import { createVNode, VNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
interface tipsString {
    title: string;
    content: string | (() => VNode);
    className?: string;
    sucessTips: string;
    cancelText?: string;
    okText?: string;
    width?: string;
    handelSubmit?: () => void;
    changeStateApi: (params: any) => Promise<any>;
    onClose?: () => void;
}
export default (tips: tipsString, params: any) => {
    Modal.confirm({
        title: tips.title,
        icon: createVNode(ExclamationCircleOutlined),
        content: tips.content,
        okText: tips.okText || '确定',
        width: tips.width || '430px',
        cancelText: tips.cancelText || '取消',
        class: tips.className || 'user-moadl-warning',
        async onOk() {
            await tips.changeStateApi(params);
            if (tips.handelSubmit) {
                tips.handelSubmit();
            }
            message.success(tips.sucessTips);
        },
        onCancel() {
            if (tips.onClose) {
                tips.onClose();
            }
        },
    });
};
