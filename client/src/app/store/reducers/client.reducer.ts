import { Client } from './../../shared/interfaces';
import { ClientActions, ClientActionTypes } from '../actions/client.action';


export interface ClientState {
    currentClient: Client;
    allClients: Client[];
}
const initialState: ClientState = {
    currentClient: null,
    allClients: []
}

export const clientReducer: (state: any, action: ClientActions) => ClientState = (
    state = initialState,
    action: ClientActions) => {
    switch (action.type) {
        case ClientActionTypes.GET_CLIENT:
            return { ...state, currentClient: action.payload };
        case ClientActionTypes.ADD_CLIENT:
            return { ...state, allClients: [...state.allClients, action.payload] };
        case ClientActionTypes.GET_USER_CLIENTS:
            return { ...state, allClients: action.payload };
        case ClientActionTypes.REMOVE_CLIENT:
            return { ...state, allClients: [...state.allClients.filter(c => c._id !== action.payload._id)] };
        default: return state;
    }
}