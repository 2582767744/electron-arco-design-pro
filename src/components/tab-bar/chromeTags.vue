<template>
    <div class="tabs">
        <ul class="tabrow" style="-webkit-app-region: no-drag">
            <li v-for="(tag, index) in modelList" :key="tag.key" @click="click(tag.name+tag.key)"
                :class="{ 'selected': nowKey === (tag.name+tag.key), 'only-tag' : modelList.length === 1 } ">
                <tabItem :key="tag.key" :index="index" :item-data="tag" @tag-click="(key:string)=>click(key)"/>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash';
import { ref, computed, watch, onUnmounted} from 'vue'
import { useAppStore, useTabBarStore, useModelStore } from '@/store';
import type { RouteLocationNormalized } from 'vue-router';
import {
  listenerRouteChange,
  removeRouteListener,
} from '@/utils/route-listener';
import tabItem from './tab-item.vue';

const appStore = useAppStore();
const tabBarStore = useTabBarStore();
const modelTagStore = useModelStore();

const affixRef = ref();
const nowKey = ref('dashboard1')
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
    nowKey.value = key
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

const click = (key: string) => {
    nowKey.value = key
    console.log('e=', key)
    console.log('nowKey.value=', nowKey.value)
}

</script>

<style  scoped>
.tabs {
    position: absolute;
    bottom: 0;
    left: 10px;
    display: flex;
    align-items: center;
    height: 70%;
}

.tabrow {
    position: relative;
    height: 26px;
    height: 100%;

    /* margin: 0px 0 20px; */
    padding: 0;
    overflow: hidden;
    font-size: 12px;
    font-family: verdana;
    line-height: 24px;
    text-align: center;
    list-style: none;
}

.tabrow li {
    position: relative;
    z-index: 0;

    /* background: -ms-linear-gradient(top, #ECECEC 50%, #D1D1D1 100%);
    background: -moz-linear-gradient(top, #ECECEC 50%, #D1D1D1 100%);
    background: -webkit-linear-gradient(top, #ECECEC 50%, #D1D1D1 100%);
    background: linear-gradient(top, #ECECEC 50%, #D1D1D1 100%); */
    display: inline-block;
    height: 100%;
    margin: 0 -5px;
    padding: 0 20px;

    /* box-shadow: 0 3px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 #FFF; */
    text-shadow: 0 1px #FFF;

    /* border: 1px solid #AAA; */

    /* background: #D1D1D1; */
    background: #f7f8fa;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;

}

.tabrow a {
    color: #555;
    text-decoration: none;
}

.tabrow li.selected {
    z-index: 2;
    color: #333;
    background: #FFF;

    /* border-bottom-color: #FFF; */
}

.tabrow::before {
    position: absolute;
    bottom: 0;
    left: 0;

    /* border-bottom: 1px solid #AAA; */
    z-index: 1;
    width: 100%;
    content: " ";
}

.tabrow li::before,
.tabrow li::after {
    /* border: 1px solid #AAA; */
    position: absolute;
    bottom: 0;
    width: 5px;
    height: 10px;
    content: " ";
}

.tabrow li::before {
    left: -6px;
    border-width: 0 1px 1px 0;
    border-bottom-right-radius: 6px;

    /* box-shadow: 2px 2px 0 #D1D1D1; */
}

.tabrow li::after {
    right: -6px;
    border-width: 0 0 1px 1px;
    border-bottom-left-radius: 6px;

    /* box-shadow: -2px 2px 0 #D1D1D1; */
}

.tabrow li:hover{
    background: #d7d8da;

    /* z-index: 4; */
}

.tabrow li.selected::before {
    box-shadow: 2px 2px 0 #FFF;
}

.tabrow li.selected::after {
    box-shadow: -2px 2px 0 #FFF;
}

.tabrow .only-tag{
    /* background-color: var(--color-fill-2) !important; */
}
</style>



