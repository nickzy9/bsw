import axios, {AxiosResponse} from 'axios';
import {requestAPI} from '..';
import {UserModel} from '../../../model';
import {API_PATHS} from '../../../constants/APIPaths';
import {API_PARAM_KEYS} from '../../../constants/APIParamsKey';

describe('requestAPI', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful response', async () => {
    const result = await requestAPI<UserModel[]>('/users', 'GET');

    expect(result.success).toEqual(true);
  });

  it('should handle server error', async () => {
    const result = await requestAPI<UserModel[]>('/testet', 'GET');
    expect(result).toEqual({
      success: false,
      error: {
        code: 'GENERIC_ERROR',
        message: 'Oops! Something went wrong',
      },
    });
  });
});
