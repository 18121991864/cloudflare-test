import _ from 'lodash';
import { ConstructionFrom } from '../../interface';

export default () => {
    // 初始化config
    const configFrom = ref<ConstructionFrom>({
        construction: [],
        constrClassName: 'wrap-box',
        // @ts-ignore
        btns: {
            queryBtns: {
                handelSubmit: () => {
                    return new Promise((resolve) => {
                        // @ts-ignore
                        resolve({});
                    });
                },
            },
            //
            exportBtns: {
                show: true,
                handExport: () => {
                    return new Promise((resolve) => {
                        // @ts-ignore
                        resolve({});
                    });
                },
                exportFileTitle: '导出',
                buttonPermissions: '',
            },
            addBtns: {
                show: true,
                fieldNames: [],
                titleName: '新增',
                updateInterface: () => {
                    return new Promise((resolve) => {
                        // @ts-ignore
                        resolve({});
                    });
                },
            },
            editBtns: {
                show: true,
                fieldNames: [],
                titleName: '编辑',
                updateInterface: () => {
                    return new Promise((resolve) => {
                        // @ts-ignore
                        resolve({});
                    });
                },
            },
        },

        tabelConfig: {
            headers: [],
            scroll: {
                x: 1100,
            },
            headersCustom: [],
        },
        formState: {},
    });
    const deepConfigFrom = ref(_.cloneDeep(configFrom.value));
    return {
        configFrom,
        deepConfigFrom,
    };
};
