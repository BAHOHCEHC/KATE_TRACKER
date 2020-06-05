import { AuthActions, AuthActionTypes } from './../actions/auth.action';
import { User } from 'src/app/shared/interfaces';

export interface AuthState {
    user: User | null;
}
const initialState: AuthState = {
    user: null,
}

export const authReducer: (state: AuthState, action: AuthActions) => AuthState = (
    state = initialState,
    action: AuthActions) => {
    switch (action.type) {
        case AuthActionTypes.LOG_IN:
            return { ...state, user: action.payload };
        case AuthActionTypes.REGISTER:
            return { ...state, user: action.payload };
        case AuthActionTypes.LOG_OUT:
            return { ...state, user: null };
        default: return state;
    }
}