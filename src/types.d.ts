// 提供类型声明
import '@vue/runtime-core';
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        buttonPermissions: (permission: string, spa?: boolean) => boolean;
        buttonPermissionsRoute: (pageRoute: string) => boolean;
        $filters: {
            dataThousands: (value: string) => string;
        };
        permissionShow: (permission: string) => boolean;
    }
}
