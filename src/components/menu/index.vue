<script lang="tsx">
import { defineComponent, ref, h, compile, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter, RouteRecordRaw } from 'vue-router';
import type { RouteMeta } from 'vue-router';
import { cloneDeep } from 'lodash';
import { useAppStore, useModelStore } from '@/store';
import { listenerRouteChange } from '@/utils/route-listener';
import { openWindow, regexUrl } from '@/utils';
import useMenuTree from './use-menu-tree';

export default defineComponent({
  emit: ['collapse'],
  setup() {
    const { t } = useI18n();
    const appStore = useAppStore();
    const router = useRouter();
    const route = useRoute();
    const { menuTree } = useMenuTree();
    const collapsed = computed({
      get() {
        if (appStore.device === 'desktop') return appStore.menuCollapse;
        return false;
      },
      set(value: boolean) {
        appStore.updateSettings({ menuCollapse: value });
      },
    });

    const topMenu = computed(() => appStore.topMenu);
    const openKeys = ref<string[]>([]);
    const selectedKey = ref<string[]>([]);
    // 菜单初始化
    const nowTree = ref<RouteRecordRaw[]>([])
    const userModel = ref('')
    const modelTagStore = useModelStore();

    // 初始化菜单
    const initMenu = () => {
      nowTree.value = []
      menuTree.value.forEach((el: RouteRecordRaw) => {
        const newMenu = cloneDeep(el) as RouteRecordRaw;
        if (el.name !== 'dashboard') {
          newMenu.children = []
        }
        nowTree.value.push(newMenu)
      })
      userModel.value = 'dashboard';
    }

    // 切换模块
    const cutModel = (fullPath: any, meta: any) => {
      const { model } = meta;
      console.log("userModel=", userModel)
      // 使用同个模块,不进行切换
      if (userModel.value === model) {
        return
      }
      userModel.value = model
      if (fullPath.indexOf('/dashboard') === -1) {
        // console.log("切换模块", isModel,path)
        nowTree.value = []
        menuTree.value.forEach((el: RouteRecordRaw) => {
          if (el.name === model) {
            nowTree.value.push(el)
          }
        })
      }
      else if (fullPath.indexOf('/dashboard') !== -1) {
        initMenu()
      }
    }

    const goto = (item: RouteRecordRaw) => {
      // Open external link
      if (regexUrl.test(item.path)) {
        openWindow(item.path);
        selectedKey.value = [item.name as string];
        return;
      }
      // Eliminate external link side effects
      const { hideInMenu, activeMenu, isModel, redirect, model} = item.meta as RouteMeta;
      if (route.name === item.name && !hideInMenu && !activeMenu) {
        selectedKey.value = [item.name as string];
        return;
      }
      if (isModel) {
        const key = ( model as string )+ new Date().getTime()
        router.push({
          name: redirect as string,
          query: {
            modelId: key
          }
        });
        return
      }
      // Trigger router change
      const key = modelTagStore.getNowModel.name + modelTagStore.getNowModel.key
      router.push({
        name: item.name,
        query: {
          modelId: key
        }
      });
    };

    const findMenuOpenKeys = (target: string) => {
      const result: string[] = [];
      let isFind = false;
      const backtrack = (item: RouteRecordRaw, keys: string[]) => {
        if (item.name === target) {
          isFind = true;
          result.push(...keys);
          return;
        }
        if (item.children?.length) {
          item.children.forEach((el) => {
            backtrack(el, [...keys, el.name as string]);
          });
        }
      };
      menuTree.value.forEach((el: RouteRecordRaw) => {
        if (isFind) return; // Performance optimization
        backtrack(el, [el.name as string]);
      });
      return result;
    };
    listenerRouteChange((newRoute) => {
      console.log("newRoute=", newRoute)
      const { requiresAuth, activeMenu, hideInMenu } = newRoute.meta;
      cutModel(newRoute.fullPath, newRoute.meta)
      console.log("nowTree=", nowTree)
      if (requiresAuth && (!hideInMenu || activeMenu)) {
        const menuOpenKeys = findMenuOpenKeys(
          (activeMenu || newRoute.name) as string
        );

        const keySet = new Set([...menuOpenKeys, ...openKeys.value]);
        openKeys.value = [...keySet];

        selectedKey.value = [
          activeMenu || menuOpenKeys[menuOpenKeys.length - 1],
        ];
      }
    }, true);
    const setCollapse = (val: boolean) => {
      if (appStore.device === 'desktop')
        appStore.updateSettings({ menuCollapse: val });
    };

    const renderSubMenu = () => {
      function travel(_route: RouteRecordRaw[], nodes = []) {
        if (_route) {
          _route.forEach((element) => {
            // This is demo, modify nodes as needed
            const icon = element?.meta?.icon
              ? () => h(compile(`<${element?.meta?.icon}/>`))
              : null;
            const node =
              element?.children && element?.children.length !== 0 ? (
                <a-sub-menu

                  key={element?.name}
                  v-slots={{
                    icon,
                    title: () => h(compile(t(element?.meta?.locale || ''))),
                  }}
                  style="-webkit-app-region: no-drag"
                >
                  {travel(element?.children)}
                </a-sub-menu>
              ) : (
                <a-menu-item
                  key={element?.name}
                  v-slots={{ icon }}
                  onClick={() => goto(element)}
                  style="-webkit-app-region: no-drag"
                >
                  {t(element?.meta?.locale || '')}
                </a-menu-item>
              );
            nodes.push(node as never);
          });
        }
        return nodes;
      }
      return travel(nowTree.value);
    };

    return () => (
      <a-menu
        mode={topMenu.value ? 'horizontal' : 'vertical'}
        v-model:collapsed={collapsed.value}
        v-model:open-keys={openKeys.value}
        show-collapse-button={appStore.device !== 'mobile'}
        auto-open={false}
        selected-keys={selectedKey.value}
        auto-open-selected={true}
        level-indent={34}
        style="height: 100%;width:100%;"
        onCollapse={setCollapse}
      >
        {renderSubMenu()}
      </a-menu>
    );
  },
});
</script>

<style lang="less" scoped>
:deep(.arco-menu-inner) {
  .arco-menu-inline-header {
    display: flex;
    align-items: center;
  }

  .arco-icon {
    &:not(.arco-icon-down) {
      font-size: 18px;
    }
  }
}
</style>
