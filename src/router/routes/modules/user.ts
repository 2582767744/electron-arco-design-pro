import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USER: AppRouteRecordRaw = {
  path: '/user',
  name: 'user',
  component: DEFAULT_LAYOUT,
  meta: {
    model: 'user',
    locale: 'menu.userManage',
    requiresAuth: true,
    icon: 'icon-user',
    order: 1,
    redirect: 'UserList1',
    isModel: true,
  },
  children: [
    {
      path: 'userList',
      name: 'UserList',
      component: '',
      meta: {
        model: 'user',
        locale: 'menu.userList',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: 'userList1',
          name: 'UserList1',
          component: () => import('@/views/user/index.vue'),
          meta: {
            model: 'user',
            locale: 'menu.userList',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },
    {
      path: 'role',
      name: 'Role',
      component: () => import('@/views/user/role/index.vue'),
      meta: {
        model: 'user',
        locale: 'menu.role',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default USER;
