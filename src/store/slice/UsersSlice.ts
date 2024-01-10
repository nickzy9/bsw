import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {requestAPI, ApiResponse} from '../../services/network';
import {API_PATHS} from '../../constants/APIPaths';
import {API_PARAM_KEYS} from '../../constants/APIParamsKey';
import {APP_CONSTANTS} from '../../constants/AppConstants';
import {UserModel} from '../../model';
import {LogLevel, log} from '../../utils/AppLogger';

interface UsersState {
  data: UserModel[];
  loading: boolean;
  error?: string;
  isLastPageReached: boolean;
}

const initialState: UsersState = {
  data: [],
  loading: false,
  error: undefined,
  isLastPageReached: false,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (start: number) => {
    const params: {[key: string]: any} = {
      [API_PARAM_KEYS.START]: start,
      [API_PARAM_KEYS.LIMIT]: APP_CONSTANTS.DATALIMIT,
    };
    const response: ApiResponse<UserModel[]> = await requestAPI<UserModel[]>(
      API_PATHS.USERS,
      'GET',
      params,
    );
    if (response.success) {
      return response.data;
    }
    throw response.error?.message;
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        if ((action.payload?.length ?? 0) < APP_CONSTANTS.DATALIMIT) {
          state.isLastPageReached = true;
          log('fetchuser reach last page', LogLevel.Info);
        } else {
          state.isLastPageReached = false;
        }
        if (action.payload) {
          state.data = [...state.data, ...action.payload];
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;
