<template>
  <div class="navbar">
    <div class="center-side">
      <!-- <Menu v-if="topMenu" /> -->
      <!-- <TabBar /> -->
      <ChromeTags/>
    </div>
    <ul class="right-side" style="-webkit-app-region: no-drag">
      <li>
        <a-tooltip :content="$t('settings.min')">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="windowMin">
            <template #icon>
              <icon-minus />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="isFullscreen
          ? $t('settings.navbar.screen.toExit')
          : $t('settings.navbar.screen.toFull')
          ">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="toggleFullScreen">
            <template #icon>
              <icon-fullscreen-exit v-if="isFullscreen" />
              <icon-fullscreen v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="$t('settings.close')">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="close">
            <template #icon>
              <icon-close />
            </template>
          </a-button>
        </a-tooltip>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core';
import TabBar from '@/components/tab-bar/index.vue';
import ChromeTags from '@/components/tab-bar/chromeTags.vue'

const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();

const close = () => {
  window.versions.loginQuit()
}

const windowMin = ()=>{
  window.versions.windowMin()
}
</script>

<style scoped lang="less">
.navbar {
  display: flex;
  justify-content: space-between;
  height: 100%;
  background-color: #f7f8fa;
  // border-bottom: 1px solid var(--color-border);
}

.left-side {
  display: flex;
  align-items: center;
  width: 220px;
  padding-left: 20px;
}

.center-side {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 50%;
  height: 100%;
}

.right-side {
  display: flex;
  padding-right: 20px;
  list-style: none;

  :deep(.locale-select) {
    border-radius: 20px;
  }

  li {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  a {
    color: var(--color-text-1);
    text-decoration: none;
  }

  .nav-btn {
    color: rgb(var(--gray-8));
    font-size: 16px;
    border-color: rgb(var(--gray-2));
  }

  .trigger-btn,
  .ref-btn {
    position: absolute;
    bottom: 14px;
  }

  .trigger-btn {
    margin-left: 14px;
  }
}
</style>

<style lang="less">
.message-popover {
  .arco-popover-content {
    margin-top: 0;
  }
}
</style>
