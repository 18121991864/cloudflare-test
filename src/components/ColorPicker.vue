<script setup lang="ts">
import { storeToRefs } from 'pinia';
import theme from '@/store/theme';

const store = theme();
const { themeState } = storeToRefs(store);

</script>

<template>
  <a-tooltip title="主题色" placement="left">
    <a-popover>
      <template #title></template>
      <template #content>
        <div class="is-flex flex-direction-row color-item" @click.stop="store.onChangeTheme()">
          <p class="color-block orange"></p>
          #ff6900
        </div>
        <div class="is-flex flex-direction-row color-item" @click.stop="store.onChangeTheme(false)">
          <p class="color-block blue"></p>
          #1890ff
        </div>
      </template>
      <div class="color-block" :style="{ background: themeState.token.colorPrimary }"></div>
    </a-popover>
  </a-tooltip>
</template>

<style scoped lang="scss">
.color-block {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  margin-right: 10px;

  &.blue {
    background: #1890ff;
  }

  &.orange {
    background: #ff6900;
  }
}

.color-item {
  cursor: pointer;
  margin-top: 10px;
}
</style>
