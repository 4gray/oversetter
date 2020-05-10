import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import * as fromConfig from '../reducers/config.reducer';

export interface State {
    config: fromConfig.ConfigState;
}

export const reducers: ActionReducerMap<State> = {
    config: fromConfig.reducer,
};

export const getConfigState = createFeatureSelector<State, fromConfig.ConfigState>('config');
export const getConfig = createSelector(getConfigState, fromConfig.selectConfig);

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
    return function(state: State, action: any): State {
        console.log('state', state);
        console.log('action', action);
        return reducer(state, action);
    };
}

export function storageSyncMetaReducer(reducer: ActionReducer<State>): ActionReducer<State> {
    let onInit = true;
    return function(state: State, action: any): State {
        if (onInit) {
            onInit = false;
        } else {
            localStorage.setItem(fromConfig.CONFIG_STORAGE_KEY, JSON.stringify({ ...state.config, ...action.config }));
        }
        return reducer(state, action);
    };
}

export const metaReducers: MetaReducer<State>[] = !environment.production
    ? [logger, storageSyncMetaReducer]
    : [storageSyncMetaReducer];
