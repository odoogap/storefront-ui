<script setup lang="ts">
import { SfButton } from "@storefront-ui/vue";
import Done from "~/assets/image/done.svg";
const emit = defineEmits([]);

const { getPaymentConfirmation } = usePayment();
const { cart, loadCart } = useCart();

const companyDetails = ref({
  name: "Divante Headquarter",
  street: "St. Dmowskiego 17, 53-534",
  city: "Wroclaw, Poland",
  email: "demo@vuestorefront.io",
});
const data = await getPaymentConfirmation();
const paymentSuccess =
  data?.paymentConfirmation?.order?.lastTransaction?.state === "Authorized" ||
  data?.paymentConfirmation?.order?.lastTransaction?.state === "Confirmed";
onMounted(async () => {
  console.log("data", data);
});
const redirectToPayment = () => {
  //   return root.$router.push(root.localePath("/checkout/payment"));
};
const displayDetails = [
  {
    image: Done,
    isSvg: true,
    title: "Thank you for your order!",
    description: "Your payment has been: ",
    reverse: false,
    backgroundColor: "bg-secondary-100",
    titleClass: "md:typography-display-2",
    descriptionClass: "md:typography-text-lg",
  },
];
</script>

<template>
  <div id="thank-you">
    <div class="flex flex-col md:flex-row flex-wrap gap-6 w-full">
      <div
        v-for="{
          image,
          title,
          description,
          buttonText,
          backgroundColor,
          reverse,
          titleClass,
          isSvg,
        } in displayDetails"
        :key="title"
        :class="[
          'relative flex md:max-w-[1536px] md:[&:not(:first-of-type)]:flex-1 md:first-of-type:w-full',
          backgroundColor,
        ]"
      >
        <a
          class="absolute w-full h-1/2 z-1 focus-visible:outline focus-visible:rounded-lg"
          :aria-label="title"
          href="#"
        />
        <div
          :class="[
            'flex justify-between overflow-hidden grow',
            { 'flex-row-reverse': reverse },
          ]"
        >
          <div
            class="flex flex-col justify-center items-start p-6 lg:p-10 max-w-1/2"
          >
            <h2
              :class="['mb-4 mt-2 font-bold typography-display-2', titleClass]"
            >
              {{ title }}
            </h2>
            <p class="typography-headline-2 block mb-4">
              {{ description }}
              <b>{{
                data?.paymentConfirmation?.order?.lastTransaction?.state
              }}</b>
            </p>
            <SfButton
              tag="a"
              href="/"
              class="back-button color-secondary button-size"
              >{{ $t("Go home") }}</SfButton
            >
          </div>
          <img
            v-if="!isSvg"
            :src="image"
            :alt="title"
            class="w-1/2 self-end object-contain"
          />
          <component
            :is="image"
            v-if="isSvg"
            class="w-1/2 h-32 object-contain self-center"
            :font-controlled="false"
          />
        </div>
      </div>
    </div>
    <br />
    <div
      class="flex flex-col md:flex-row flex-wrap gap-6 w-full bg-secondary-100"
    >
      <div class="flex-1 p-10">
        <h2 :class="['mb-4 mt-2 font-bold typography-display-2']">
          {{ $t("Your Purchase") }}
        </h2>
        <p class="typography-display-3">
          {{ $t("thankyou.messageDone") }}
        </p>
      </div>
      <div class="flex-1 p-10">
        <h2 :class="['mb-4 mt-2 font-bold typography-display-2']">
          {{ $t("orderSummary") }}
        </h2>
        <div class="contact">
          <div
            class="md:rounded-md md:border md:border-neutral-100 bg-secondary-200"
            data-testid="order-summary"
          >
            <div
              class="flex justify-between items-end py-2 px-4 md:px-6 md:pt-6 md:pb-4"
            >
              <p
                class="typography-headline-4 font-bold md:typography-headline-3"
              >
                ID {{ data?.paymentConfirmation?.order?.name }}
              </p>
              <p
                class="typography-text-base font-medium"
                data-testid="total-in-cart"
              >
                {{
                  $t("itemsInCart", {
                    count:
                      data?.paymentConfirmation?.order?.websiteOrderLine
                        ?.length,
                  })
                }}
              </p>
            </div>
            <div class="px-4 pb-4 mt-3 md:px-6 md:pb-6 md:mt-0">
              <div class="flex justify-between typography-text-base pb-4">
                <div class="flex flex-col grow pr-2">
                  <p>{{ $t("itemsSubtotal") }}</p>
                  <!-- <p class="typography-text-xs text-secondary-700">
            {{ $t('savings') }}
          </p> -->
                  <p class="my-2">{{ $t("delivery") }}</p>
                  <p>{{ $t("estimatedTax") }}</p>
                </div>
                <div class="flex flex-col text-right">
                  <p data-testid="special-price">
                    {{ data?.paymentConfirmation?.order?.currency?.symbol
                    }}{{
                      data?.paymentConfirmation?.order?.amountSubtotal || 0
                    }}
                  </p>
                  <!-- <p class="typography-text-xs text-secondary-700">
            ${{ data?.paymentConfirmation?.order?.shippingMethod?.price || 0 }}
          </p> -->
                  <p class="my-2 text-secondary-700">
                    {{ data?.paymentConfirmation?.order?.currency?.symbol
                    }}{{
                      data?.paymentConfirmation?.order?.shippingMethod?.price ||
                      0
                    }}
                  </p>
                  <p>
                    {{ data?.paymentConfirmation?.order?.currency?.symbol
                    }}{{ data?.paymentConfirmation?.order?.amountTax }}
                  </p>
                </div>
              </div>
              <div
                class="flex justify-between typography-headline-4 md:typography-headline-3 font-bold pb-4 mb-4"
              >
                <p>{{ $t("total") }}</p>
                <p data-testid="total">
                  {{ data?.paymentConfirmation?.order?.currency?.symbol
                  }}{{ data?.paymentConfirmation?.order?.amountTotal }}
                </p>
              </div>
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
