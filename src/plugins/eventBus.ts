import mitt from 'mitt';
import DitchCardApi from '@/api/channel/index';
type Events = {
    login: string;
    logout: void;
    onChangeSDitchCard: PromiseReturnType<typeof DitchCardApi.fetchDitchCardChoose>[0];
};

const emitter = mitt<Events>();
export default emitter;
