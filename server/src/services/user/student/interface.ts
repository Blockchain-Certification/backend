export interface pagination {
  page: number;
  limit: number;
}
export interface PaginationSearch extends pagination {
  keyword: string;
}
