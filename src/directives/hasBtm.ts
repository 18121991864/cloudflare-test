/* eslint-disable no-unused-vars,no-eval,no-unused-vars,no-param-reassign,no-shadow,func-names */
import type { VNode, App, Directive, DirectiveBinding } from 'vue';
import { storeToRefs } from 'pinia';
import { hyphenate } from '@/utils/common';

import pinia from '@/store/Index';
import useSidebar from '@/store/sideBar';

const store = useSidebar(pinia);
const { roleMenu } = storeToRefs(store);

export const hasBtm: Directive = function (
    el: HTMLElement,
    { /* instance, */ value/* , oldValue */, arg = 'true' }: DirectiveBinding,
    vNode: VNode
): void {
    const roleBtm = roleMenu.value?.find(({ component }) => component === value);
    if (!roleBtm && arg) el.parentNode?.removeChild(el);
    if (roleBtm && !arg) el.parentNode?.removeChild(el);
};

export default {
    install: (app: App): void => {
        app.directive(hyphenate(hasBtm.name), hasBtm);
    }
};
