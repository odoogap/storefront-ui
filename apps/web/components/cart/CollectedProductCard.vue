<script setup lang="ts">
import { SfLink, SfIconSell } from '@storefront-ui/vue';

interface Attribute {
  label: string;
  name: string;
  value: string;
}

type CartProductCardProps = {
  attributes: Attribute[];
  imageUrl?: string | null;
  imageAlt?: string | null;
  maxValue: number;
  minValue: number;
  name: string;
  price: string;
  specialPrice: string;
  value: number;
  slug: string;
};

defineProps<CartProductCardProps>();
const NuxtLink = resolveComponent('NuxtLink');
</script>

<template>
  <div
    class="relative flex first:border-t border-b-[1px] border-neutral-200 hover:shadow-lg min-w-[320px] p-4 last:mb-0"
    data-testid="cart-product-card"
  >
    <div class="relative overflow-hidden rounded-md w-[100px] sm:w-[176px]">
      <SfLink :tag="NuxtLink" to="/product/1">
        <NuxtImg
          class="w-full h-auto border rounded-md border-neutral-200"
          :src="$getImage(String(imageUrl), 370, 370, String(imageAlt))"
          :alt="imageAlt ?? ''"
          width="300"
          height="300"
          loading="lazy"
          format="webp"
        />
      </SfLink>
      <div
        class="absolute top-0 left-0 text-white bg-secondary-600 py-1 pl-1.5 pr-2 text-xs font-medium"
      >
        <SfIconSell size="xs" class="mr-1" />
        {{ $t('sale') }}
      </div>
    </div>
    <div class="flex flex-col pl-4 min-w-[180px] flex-1">
      <SfLink
        :tag="NuxtLink"
        to="/product/1"
        variant="secondary"
        class="no-underline typography-text-sm sm:typography-text-lg"
      >
        {{ name }}
      </SfLink>
      <div class="my-2 sm:mb-0">
        <ul
          class="text-xs font-normal leading-5 sm:typography-text-sm text-neutral-700"
        >
          <li v-for="attribute in attributes" :key="attribute.name">
            <span class="mr-1">{{ attribute.name }}:</span>
            <span class="font-medium">{{ attribute.label }}</span>
          </li>
        </ul>
      </div>
      <div
        class="items-start sm:items-center sm:mt-auto flex flex-col sm:flex-row"
      >
        <span
          v-if="specialPrice"
          class="text-secondary-700 sm:order-1 font-bold typography-text-sm sm:typography-text-lg sm:ml-auto"
        >
          ${{ specialPrice }}
          <span
            class="text-neutral-500 ml-2 line-through typography-text-xs sm:typography-text-sm font-normal"
          >
            ${{ price }}
          </span>
        </span>
        <span
          v-else
          class="font-bold sm:ml-auto sm:order-1 typography-text-sm sm:typography-text-lg"
        >
          ${{ price }}
        </span>
        <UiQuantitySelector
          :min-value="minValue"
          :max-value="maxValue"
          class="mt-4 sm:mt-0"
        />
      </div>
    </div>
  </div>
</template>
