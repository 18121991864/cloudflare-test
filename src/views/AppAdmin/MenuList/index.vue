<template>
    <div class="table-container">
        <div class="configuration-box">
            <div
                v-for="item in configList"
                :key="item.id"
                class="configuration-item"
                :class="activeIndex == item.id ? 'active' : ''"
                @click="handelActive(item.id)"
            >
                {{ item.name }}
            </div>
        </div>
        <MenuLists :active-index="activeIndex"/>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MenuLists from './components/MenuLists.vue';

const activeIndex = ref(1);
const configList = [
    { id: 1, name: '更多菜单配置' },
    { id: 2, name: '信用卡菜单配置' },
];
const handelActive = (id: number) => {
    activeIndex.value = id;
};
</script>

<style lang="scss" scoped>
.configuration-box {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .configuration-item {
        font-size: 18px;
        color: #a3a1a1;
        font-weight: 550;
        cursor: pointer;

        &:nth-child(1) {
            display: flex;
            align-items: center;

            &::after {
                content: '';
                display: block;
                width: 2px;
                height: 18px;
                background-color: #000;

                margin: 0 10px;
            }
        }

        &.active {
            color: #000;
        }
    }
}
</style>
