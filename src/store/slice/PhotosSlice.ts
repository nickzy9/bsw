import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {requestAPI, ApiResponse, ApiError} from '../../services/network';
import {API_PATHS} from '../../constants/APIPaths';
import {API_PARAM_KEYS} from '../../constants/APIParamsKey';
import {APP_CONSTANTS} from '../../constants/AppConstants';
import {PhotoModel} from '../../model';
import {LogLevel, log} from '../../utils/AppLogger';

interface PhotoState {
  data: PhotoModel[];
  loading: boolean;
  error?: string;
  isLastPageReached: boolean;
  isAllPhotos: boolean;
}

const initialState: PhotoState = {
  data: [],
  loading: false,
  error: undefined,
  isLastPageReached: false,
  isAllPhotos: false,
};

interface FetchPhotoPayload {
  start: number;
  albumID: number;
}

export const fetchPhotos = createAsyncThunk(
  'photos/fetchphotos',
  async ({start, albumID}: FetchPhotoPayload) => {
    const params: {[key: string]: any} = {
      [API_PARAM_KEYS.START]: start,
      [API_PARAM_KEYS.LIMIT]: APP_CONSTANTS.DATALIMIT,
    };
    if (albumID > 0) {
      params[API_PARAM_KEYS.ALBUM_ID] = albumID;
    }

    const response: ApiResponse<PhotoModel[]> = await requestAPI<PhotoModel[]>(
      API_PATHS.PHOTO,
      'GET',
      params,
    );

    if (response.success) {
      return response.data;
    }
    throw response.error?.message;
  },
);

const photosSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    clearData: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPhotos.pending, (state, action) => {
        state.loading = true;
        state.error = undefined;
        // Update istate for isAllPhotos based on albumID
        state.isAllPhotos = action.meta.arg.albumID === -1;
      })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        if ((action.payload?.length ?? 0) < APP_CONSTANTS.DATALIMIT) {
          state.isLastPageReached = true;
          log('fetchphotos reach last page', LogLevel.Info);
        } else {
          state.isLastPageReached = false;
        }
        if (action.payload) {
          if (action.meta.arg.start == 0) {
            state.data = action.payload;
          } else {
            state.data = [...state.data, ...action.payload];
          }
        }
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {clearData} = photosSlice.actions;
export default photosSlice.reducer;
