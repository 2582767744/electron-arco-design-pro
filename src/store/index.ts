import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import useModelStore from './modules/model-tag';

const pinia = createPinia();

export { useAppStore, useUserStore, useTabBarStore, useModelStore };
export default pinia;
