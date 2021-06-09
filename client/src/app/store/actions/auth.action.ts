import { User, Client } from './../../shared/interfaces';
import { Action } from '@ngrx/store';

export enum AuthActionTypes {
    LOG_IN = '[AUTH] Login',
    LOG_OUT = '[AUTH] LogOut',
    REGISTER = '[AUTH] Register'
}

export class LogIn implements Action {
    readonly type = AuthActionTypes.LOG_IN;
    constructor(public payload: User) { }
}

export class LogOut implements Action {
    readonly type = AuthActionTypes.LOG_OUT;
    constructor(public payload: User) { }
}

export class Register implements Action {
    readonly type = AuthActionTypes.REGISTER;
    constructor(public payload: User) { }
}

export type AuthActions = LogIn | LogOut | Register;
