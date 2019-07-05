export interface User {
  email: string;
  password: string;
}

export interface Category {
  name: string;
  imageSrc?: string;
  user?: string;
  _id?: string;
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
export interface Position {
  name: string;
  cost: number;
  quantity?: number;
  user?: string;
  category: string;
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
// export interface AnalyticsChartItem {
//   label: string;
//   order: number;
//   gain: number;
// }
// export interface AnalyticsPage {
//   average: number;
//   chart: AnalyticsChartItem[];
// }
