/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AttributeValue, Product, ProductTemplateListResponse, QueryProductsArgs } from '~/graphql';
import { QueryName } from '~/server/queries';

export const useProductTemplate = (categoryId: string) => {
  const { $sdk } = useNuxtApp();

  const loading = ref(false);
  const productTemplateList = useState<Product[]>(`products-category${categoryId}`, () => ([]));
  const attributes = useState<AttributeValue[]>(`attributes${categoryId}`, () => ([]));

  const loadProductTemplateList = async (params: QueryProductsArgs) => {
    loading.value = true;
    const { data } = await $sdk().odoo.query<QueryProductsArgs, ProductTemplateListResponse>({queryName: QueryName.GetProductTemplateList }, params);
    loading.value = false;

    productTemplateList.value = data.value.products?.products || [];
    attributes.value = data.value.products?.attributeValues || [];
  };

  const organizedAttributes = computed(() => {
    if (!productTemplateList.value) return [];

    const data: any = [];

    attributes.value?.forEach((item: any) => {
      const current = data.find(
        (itemData: { attributeName: any }) =>
          itemData.attributeName === item.attribute?.name
      );

      if (!current) {
        data.push({
          id: String(item.attribute.id),
          label: item.attribute?.name,
          attributeName: item.attribute?.name,
          type: item.displayType,
          count: 0,
          options: [],
        });
      }

      data
        .find(
          (itemData: { attributeName: any }) =>
            itemData.attributeName === item.attribute?.name
        )
        .options.push({
          id: String(item.search),
          value: item.id,
          label: item.name,
          metadata: item.search,
          htmlColor: item.htmlColor,
        });
    });

    return data;
  });

  return {
    loading,
    loadProductTemplateList,
    productTemplateList,
    organizedAttributes
  };
};
