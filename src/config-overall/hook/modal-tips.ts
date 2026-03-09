import { message, Modal } from 'ant-design-vue';

export const warningModal = (title: string, content: string) => {
    Modal.warning({
        title: title,
        content: content,
        class: 'user-moadl-warning',
    });
};
export const ErrorgModal = (title: string, content: string) => {
    Modal.error({
        title: title,
        content: content,
        class: 'user-moadl-error',
    });
};
