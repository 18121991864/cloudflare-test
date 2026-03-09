import type { GlobalComponents } from '@vue/runtime-core';

declare global {
    type ComponentInstance = {
        [Property in keyof GlobalComponents]: InstanceType<GlobalComponents[Property]>;
    };
}
