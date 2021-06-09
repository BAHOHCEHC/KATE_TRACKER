import { AuthActions, AuthActionTypes } from './../actions/auth.action';
import { User } from 'src/app/shared/interfaces';

export interface AuthState {
    user: User | null;
}
const initialState: AuthState = {
    user: null,
};

export function authReducer(state: AuthState = initialState, action: AuthActions): AuthState {
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
