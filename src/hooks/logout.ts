import useEncryptionStore from '@/store/encryption';
import useSideBarStore from '@/store/sideBar';
import useTagView from '@/store/tagsView';
import cookies from 'cookies-js';
export default () => {
    const cleaerUserInfo = useEncryptionStore().cleaerUserInfo;
    const clearRoutes = useSideBarStore().clearRoutes;
    const clearVisitedView = useTagView().clearVisitedView;
    cleaerUserInfo();
    clearRoutes();
    clearVisitedView();
    cookies.expire('walletToken');
};
