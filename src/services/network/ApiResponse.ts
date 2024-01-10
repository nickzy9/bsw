import {ErrorCode} from '.';

export interface ApiError {
  code: ErrorCode;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}