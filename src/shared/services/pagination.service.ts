/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';

export interface PaginatedMeta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}
export interface PaginatedResult<T> {
  data: T[];
  meta: PaginatedMeta;
}

export type PaginateOptions = {
  page?: number | string;
  perPage?: number | string;
};

export type PaginateFunction = <T, K>(
  model: any,
  args?: K,
  options?: PaginateOptions,
) => Promise<PaginatedResult<T>>;

@Injectable()
export class PaginationService {
  private readonly defaultOptions: PaginateOptions = { perPage: 10 };

  /**
   * Paginate Prisma query results
   * Provides consistent pagination across all models
   * @param model - Prisma model delegate (e.g., prisma.user)
   * @param args - Prisma query args (where, orderBy, include, etc.)
   * @param options - Pagination options (page, perPage)
   * @returns Paginated results with metadata
   */
  paginate: PaginateFunction = async (
    model,
    args: any = { where: undefined },
    options,
  ) => {
    const page = Number(options?.page || this.defaultOptions?.page) || 1;
    const perPage =
      Number(options?.perPage || this.defaultOptions?.perPage) || 10;

    const skip = page > 0 ? perPage * (page - 1) : 0;
    const [total, data] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        take: perPage,
        skip: skip,
      }),
    ]);
    const lastPage = Math.ceil(total / perPage);

    return {
      data,
      meta: {
        total,
        totalPages: lastPage,
        lastPage,
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    };
  };
}
