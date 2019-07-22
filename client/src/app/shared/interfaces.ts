export interface User {
  email: string;
  password: string;
  imageSrc?: string;
  role: string;
  nickName: string;
  token?: string;
  _id?: string;
}

export interface Category {
  name: string;
  user?: string;
  imageSrc?: string;
  _id?: string;
}
export interface Clients {
  name: string;
  imageSrc?: string;
  user?: string;
  tarif?: number;
  totalHours?: string;
  totalPayment?: number;
  taskList?: Task[];
  _id?: string;
}

export interface Task {
  name: string;
  cost: number;
  client: string;
  startTime?: Date;
  endTime?: Date;
  wastedTime?: number;
  totalMoney?: number;
  user?: string;
  formatTime?: string;
  _id?: string;
  startDay:string;
}
export interface Message {
  message: string;
}
export interface Order {
  date?: Date;
  order?: string;
  user?: string;
  list: any[];
  _id?: string;
}

export interface OrderPosition {
  name: string;
  cost: number;
  quantity: number;
  _id?: any;
}
export interface Filter {
  start?: Date;
  end: Date;
  order?: number;
}
export interface OverviewPage {
  orders: OverviewPageItem;
  gain: OverviewPageItem;
}
export interface OverviewPageItem {
  percent: number;
  compare: number;
  yesterday: number;
  isHighter: boolean;
}
