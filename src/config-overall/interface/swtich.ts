import type { Slot } from 'vue';
export interface SwitchConfig {
    /** 选中时显示的文本 */
    checkedChildren?: string | Slot;
    /** 是否禁用 */
    disabled?: boolean;
    /** 选中值 */
    checkedValue?: boolean | string | number;
    /** 加载状态 */
    loading?: boolean;
    /** 未选中时显示的文本 */
    unCheckedChildren?: string | Slot;
    /** 未选中值 */
    unCheckedValue?: boolean | string | number;
    /** 改变事件 */
    change?: (checked: boolean | string | number, event: Event) => void;
    /** 点击事件 */
    click?: (checked: boolean | string | number, event: Event) => void;
    /** 大小 */
    size?: 'small' | 'default' | 'large';
}
