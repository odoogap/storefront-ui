<script setup lang="ts">
import { AddressEnum } from "~/graphql";

definePageMeta({
  layout: "account",
});
const { shippingAddresses, loadAddresses } = useAddresses();

await loadAddresses(AddressEnum.Shipping);
</script>
<template>
  <UiDivider class="w-screen -mx-4 md:col-span-3 md:w-auto md:mx-0" />
  <AccountFormsAddress
    v-bind:addresses="shippingAddresses"
    :type="AddressEnum.Shipping"
    :header="$t('shipping.heading')"
  />
</template>
