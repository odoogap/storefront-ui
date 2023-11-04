import { H3Error } from 'h3';
import { Categories, Category } from './gql/graphql';
import { _AsyncData } from 'nuxt/dist/app/composables/asyncData';

export type CategoryListResponse = _AsyncData<
  {
    categories: {
      categories: Category[];
      totalCount: number;
    }
  },
  H3Error
>;

export type CategoryResponse = _AsyncData<
  {
    category: Category
  },
  H3Error
>;
