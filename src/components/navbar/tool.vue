<template>
    <div class="navbar">
        <ul class="left" style="-webkit-app-region: no-drag">
            <li>
                <a-tooltip :content="$t('settings.add')">
                    <a-button class="nav-btn" type="outline" :shape="'circle'">
                        <template #icon>
                            <IconPlus />
                        </template>
                    </a-button>
                </a-tooltip>
            </li>
        </ul>
        <ul class="right-side" style="-webkit-app-region: no-drag">
            <li>
                <a-tooltip :content="$t('settings.search')">
                    <a-button class="nav-btn" type="outline" :shape="'circle'">
                        <template #icon>
                            <icon-search />
                        </template>
                    </a-button>
                </a-tooltip>
            </li>
            <li>
                <a-tooltip :content="$t('settings.language')">
                    <a-button class="nav-btn" type="outline" :shape="'circle'" @click="setDropDownVisible">
                        <template #icon>
                            <icon-language />
                        </template>
                    </a-button>
                </a-tooltip>
                <a-dropdown trigger="click" @select="changeLocale as any">
                    <div ref="triggerBtn" class="trigger-btn"></div>
                    <template #content>
                        <a-doption v-for="item in locales" :key="item.value" :value="item.value">
                            <template #icon>
                                <icon-check v-show="item.value === currentLocale" />
                            </template>
                            {{ item.label }}
                        </a-doption>
                    </template>
                </a-dropdown>
            </li>
            <li>
                <a-tooltip :content="theme === 'light'
                    ? $t('settings.navbar.theme.toDark')
                    : $t('settings.navbar.theme.toLight')
                    ">
                    <a-button class="nav-btn" type="outline" :shape="'circle'" @click="handleToggleTheme">
                        <template #icon>
                            <icon-moon-fill v-if="theme === 'dark'" />
                            <icon-sun-fill v-else />
                        </template>
                    </a-button>
                </a-tooltip>
            </li>
            <li>
                <a-tooltip :content="$t('settings.navbar.alerts')">
                    <div class="message-box-trigger">
                        <a-badge :count="9" dot>
                            <a-button class="nav-btn" type="outline" :shape="'circle'" @click="setPopoverVisible">
                                <icon-notification />
                            </a-button>
                        </a-badge>
                    </div>
                </a-tooltip>
                <a-popover trigger="click" :arrow-style="{ display: 'none' }"
                    :content-style="{ padding: 0, minWidth: '400px' }" content-class="message-popover">
                    <div ref="refBtn" class="ref-btn"></div>
                    <template #content>
                        <message-box />
                    </template>
                </a-popover>
            </li>
            <!-- <li>
                <a-tooltip :content="$t('settings.title')">
                    <a-button class="nav-btn" type="outline" :shape="'circle'" @click="setVisible">
                        <template #icon>
                            <icon-settings />
                        </template>
                    </a-button>
                </a-tooltip>
            </li> -->
            <li>
                <a-dropdown trigger="click">
                    <a-avatar :size="32" :style="{ marginRight: '8px', cursor: 'pointer' }">
                        <img alt="avatar" :src="avatar" />
                    </a-avatar>
                    <template #content>
                        <a-doption>
                            <a-space @click="switchRoles">
                                <icon-tag />
                                <span>
                                    {{ $t('messageBox.switchRoles') }}
                                </span>
                            </a-space>
                        </a-doption>
                        <a-doption>
                            <a-space @click="$router.push({ name: 'Info' })">
                                <icon-user />
                                <span>
                                    {{ $t('messageBox.userCenter') }}
                                </span>
                            </a-space>
                        </a-doption>
                        <a-doption>
                            <a-space @click="$router.push({ name: 'Setting' })">
                                <icon-settings />
                                <span>
                                    {{ $t('messageBox.userSettings') }}
                                </span>
                            </a-space>
                        </a-doption>
                        <a-doption>
                            <a-space @click="handleLogout">
                                <icon-export />
                                <span>
                                    {{ $t('messageBox.logout') }}
                                </span>
                            </a-space>
                        </a-doption>
                    </template>
                </a-dropdown>
            </li>
        </ul>
    </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { useDark, useToggle, useFullscreen } from '@vueuse/core';
import { useAppStore, useUserStore } from '@/store';
import { LOCALE_OPTIONS } from '@/locale';
import useLocale from '@/hooks/locale';
import useUser from '@/hooks/user';
import MessageBox from '../message-box/index.vue';


const appStore = useAppStore();
const userStore = useUserStore();
const { logout } = useUser();
const { changeLocale, currentLocale } = useLocale();
const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();
const locales = [...LOCALE_OPTIONS];
const avatar = computed(() => {
    return userStore.avatar;
});
const theme = computed(() => {
    return appStore.theme;
});
const isDark = useDark({
    selector: 'body',
    attribute: 'arco-theme',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: 'arco-theme',
    onChanged(dark: boolean) {
        // overridden default behavior
        appStore.toggleTheme(dark);
    },
});
const toggleTheme = useToggle(isDark);
const handleToggleTheme = () => {
    toggleTheme();
};
const setVisible = () => {
    appStore.updateSettings({ globalSettings: true });
};
const refBtn = ref();
const triggerBtn = ref();
const setPopoverVisible = () => {
    const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    });
    refBtn.value.dispatchEvent(event);
};
const handleLogout = () => {
    logout();
};
const setDropDownVisible = () => {
    const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    });
    triggerBtn.value.dispatchEvent(event);
};
const switchRoles = async () => {
    const res = await userStore.switchRoles();
    Message.success(res as string);
};
</script>

<style lang="less" scoped>
.navbar {
    position: fixed;
    z-index: 5;
    display: flex;
    justify-content: space-between;
    float: left;
    width: calc(100% - 220px);
    height: 45px;
    overflow-y: auto;
    line-height: 42px;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
}

.right-side {
    display: flex;
    justify-content: flex-end;
    width: 100%;
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

.left{
    display: flex;
    justify-content: flex-start;
    width: 100%;
    padding-left: 20px;
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