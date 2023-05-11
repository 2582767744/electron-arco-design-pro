<template>
  <a-dropdown
    trigger="contextMenu"
    :popup-max-height="false"
    @select="actionSelect"
  >
    <span
      class="arco-tag arco-tag-size-medium arco-tag-checked"
      :class="{ 'link-activated': itemData.name === $route.meta.model && itemData.key == nowModel.key }"
      @click="gotoModel(itemData)"
      style="-webkit-app-region: no-drag"
    >
      <span class="tag-link">
        {{ $t(itemData.title) }}
      </span>
      <span
        class="arco-icon-hover arco-tag-icon-hover arco-icon-hover-size-medium arco-tag-close-btn"
        @click.stop="modelClose(itemData, index)"
        v-if="index !== 0"
      >
        <icon-close />
      </span>
    </span>
    <template #content>
      <a-doption :disabled="disabledReload" :value="Eaction.reload">
        <icon-refresh />
        <span>重新加载</span>
      </a-doption>
      <a-doption
        class="sperate-line"
        :disabled="disabledCurrent"
        :value="Eaction.current"
      >
        <icon-close />
        <span>关闭当前标签页</span>
      </a-doption>
      <a-doption :disabled="disabledLeft" :value="Eaction.left">
        <icon-to-left />
        <span>关闭左侧标签页</span>
      </a-doption>
      <a-doption
        class="sperate-line"
        :disabled="disabledRight"
        :value="Eaction.right"
      >
        <icon-to-right />
        <span>关闭右侧标签页</span>
      </a-doption>
      <a-doption :value="Eaction.others">
        <icon-swap />
        <span>关闭其它标签页</span>
      </a-doption>
      <a-doption :value="Eaction.all">
        <icon-folder-delete />
        <span>关闭全部标签页</span>
      </a-doption>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
  import { PropType, computed, defineEmits } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useTabBarStore, useModelStore } from '@/store';
  import type { TagProps } from '@/store/modules/tab-bar/types';
  import type { ModelProps } from '@/store/modules/model-tag/types';
  import { DEFAULT_ROUTE_NAME, REDIRECT_ROUTE_NAME } from '@/router/constants';

  // eslint-disable-next-line no-shadow
  enum Eaction {
    reload = 'reload',
    current = 'current',
    left = 'left',
    right = 'right',
    others = 'others',
    all = 'all',
  }

  const props = defineProps({
    itemData: {
      type: Object as PropType<ModelProps>,
      default() {
        return [];
      },
    },
    index: {
      type: Number,
      default: 0,
    },
  });
  const emit = defineEmits(['tagClick'])
  const modelTagStore = useModelStore();
  const router = useRouter();
  const route = useRoute();
  const tabBarStore = useTabBarStore();

  const gotoModel = (model:ModelProps)=>{
      console.log("model切换",model)
      console.log("tagList",tabBarStore.getTabList)
      modelTagStore.updateNowModel(model)
      const key = model.name + model.key
      router.push({ 
        name: model.pageName,
        query:{
          modelId: key
        }
      });
      emit('tagClick',model.name+model.key)
  };

  const goto = (tag: TagProps) => {
    console.log("tabBarStore",tabBarStore.cacheTabList)
    router.push({ ...tag });
  };

  const tagList = computed(() => {
    return tabBarStore.getTabList;
  });

  const modelList = computed(() => {
    return modelTagStore.getModelList;
  });

  const nowModel = computed(() => {
    return modelTagStore.getNowModel;
  });
  
  const disabledReload = computed(() => {
    // return props.itemData.fullPath !== route.fullPath;
    return false
  });

  const disabledCurrent = computed(() => {
    return props.index === 0;
  });

  const disabledLeft = computed(() => {
    return [0, 1].includes(props.index);
  });

  const disabledRight = computed(() => {
    return props.index === tagList.value.length - 1;
  });

  const modelClose = (tag: ModelProps, idx: number) => {
    const key = tag.name + tag.key
    
    tagList.value.forEach((item,index) =>{
      if(item.modelName === key){
        tabBarStore.deleteTag(index, item);
      }
    })
    if(tag.name === route.meta.model){
      const latest = modelList.value[idx - 1]// 获取队列的前一个tab
      const latestKey = latest.name+latest.key
      modelTagStore.updateNowModel(latest)
      router.push({ 
        name: latest?.pageName,
        query:{
          modelId: latestKey
        }
      });
      emit('tagClick',latestKey)
    }
    modelTagStore.deleteModel(tag)
    console.log("关闭tagList=",tagList.value)
  }

  const tagClose = (tag: TagProps, idx: number) => {
    tabBarStore.deleteTag(idx, tag);
    // if (props.itemData.fullPath === route.fullPath) {
    //   const latest = tagList.value[idx - 1]; // 获取队列的前一个tab
    //   router.push({ name: latest.name });
    // }
  };

  const findCurrentRouteIndex = () => {
    return tagList.value.findIndex((el) => el.fullPath === route.fullPath);
  };
  const actionSelect = async (value: any) => {
    const { itemData, index } = props;
    const copyTagList = [...tagList.value];
    if (value === Eaction.current) {
      // tagClose(itemData, index);
    } else if (value === Eaction.left) {
      const currentRouteIdx = findCurrentRouteIndex();
      copyTagList.splice(1, props.index - 1);

      tabBarStore.freshTabList(copyTagList);
      if (currentRouteIdx < index) {
        router.push({ name: itemData.name });
      }
    } else if (value === Eaction.right) {
      const currentRouteIdx = findCurrentRouteIndex();
      copyTagList.splice(props.index + 1);

      tabBarStore.freshTabList(copyTagList);
      if (currentRouteIdx > index) {
        router.push({ name: itemData.name });
      }
    } else if (value === Eaction.others) {
      const filterList = tagList.value.filter((el, idx) => {
        return idx === 0 || idx === props.index;
      });
      tabBarStore.freshTabList(filterList);
      router.push({ name: itemData.name });
    } else if (value === Eaction.reload) {
      // tabBarStore.deleteCache(itemData);
      await router.push({
        name: REDIRECT_ROUTE_NAME,
        params: {
          path: route.fullPath,
        },
      });
      tabBarStore.addCache(itemData.name);
    } else {
      tabBarStore.resetTabList();
      router.push({ name: DEFAULT_ROUTE_NAME });
    }
  };
</script>

<style scoped lang="less">
  .tag-link {
    color: var(--color-text-2);
    text-decoration: none;
  }

  .link-activated {
    color: rgb(var(--link-6));

    .tag-link {
      color: rgb(var(--link-6));
    }

    & + .arco-tag-close-btn {
      color: rgb(var(--link-6));
    }
  }

  :deep(.arco-dropdown-option-content) {
    span {
      margin-left: 10px;
    }
  }

  .arco-dropdown-open {
    .tag-link {
      color: rgb(var(--danger-6));
    }

    .arco-tag-close-btn {
      color: rgb(var(--danger-6));
    }
  }

  .sperate-line {
    border-bottom: 1px solid var(--color-neutral-3);
  }

  .arco-tag-size-medium{
    height: 100% !important;
  }

  .arco-tag-checked{
    background-color:#fff0 !important;
  }
</style>
