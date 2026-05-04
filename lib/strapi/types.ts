export type StrapiEntity<T> = T & {
  id?: number;
  documentId?: string;
  attributes?: T;
};

export type StrapiCollectionResponse<T> = {
  data?: Array<StrapiEntity<T>>;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type StrapiSingleResponse<T> = {
  data?: StrapiEntity<T> | null;
  meta?: Record<string, unknown>;
};

export type StrapiErrorResponse = {
  error?: {
    status?: number;
    name?: string;
    message?: string;
    details?: unknown;
  };
};

export type StrapiFetchOptions = {
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  token?: string;
};
