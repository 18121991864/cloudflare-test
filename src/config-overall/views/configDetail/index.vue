<template>
    <div class="top-content">
        <a-button type="primary" @click="handelCancel" :icon="h(LeftOutlined)">返回</a-button>
        <div class="title">{{ route.meta.title }}</div>
    </div>
    <a-spin :spinning="spinning">
        <div class="label-box">
            <div class="right">
                <template v-for="(item, index) in labelList" :key="index">
                    <div v-if="allcustomSlots.includes(item.value) && showLable(item)">
                        <slot name="allSlots" :data="{ ...formState }" :value="item.value"></slot>
                    </div>
                    <div v-else>
                        <div v-if="item.isAssort && !item.show" class="bold-title" :class="[item.bold ? 'font-semibold' : '']">{{ item.label }}</div>
                        <div v-else-if="item.isLine" class="line"></div>
                        <div v-else-if="showLable(item)" class="label-list">
                            <div class="label">{{ item.label }}</div>
                            <div v-if="customSlots.includes(item.value)" class="value">
                                <slot name="infoSlot" :data="{ ...formState }" :value="item.value"></slot>
                            </div>
                            <div class="value" v-else-if="formState[item.value]">{{ formState[item.value] }}</div>
                            <div class="value" v-else-if="formState[item.value] === 0">0</div>
                            <div class="value" v-else>--</div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div class="flex justify-center mt-10">
            <a-button type="primary" @click="handelCancel" :icon="h(LeftOutlined)">返回</a-button>
            <slot name="footer" :data="{ ...formState }"> </slot>
        </div>
    </a-spin>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import useDetailStore from '../store/detailStore';
import { LeftOutlined } from '@ant-design/icons-vue';
import useTagsView from '@/store/tagsView';
const storeTagsView = useTagsView();
const detailStore = useDetailStore();
const route = useRoute();
const routeName = route.name;
const { labelList, formState, spinning, customSlots, allcustomSlots } = toRefs(detailStore);
const open = ref(false);
const emits = defineEmits(['deactiMount']);
onDeactivated(() => {
    console.log('onDeactivated');

    handelCancel();
    open.value = false;
    emits('deactiMount');
});
onUnmounted(() => {
    console.log('onUnmounted');

    handelCancel();
    open.value = false;
    emits('deactiMount');
});
const router = useRouter();
const handelCancel = () => {
    if (open.value) return false;
    storeTagsView.deleteVisitedViewByName(routeName as string, storeTagsView.isAdd);
    open.value = true;
};
const showLable = computed(() => {
    return (item: any) => {
        if (!item.show) return true;
        if (item.show) {
            if (formState.value[item.value] === 0) return '0';
            return formState.value[item.value];
        }
    };
});
</script>

<style lang="scss" scoped>
.top-content {
    display: grid;
    grid-template-columns: 80px 1fr;
    align-items: center;
}
.title {
    font-weight: 550;
    text-align: center;
    font-size: 20px;
}
.label-list {
    display: grid;
    font-size: 15px;
    grid-template-columns: 200px 200px 1fr 10vw;
    grid-template-areas: 'l-left .. l-right ..';
    .label {
        grid-area: l-left;
        color: #696969;
        margin-bottom: 10px;
    }
    .value {
        grid-area: l-right;
        justify-self: end;
        transform: translateX(-50px);
    }
}
.label-box {
    display: grid;
    grid-template-columns: 10vw 1fr;
    grid-template-areas: '.. right';
    .right {
        grid-area: right;
        .bold-title {
            margin: 20px 0 15px 0;
            font-size: 18px;
        }
    }
}

.line {
    position: relative;
    width: 86%;
    height: 1px;
    left: -8px;
    background-color: #99999985;
    margin: 10px 0;
}
</style>
