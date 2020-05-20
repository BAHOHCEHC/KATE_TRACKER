export interface User {
  email: string;
  password: string;
  role: string;
  nickName: string;
  imageSrc?: string;
  token?: string;
  _id?: string;
}
export interface Client {
  name: string;
  imageSrc?: string;
  user?: string;
  tarif?: number;
  totalHours?: number;
  totalPayment?: number;
  taskList?: Task[];
  _id?: string;
}

export interface Task {
  name: string;
  cost?: number;
  clientName?: string;
  clientId?: string;
  startTime?: Date;
  endTime?: Date;
  startDay?: string;
  wastedTime?: number;
  totalMoney?: number;
  user?: string;
  formatTime?: string;
  _id?: string;
}
export interface Message {
  message: string;
}
