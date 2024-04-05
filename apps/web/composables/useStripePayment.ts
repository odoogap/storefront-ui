import {
  PaymentTransaction,
  MutationStripeTransactionArgs,
  StripeTransactionResponse,
  MutationStripeInlineFormArgs,
  StripeInlineFormResponse,
} from "~/graphql";
import { MutationName } from "~/server/mutations";

export interface IUseStripePayment {
  transaction: Ref<any>;
  inlineform: Ref<any>;
  openTransaction: () => any;
  loadInlineForm: () => any;
  setTransaction: (transaction: PaymentTransaction) => any;
}

const useStripePayment = (
  providerId: number,
  cartId?: number
): IUseStripePayment => {
  const { $sdk } = useNuxtApp();

  const transaction = useState<PaymentTransaction>(
    `transaction-${cartId}`,
    () => ({}) as PaymentTransaction
  );
  const inlineform = useState<PaymentTransaction>(
    `inlineform-${cartId}`,
    () => ({}) as PaymentTransaction
  );

  const loadInlineForm = async () => {
    const { data } = await useAsyncData("stripe-inlineform", async () => {
      const { data } = await $sdk().odoo.mutation<
        MutationStripeInlineFormArgs,
        StripeInlineFormResponse
      >(
        {
          mutationName: MutationName.StripeInlineform,
        },
        { providerId }
      );
      return data.value;
    });
    inlineform.value = data.value?.stripeInlineForm?.inlineFormValues || {};
  };
  const openTransaction = async () => {
    const { data } = await useAsyncData("payment-transaction", async () => {
      const { data } = await $sdk().odoo.mutation<
        MutationStripeTransactionArgs,
        StripeTransactionResponse
      >(
        {
          mutationName: MutationName.StripeTransaction,
        },
        { providerId }
      );

      return data.value;
    });
    transaction.value = data.value?.stripeTransaction?.transaction || {};
  };

  const setTransaction = (transactionParam: PaymentTransaction) =>
    (transaction.value = transactionParam);

  return {
    transaction,
    openTransaction,
    setTransaction,
    inlineform,
    loadInlineForm,
  };
};

export default useStripePayment;
