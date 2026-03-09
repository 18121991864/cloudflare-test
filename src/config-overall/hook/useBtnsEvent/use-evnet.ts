import { ConstructionFrom } from '@/config-overall/interface';
import { message } from 'ant-design-vue';
import nProgress from 'nprogress';

export default () => {
    const ShotButton = ref(false);
    const handelUpdateShot = (configFrom: ConstructionFrom) => {
        ShotButton.value = true;
        nProgress.start();
        const handelSetShotBtns = configFrom.btns.setshotBtns?.handelSetShotBtns;
        if (!handelSetShotBtns) {
            ShotButton.value = false;
            nProgress.done();
            return false;
        }
        handelSetShotBtns({})
            .then(() => {
                message.success('生成快照成功');
            })
            .finally(() => {
                ShotButton.value = false;
                nProgress.done();
            });
    };
    return {
        handelUpdateShot,
        ShotButton,
    };
};
