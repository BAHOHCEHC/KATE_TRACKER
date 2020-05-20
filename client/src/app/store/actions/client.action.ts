import { Client } from './../../shared/interfaces';
import { Action } from '@ngrx/store';

export enum ClientActionTypes {
    GET_CLIENT = '[CLIENT] Getting client',
    ADD_CLIENT = '[CLIENT] Add client',
    GET_USER_CLIENTS = '[CLIENT] Get all clients',
    REMOVE_CLIENT = '[CLIENT] Remove client',
}

export class GetCurrentClient implements Action {
    readonly type = ClientActionTypes.GET_CLIENT;
    constructor(public payload: Client) { }
}
export class AddClient implements Action {
    readonly type = ClientActionTypes.ADD_CLIENT;
    constructor(public payload: Client) { }
}

export class GetAllClientOfUser implements Action {
    readonly type = ClientActionTypes.GET_USER_CLIENTS;
    constructor(public payload: Client[]) { }
}

export class RemoveClient implements Action {
    readonly type = ClientActionTypes.REMOVE_CLIENT;
    constructor(public payload: Client) { }
}

export type ClientActions = GetCurrentClient | GetAllClientOfUser | RemoveClient | AddClient;