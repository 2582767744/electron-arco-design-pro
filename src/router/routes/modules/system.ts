import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SYSTEM: AppRouteRecordRaw = {
  path: '/system',
  name: 'system',
  component: DEFAULT_LAYOUT,
  meta: {
    model: 'system',
    locale: 'menu.system',
    requiresAuth: true,
    icon: 'icon-settings',
    order: 2,
    redirect: 'Dept',
    isModel: true,
  },
  children: [
    {
      path: 'dept',
      name: 'Dept',
      component: () => import('@/views/system/index.vue'),
      meta: {
        model: 'system',
        locale: 'menu.deptManager',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default SYSTEM;
