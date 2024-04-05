<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    leave-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 bg-neutral-700 bg-opacity-50" />
  </transition>

  <!-- Modal -->
  <transition
    enter-active-class="transition duration-200 ease-out"
    leave-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-10"
    enter-to-class="opacity-100 translate-y-0"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-10"
  >
    <SfModal
      v-model="isOpen"
      class="min-w-[50vw] max-w-[100%] md:max-w-lg"
      tag="section"
      role="alertdialog"
      aria-labelledby="promoModalTitle"
      aria-describedby="promoModalDesc"
    >
      <header>
        <SfButton
          square
          variant="tertiary"
          class="absolute right-2 top-2"
          @click="close"
        >
          <SfIconClose />
        </SfButton>
        <h3
          id="promoModalTitle"
          class="font-bold typography-headline-4 md:typography-headline-3"
        >
          Payment
        </h3>
      </header>
      <p id="promoModalDesc" class="mt-2">
        <StripeElements
          v-if="stripeLoaded"
          v-slot="{ elements, instance }"
          ref="elms"
          :stripe-key="stripeKey"
          :instance-options="instanceOptions"
          :elements-options="elementsOptions"
        >
          <StripeElement
            ref="card"
            type="payment"
            :elements="elements"
            :options="cardOptions"
          />
        </StripeElements>
      </p>
      <footer class="flex justify-end gap-4 mt-4">
        <SfButton variant="secondary" @click="close">{{
          $t("contactInfo.cancel")
        }}</SfButton>
        <SfButton :disabled="!ready || loading" @click="pay">
          <template #prefix>
            <SfLoaderCircular v-if="loading" size="xs" />
          </template>
          {{ $t("placeOrder") }}</SfButton
        >
      </footer>
    </SfModal>
  </transition>
</template>

<script lang="ts" setup>
import { loadStripe } from "@stripe/stripe-js";
import { StripeElements, StripeElement } from "vue-stripe-js";
import {
  SfModal,
  SfButton,
  SfIconClose,
  SfLoaderCircular,
  useDisclosure,
} from "@storefront-ui/vue";
import { useToast } from "vue-toastification";

const props = defineProps({
  provider: {
    required: true,
    type: Object,
  },
  cart: {
    required: true,
    type: Object,
  },
  billingAddress: {
    type: Object,
  },
});

const emit = defineEmits([
  "isPaymentReady",
  "providerPaymentHandler",
  "paymentLoading",
]);

const router = useRouter();
const ready = ref(false);
const loading = ref(false);
const { getPaymentConfirmation } = usePayment();
const { isOpen, open, close } = useDisclosure({ initialValue: false });
const { openTransaction, transaction, inlineform, loadInlineForm } =
  useStripePayment(props.provider.id, props.cart?.order?.id);
const stripeKey = ref(props.provider.publicKey); // test key
const instanceOptions = ref({
  // https://stripe.com/docs/js/initializing#init_stripe_js-options
});

console.log("props.cart?.order", props.cart?.order);

const elementsOptions = ref({
  // https://stripe.com/docs/js/elements_object/create#stripe_elements-options
  appearance: { theme: "stripe" },
  mode: "payment",
  captureMethod: "automatic",
  paymentMethodTypes: ["card"],
  amount: null,
  currency: null,
});
const cardOptions = ref({
  // https://stripe.com/docs/stripe.js#element-options
  defaultValues: {
    billingDetails: {
      name: props?.billingAddress?.name || "",
      email: props?.billingAddress?.email || "",
      phone: props?.billingAddress?.phone || "",
      address: {
        line1: props?.billingAddress?.street || "",
        line2: props?.billingAddress?.street2 || "",
        city: props?.billingAddress?.city || "",
        state: props?.billingAddress?.state?.code || "",
        country: props?.billingAddress?.state?.country?.code || "",
        postalCode: props?.billingAddress?.zip || "",
      },
    },
  },
});
const stripeLoaded = ref(false);
const card = ref();
const elms = ref();
const toast = useToast();

onBeforeMount(async () => {
  const stripePromise = loadStripe(stripeKey.value);
  await loadInlineForm();
  elementsOptions.value.amount = inlineform.value.amount;
  elementsOptions.value.currency = inlineform.value.currency;

  stripePromise
    .then(() => {
      emit("isPaymentReady", true);
      ready.value = true;
      emit("providerPaymentHandler", open);
      stripeLoaded.value = true;
    })
    .catch(() => {
      ready.value = false;
      emit("isPaymentReady", false);
    });
});

const pay = async () => {
  // Get stripe element
  console.log("elms.value.instance", elms.value);
  emit("paymentLoading", true);
  loading.value = true;
  await openTransaction();
  await elms.value.elements.submit();
  elms.value.instance
    .confirmPayment({
      elements: elms.value.elements,
      clientSecret: transaction.value?.client_secret,
      confirmParams: {
        return_url: transaction.value?.return_url,
      },
    })
    .then((result: any) => {
      // Handle result.error or result.token
      console.log(result);
      if (result?.error) {
        toast.error(result.error?.message);
      }
    })
    .catch((error: any) => {
      toast.error(error);
    })
    .finally(() => {
      emit("paymentLoading", false);
      loading.value = false;
    });
};

onMounted(async () => {});

onBeforeUnmount(() => {});
</script>
