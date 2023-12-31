export type IPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: 'asc' | 'desc' | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
  maxPrice?: number | undefined;
  minPrice?: number | undefined;
};
