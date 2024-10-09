// useCategorySideFilters.ts
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

type Filter = {
  filterName: string;
  label: string;
  id: string;
};

export function useCategorySideFilters(attributes: any[], categories: any[]) {
  const route = useRoute();
  const router = useRouter();

  // States
  const selectedFilters = ref<Filter[]>([]);
  const priceModel = ref<string>("");
  const sort = ref(route.query?.sort || "");
  const opened = ref<Record<string, boolean>>({
    Price: true,
  });

  // Handle sorting
  const sortBy = computed(() =>
    getSortOptions({ input: { sort: sort.value } })
  );

  const changeSorting = async (newSort: string) => {
    sort.value = newSort;
  };

  const getSortOptions = (searchData: { input: any }) => ({
    options: sortOptions,
    selected: searchData.input.sort || "name asc",
  });

  // Define facets including the price filter and attributes
  const facets = computed(() => [
    {
      id: null,
      label: "Price",
      type: "price",
      options: [
        { id: "pr1", label: "Under $250.00", values: "0-250" },
        { id: "pr2", label: "$250.00 - $500.00", values: "250-500" },
        { id: "pr3", label: "$500.00 - $750.00", values: "500-750" },
        { id: "pr4", label: "$750.00 - $1000.00", values: "750-1000" },
        { id: "pr5", label: "$1000.00 - $1500.00", values: "1000-1500" },
      ],
    },
    ...attributes,
  ]);

  // Handle filters
  const isFilterSelected = (option: { id: string }) => {
    return selectedFilters.value.some((filter) => filter.id === option.id);
  };

  const selectFilter = (
    facet: { label: string },
    option: { id: string; value: string; label: string }
  ) => {
    const alreadySelectedIndex = selectedFilters.value.findIndex(
      (filter: Filter) => filter.label === option.id
    );

    if (alreadySelectedIndex !== -1) {
      selectedFilters.value.splice(alreadySelectedIndex, 1);
    } else {
      selectedFilters.value.push({
        filterName: facet.label,
        label: option.id,
        id: option.value,
      });
    }
  };

  const applyFilters = (
    changeFilters: (filters: Filter[], sort: string) => void
  ) => {
    const filters = selectedFilters.value.filter(
      (item) => typeof item === "object"
    );

    // Certifique-se de que `sort` está sendo passado no formato correto
    changeFilters(filters, sort.value as string);
  };

  const clearFilters = () => {
    priceModel.value = "";
    selectedFilters.value = [];
    router.push({ query: {} });
  };

  const changeCategory = (categoryId: number) => {
    clearFilters();
    router.push({ path: `/category/${categoryId}` });
  };

  // Watch facets and selected filters to update opened state
  watch(
    () => [facets.value, selectedFilters.value],
    () => {
      facets.value.forEach((facet: any) => {
        opened.value[facet.label] = selectedFilters.value.some(
          (item: any) => item.filterName === facet.label
        );
      });
      opened.value.Price = true;
    },
    { deep: true }
  );

  // Price filter logic
  const priceFilter = computed(() =>
    selectedFilters.value.find((item) => item.filterName === "price")
  );

  if (priceFilter.value) {
    priceModel.value = priceFilter.value.id;
  }

  watch(priceModel, (newValue) => {
    selectedFilters.value = selectedFilters.value.filter(
      (item) => item.filterName !== "price"
    );
    if (newValue) {
      selectedFilters.value.push({
        filterName: "price",
        id: newValue,
        label: `Price: ${newValue}`, // Exemplo de label para o filtro de preço
      });
    }
  });

  return {
    selectedFilters,
    priceModel,
    sortBy,
    changeSorting,
    applyFilters,
    clearFilters,
    changeCategory,
    selectFilter,
    isFilterSelected,
    opened,
    facets,
  };
}
