<script lang="ts" setup>
import {
  SfAccordionItem,
  SfButton,
  SfCheckbox,
  SfChip,
  SfIconChevronLeft,
  SfListItem,
  SfRadio,
  SfSelect,
  SfThumbnail,
} from "@storefront-ui/vue";

import { useCategorySideFilters } from "@/domains/category-side-filters/composables/useCategorySideFilters";

// Props
const emit = defineEmits(["close"]);
const props = defineProps({
  attributes: {
    type: Array,
    required: true,
  },
  categories: {
    type: Object,
    required: true,
  },
});

// Import the composable with filters and category logic
const {
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
} = useCategorySideFilters(props.attributes, props.categories);

const route = useRoute();

// UI Helper methods
const { changeFilters, facetsFromUrlToFilter } = useUiHelpers();

// Initialize selected filters from URL
selectedFilters.value = facetsFromUrlToFilter();

// Apply filters handler
const handleApplyFilters = () => {
  applyFilters(changeFilters);
  emit("close");
};

// Clear filters handler
const handleClearFilters = () => {
  clearFilters();
  emit("close");
};
</script>

<template>
  <aside class="w-full lg:max-w-[376px]">
    <!-- Categories Section -->
    <template v-if="categories.length">
      <div
        class="py-2 px-4 mb-4 bg-neutral-100 typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest md:rounded-md"
        data-testid="category-tree"
      >
        {{ $t("category") }}
      </div>
      <ul class="mt-4 mb-6 md:mt-2" data-testid="categories">
        <SfListItem
          v-for="(category, index) in categories"
          :key="category.name"
          size="lg"
          :class="{
            'bg-primary-100 hover:bg-primary-100 active:bg-primary-100 font-medium':
              category.id === route.query.id,
          }"
          @click="changeCategory(category.id)"
        >
          <span class="text-base md:text-sm capitalize font-bold">{{
            category.name
          }}</span>
        </SfListItem>
      </ul>
    </template>

    <!-- Sort By Section -->
    <h5
      class="py-2 px-4 mb-6 bg-neutral-100 typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest md:rounded-md"
    >
      Sort by
    </h5>
    <SfSelect
      v-model="sortBy.selected"
      placeholder="Select sorting"
      aria-label="$t('sortBy')"
      @update:model-value="changeSorting"
    >
      <option
        v-for="{ id, value, attrName } in sortBy.options"
        :key="id"
        :selected="sortBy.selected === value"
        :value="value"
      >
        {{ attrName }}
      </option>
    </SfSelect>

    <!-- Filter Section -->
    <h5
      class="py-2 px-4 mt-6 mb-4 bg-neutral-100 typography-headline-6 font-bold text-neutral-900 uppercase tracking-widest md:rounded-md"
    >
      Filter
    </h5>
    <ul>
      <!-- Render facets dynamically from the composable -->
      <li v-for="facet in facets" :key="facet.label">
        <SfAccordionItem v-model="opened[facet.label]">
          <template #summary>
            <div class="flex justify-between items-center p-2 mb-2">
              <p class="p-2 font-medium">{{ facet?.label }}</p>
              <SfIconChevronLeft
                :class="opened[facet.label] ? 'rotate-90' : '-rotate-90'"
              />
            </div>
          </template>

          <!-- Price Filter -->
          <template v-if="facet.type == 'price'">
            <fieldset id="radio-price">
              <SfListItem
                v-for="option in facet.options"
                :key="option.id"
                tag="label"
              >
                <template #prefix>
                  <SfRadio
                    v-model="priceModel"
                    class="flex items-center"
                    :name="facet.label"
                    :value="option.values"
                    :class="{
                      'bg-primary-700 border-primary-700 hover:bg-primary-800':
                        priceModel === option.values,
                    }"
                  />
                </template>
                <span
                  class="text-sm mr-2"
                  :class="{
                    'font-medium': priceModel === option.values,
                  }"
                  >{{ option.label }}</span
                >
              </SfListItem>
            </fieldset>
          </template>

          <!-- Select Filter -->
          <template v-if="facet.type === 'select'">
            <ul class="grid grid-cols-5 gap-2 px-3">
              <li v-for="option in facet.options" :key="option.id">
                <SfChip
                  class="w-full"
                  size="sm"
                  :input-props="{ value: option.value }"
                  :model-value="isFilterSelected(option)"
                  @update:model-value="selectFilter(facet, option)"
                >
                  {{ option.label }}
                </SfChip>
              </li>
            </ul>
          </template>

          <!-- Radio Filter -->
          <template v-if="facet.type === 'radio'">
            <ul class="grid grid-cols-3 gap-2 px-3">
              <li v-for="option in facet.options" :key="option.id">
                <SfChip
                  class="w-full"
                  size="sm"
                  :input-props="{ value: option.value }"
                  :model-value="isFilterSelected(option)"
                  @update:model-value="selectFilter(facet, option)"
                >
                  {{ option.label }}
                </SfChip>
              </li>
            </ul>
          </template>

          <!-- Color Filter -->
          <template v-if="facet.type === 'color'">
            <SfListItem
              v-for="option in facet.options"
              :key="option.id"
              size="sm"
              tag="label"
              :class="[
                'px-4 bg-transparent hover:bg-transparent',
                { 'font-medium': isFilterSelected(option) },
              ]"
              :selected="isFilterSelected(option)"
            >
              <template #prefix>
                <SfCheckbox
                  :value="option.label"
                  class="appearance-none peer hidden"
                  :model-value="isFilterSelected(option)"
                  @update:model-value="selectFilter(facet, option)"
                />
                <span
                  class="inline-flex items-center justify-center p-1 transition duration-300 rounded-full cursor-pointer ring-1 ring-neutral-200 ring-inset outline-offset-2 outline-secondary-600 peer-checked:ring-2 peer-checked:ring-primary-700 peer-hover:bg-primary-100 peer-[&:not(:checked):hover]:ring-primary-200 peer-active:bg-primary-200 peer-active:ring-primary-300 peer-disabled:cursor-not-allowed peer-disabled:bg-disabled-100 peer-disabled:opacity-50 peer-disabled:ring-1 peer-disabled:ring-disabled-200 peer-disabled:hover:ring-disabled-200 peer-checked:hover:ring-primary-700 peer-checked:active:ring-primary-700 peer-focus-visible:outline"
                >
                  <SfThumbnail
                    size="sm"
                    :style="{ backgroundColor: option.htmlColor }"
                  />
                </span>
              </template>
              <span class="mr-2 typography-text-sm">{{ option.label }}</span>
            </SfListItem>
          </template>
        </SfAccordionItem>
        <hr class="my-4" />
      </li>
    </ul>

    <!-- Apply and Clear Buttons -->
    <div
      class="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 lg:justify-between px-3 lg:px-0"
    >
      <SfButton
        variant="secondary"
        class="w-full mr-3"
        @click="handleClearFilters"
        >{{ $t("clearFilters") }}</SfButton
      >
      <SfButton class="w-full" @click="handleApplyFilters">{{
        $t("showProducts")
      }}</SfButton>
    </div>
  </aside>
</template>
