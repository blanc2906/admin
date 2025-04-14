export class YoolifeResponseDto<T> {
  result: {
    message: string;
    success: boolean;
    error?: boolean;
    data?: T;
    totalRecords?: number;
    resultCode?: string;
  };
  targetUrl: null;
  success: true;
  error: null;
  unAuthorizedRequest: false;
  __abp: true;
}
