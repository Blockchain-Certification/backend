export interface Pagination {
  page: number;
  limit: number;
}
export interface PaginationSearch extends Pagination {
  keyword: string;
}
