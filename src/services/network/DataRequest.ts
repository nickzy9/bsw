import axios, {AxiosResponse, AxiosRequestConfig} from 'axios';
import config from '../../config';
import {ErrorCode} from './ErrorCodes';
import {LogLevel, log} from '../../utils/AppLogger';
import {ApiResponse} from './ApiResponse';

const api = axios.create({
  baseURL: config.baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const requestAPI = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  params?: {[key: string]: any},
): Promise<ApiResponse<T>> => {
  const handleServerError = () => {
    log(`[Server Error] ${requestConfig.url}`, LogLevel.Error);
    return {
      success: false,
      error: {
        code: ErrorCode.GenericError,
        message: 'Oops! Something went wrong',
      },
    };
  };

  const handleInvalidJson = () => {
    log(`[Invalid JSON] ${requestConfig.url}`, LogLevel.Error);
    return {
      success: false,
      error: {code: ErrorCode.InvalidJson, message: 'Invalid Data received.'},
    };
  };

  const requestConfig: AxiosRequestConfig = {
    method,
    url: config.baseURL + endpoint,
    params: params,
    timeout: 800,
  };

  try {
    log(`[Requesting] ${requestConfig.url}`, LogLevel.Info);
    const response: AxiosResponse<T> = await api.request<T>(requestConfig);
    return {success: true, data: response.data};
  } catch (error) {
    if (error) {
      log (`[ERROR] ${error}`);
      return handleServerError();
    } else {
      return handleInvalidJson();
    }
  }
};
