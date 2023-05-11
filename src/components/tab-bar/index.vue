<template>
  <div class="tab-bar-container">
    <a-affix ref="affixRef" :offset-top="10">
      <div class="tab-bar-box">
        <div class="tab-bar-scroll">
          <div class="tags-wrap">
            <tab-item v-for="(tag, index) in modelList" :key="tag.key" :index="index" :item-data="tag"/>
          </div>
        </div>
        <div class="tag-bar-operation"></div>
      </div>
    </a-affix>
  </div>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash';
import { ref, computed, watch, onUnmounted } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';
import {
  listenerRouteChange,
  removeRouteListener,
} from '@/utils/route-listener';
import { useAppStore, useTabBarStore, useModelStore } from '@/store';
import tabItem from './tab-item.vue';

const appStore = useAppStore();
const tabBarStore = useTabBarStore();
const modelTagStore = useModelStore();

const affixRef = ref();
const tagList = computed(() => {
  return tabBarStore.getTabList;
});
// 模块列表
const modelList = computed(() => {
  return modelTagStore.getModelList
});
const offsetTop = computed(() => {
  return appStore.navbar ? 60 : 0;
});

watch(
  () => appStore.navbar,
  () => {
    affixRef.value.updatePosition();
  }
);
listenerRouteChange((route: RouteLocationNormalized) => {
  let key = route.query.modelId as string
  if (!key) {
    key = 'dashboard1'
  }
  console.log('oldkey', key)
  if (!modelTagStore.findModelKey(key)) {
    // 标识 是否创建新标签
    modelTagStore.updateModelList(route)
    console.log("modelList", modelList.value)
    key = modelTagStore.getNowModel.name + modelTagStore.getNowModel.key
    console.log('newkey', key)
  }
  modelTagStore.updatePage(route)
  if (
    !route.meta.noAffix &&
    !tagList.value.some((tag) => tag.fullPath === route.fullPath && tag.modelName === key)
  ) {
    const copyroute = cloneDeep(route)
    console.log("新建")
    copyroute.meta.model = key
    tabBarStore.updateTabList(copyroute);
  }
}, true);

onUnmounted(() => {
  removeRouteListener();
});
</script>

<style scoped lang="less">
.tab-bar-container {
  position: relative;
  background-color: var(--color-bg-2);

  .tab-bar-box {
    display: flex;
    padding: 0 0 0 20px;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);

    .tab-bar-scroll {
      flex: 1;
      height: 50px;
      overflow: hidden;

      .tags-wrap {
        height: 60px;
        padding: 4px 0;
        overflow-x: auto;
        white-space: nowrap;

        :deep(.arco-tag) {
          display: inline-flex;
          align-items: center;
          margin-right: 6px;
          cursor: pointer;

          &:first-child {
            .arco-tag-close-btn {
              display: none;
            }
          }
        }
      }
    }
  }

  .tag-bar-operation {
    width: 100px;
    height: 50px;
  }
}
</style>
