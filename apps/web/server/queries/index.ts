import LoadUserQuery from './LoadUserQuery';
import ProductVariantQuery from './ProductVariantQuery';
import StockLotsQuery from './StockLotsQuery';
import GetCategories from './GetCategories';
import GetCategory from './GetCategory';
import { DocumentNode } from '@apollo/client';

enum QueryName {
  ProductVariantQuery = 'ProductVariantQuery',
  LoadUserQuery = 'LoadUserQuery',
  StockLotsQuery = 'StockLotsQuery',
  GetCategories = 'GetCategories',
  GetCategory = 'GetCategory',
}

const Queries: Record<QueryName, DocumentNode> = {
  ProductVariantQuery,
  LoadUserQuery,
  StockLotsQuery,
  GetCategories,
  GetCategory
};

export { Queries, QueryName };
