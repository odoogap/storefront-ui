import { H3Error } from 'h3';
import { AttributeValue, Categories, Category, Product, Products } from './gql/graphql';
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

export type ProductTemplateListResponse = _AsyncData<
  {
    products:{
      attributeValues: AttributeValue[];
      maxPrice?: number;
      minPrice?: number;
      totalCount: number;
      products: Product[]
    }
  },
  H3Error
>;
