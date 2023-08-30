import { SortOrder } from 'mongoose';

type IOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  maxPrice?: number | undefined;
  minPrice?: number | undefined;
};

type IOpitonsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: SortOrder;
  maxPrice?: number | undefined;
  minPrice?: number | undefined;
};

const calculatePagination = (options: IOptions): IOpitonsResult => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder || 'desc';
  const minPrice = Number(options.minPrice) || 1000;
  const maxPrice = Number(options.maxPrice) || 100000;
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    maxPrice,
    minPrice,
  };
};

export const paginationHelper = {
  calculatePagination,
};
