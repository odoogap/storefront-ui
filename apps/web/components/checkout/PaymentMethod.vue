<template>
  <div data-testid="checkout-payment" class="md:px-4 py-6">
    <fieldset>
      <legend class="text-neutral-900 text-lg font-bold mb-4">
        {{ $t("checkoutPayment.heading") }}
      </legend>
      <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
        <label
          v-for="method in paymentMethods"
          :key="method.id"
          class="relative"
        >
          <input
            type="radio"
            name="payment_method"
            class="peer sr-only"
            :value="method.id"
            :checked="method.id === activePayment"
            @change="$emit('update:activePayment', method.id)"
          />
          <span
            class="h-20 flex flex-col items-center justify-center py-4 px-4 cursor-pointer rounded-md border border-neutral-200 -outline-offset-2 hover:border-primary-200 hover:bg-primary-100 peer-focus:border-primary-200 peer-focus:bg-primary-100 active:border-primary-300 active:bg-primary-200 peer-checked:outline peer-checked:outline-2 peer-checked:outline-primary-700 peer-disabled:opacity-50 peer-disabled:bg-neutral-100 peer-disabled:border-neutral-200 peer-disabled:cursor-not-allowed peer-disabled:[&_img]:grayscale"
          >
            <!-- <span>
              <SfIconCreditCard class="mr-2" />
              <span class="font-medium">{{
                $t('checkoutPayment.creditCard')
              }}</span>
            </span> -->
            <div class="flex space-x-2">
              <template
                v-for="pm in method.paymentMethods.filter(
                  (item: any) => item.code === 'card',
                )"
                :key="`${pm.id}`"
              >
                <NuxtImg
                  v-for="brand in pm.brands"
                  :key="`${brand.id}`"
                  :src="`${brand.image}`"
                  :alt="brand.name"
                  width="30"
                  height="15"
                  provider="odooProvider"
                />
              </template>
            </div>
            <!-- <span class="font-medium mt-2">{{ method.name }}</span> -->
            <NuxtImg
              provider="odooProvider"
              :src="`${method.image}`"
              :alt="method.name"
            />
            <!-- <span v-if="disabled" class="text-xs text-neutral-500">{{
              $t('checkoutPayment.comingSoon')
            }}</span> -->
          </span>
        </label>
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import { SfIconCreditCard } from "@storefront-ui/vue";
import { PaymentAcquirer } from "~/graphql";

type CheckoutPaymentProps = {
  activePayment: number;
  paymentMethods: PaymentAcquirer[];
};

type CheckoutPaymentEmits = (
  event: "update:activePayment",
  parameter: number,
) => void;

const props = defineProps<CheckoutPaymentProps>();
defineEmits<CheckoutPaymentEmits>();

const { t } = useI18n();
</script>
