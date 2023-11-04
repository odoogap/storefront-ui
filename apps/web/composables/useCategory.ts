/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { QueryCategoriesArgs, QueryCategoryArgs, CategoryListResponse, Category, CategoryResponse } from '~/graphql';
import { QueryName } from '~/server/queries';

export const useCategory = (categorySlug?: string) => {
  const { $sdk } = useNuxtApp();

  const loading = ref(false);
  const categories = useState<Category[]>('categories', () => ([]));
  const category = useState<Category>(`category-${categorySlug}`, () => ({} as Category));

  const loadCategory = async (params: QueryCategoryArgs) => {
    const { data } = await $sdk().odoo.query<QueryCategoryArgs, CategoryResponse >({queryName: QueryName.GetCategory}, params);

    category.value = data.value.category;
  };

  const loadCategoryList = async (params: QueryCategoriesArgs) => {
    const { data, error } = await $sdk().odoo.query<QueryCategoriesArgs, CategoryListResponse >({queryName: QueryName.GetCategories}, params);

    categories.value = data.value.categories?.categories;
  };

  const buildTree = (categories: any) => {
    if (!categories) {
      return [];
    }
    return categories.map(
      (category: { name: string; slug: string; childs: any; id: string }) => ({
        label: category.name,
        slug: category.slug,
        items: buildTree(category.childs),
        isCurrent: false,
        id: category.id,
      })
    );
  };

  const getCategoryTree = (searchData: { data: { category: any } }) => {
    if (!searchData) {
      return { items: [], label: '', isCurrent: false };
    }

    const category: any = searchData;
    if (category) {
      return {
        label: category.name,
        slug: category.slug,
        items: buildTree(category.childs),
        isCurrent: false,
        id: category.id,
      };
    }
    return {};
  };

  return {
    loading,
    categories,
    category,
    loadCategoryList,
    loadCategory,
    getCategoryTree,
  };
};
