export interface ModelProps {
  title: string;
  name: string;
  pageName: string;
  key: number;
}

export interface ModelState {
  modelList: ModelProps[];
  nowModel: ModelProps;
}
