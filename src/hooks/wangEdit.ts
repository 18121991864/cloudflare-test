import type { FormInstance } from 'ant-design-vue';
import type { Ref } from 'vue';
import { ref } from 'vue';
const isItialization = ref(false);
function useWangEdit(formState: Ref<any>, type: string, formRef: Ref<FormInstance>) {
    if (formState.value[type]) {
        formRef.value.clearValidate([type]);
    } else {
        if (isItialization.value) {
            formRef.value.validateFields([type]);
        } else {
            isItialization.value = true;
        }
    }
}
export { isItialization, useWangEdit };
