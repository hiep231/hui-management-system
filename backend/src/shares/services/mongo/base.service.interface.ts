export interface IPageResponse {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
  totalRecords: number;
}

export interface ITimeResponse {
  timeTaken: number;
  currentTime: number;
}

export interface ISearchResponse<T> {
  response: T[];
  page?: IPageResponse;
  time?: ITimeResponse;
}

export interface IMappingObjectResponse<T> {
  [id: string]: IMappingObject<T>
}

export interface IMappingObject<T> {
  [id: string]: T;
}

export interface IServiceResponse<T> {
  success: boolean;
  response: T;
  message: string;
  statusCode: number;
  page?: IPageResponse;
  time?: ITimeResponse;
}

