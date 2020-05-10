import { createAction, props } from '@ngrx/store';
import { ConfigState } from '../reducers/config.reducer';

export const updateConfig = createAction('[Config] Update configuration', props<{ config: Partial<ConfigState> }>());
