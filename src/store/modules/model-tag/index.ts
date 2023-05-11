import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { cloneDeep, update } from 'lodash';
import { ModelProps, ModelState } from './types';

const formatTag = (route: RouteLocationNormalized): ModelProps => {
  const { name, meta, matched } = route;
  const { meta: model } = matched[0];
  return {
    title: model.locale || '',
    name: String(meta.model),
    pageName: name as string,
    key: new Date().getTime(),
  };
};
const DEFAULT_MODEL: ModelProps = {
  title: 'menu.dashboard',
  name: 'dashboard',
  pageName: 'Workplace',
  key: 1,
};

const useAppStore = defineStore('modeltag', {
  state: (): ModelState => ({
    modelList: [DEFAULT_MODEL],
    nowModel: DEFAULT_MODEL,
  }),

  getters: {
    getModelList(): ModelProps[] {
      return this.modelList;
    },
    findModel() {
      return (name: string) =>
        this.modelList.find((item) => item.name === name);
    },
    // 获取正在使用模块
    getNowModel(): ModelProps {
      return this.nowModel;
    },
    findModelKey() {
      return (key: string) =>
        this.modelList.find((item) => item.name + item.key === key);
    },
  },

  actions: {
    // 更新模块列表
    updateModelList(route: RouteLocationNormalized) {
      const model = formatTag(route);
      this.modelList.push(model);
      this.nowModel = model;
    },
    // 更新最新使用模块
    updateNowModel(model: ModelProps) {
      this.nowModel = model;
    },
    // 关闭模块
    deleteModel(model: ModelProps) {
      const index = this.modelList.findIndex((item) => item.key === model.key);
      this.modelList.splice(index, 1);
    },
    // 更新最新使用页面
    updatePage(route: RouteLocationNormalized) {
      const { name } = route;
      const oldModel = this.modelList.find(
        (item) => item.key === this.nowModel.key
      );
      if (oldModel) {
        oldModel.pageName = name as string;
      }
    },
  },
});

export default useAppStore;
