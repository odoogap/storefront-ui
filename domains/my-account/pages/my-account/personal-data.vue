<script setup lang="ts">
import {
  SfButton,
  SfIconClose,
  SfModal,
  useDisclosure,
} from "@storefront-ui/vue";
import { unrefElement } from "@vueuse/core";
import type { MutationCreateUpdatePartnerArgs } from "~/graphql";

definePageMeta({
  layout: "account",
});
const { isOpen, open, close } = useDisclosure();
const { loadUser, user, updatePassword, updatePartner } = useAuth();

const lastActiveElement = ref();
const modalElement = ref();
const openedForm = ref("");

const openModal = async (modalName: string) => {
  openedForm.value = modalName;
  lastActiveElement.value = document.activeElement;
  open();
  await nextTick();
  unrefElement(modalElement).focus();
};

const closeModal = () => {
  close();
  lastActiveElement.value.focus();
};

const handleUpdatePartner = async (data: MutationCreateUpdatePartnerArgs) => {
  await updatePartner({ ...data, subscribeNewsletter: false });
  closeModal();
};

const saveNewPassword = async (passwords: any) => {
  if (passwords.firstNewPassword === passwords.secondNewPassword) {
    await updatePassword({
      currentPassword: passwords.oldPassword,
      newPassword: passwords.firstNewPassword,
    });
    closeModal();
  }
};

await loadUser();
</script>
<template>
  <UiDivider class="w-screen -mx-4 md:col-span-3 md:w-auto md:mx-0" />
  <AccountProfileData
    class="col-span-3"
    :header="$t('account.accountSettings.personalData.contactInformation')"
    :button-text="$t('account.accountSettings.personalData.edit')"
    @on-click="openModal('contactInformation')"
  >
    <div class="flex">
      {{ user?.name }}
    </div>
    <div class="flex">
      {{ user?.email }}
    </div>
  </AccountProfileData>

  <UiDivider class="w-screen -mx-4 md:col-span-3 md:w-auto md:mx-0" />

  <AccountProfileData
    class="col-span-3"
    :header="$t('account.accountSettings.personalData.yourPassword')"
    :button-text="$t('account.accountSettings.personalData.change')"
    @on-click="openModal('passwordChange')"
  >
    ******
  </AccountProfileData>
  <UiDivider class="w-screen -mx-4 md:col-span-3 md:w-auto md:mx-0" />
  <UiOverlay v-if="isOpen" :visible="isOpen">
    <SfModal
      ref="modalElement"
      v-model="isOpen"
      tag="section"
      role="dialog"
      class="h-full w-full overflow-auto md:w-[600px] md:h-fit"
      aria-labelledby="address-modal-title"
    >
      <header>
        <SfButton
          type="button"
          square
          variant="tertiary"
          class="absolute right-2 top-2"
          @click="closeModal"
        >
          <SfIconClose />
        </SfButton>
        <h3
          id="address-modal-title"
          class="text-neutral-900 text-lg md:text-2xl font-bold mb-6"
        >
          {{ $t(`account.accountSettings.personalData.${openedForm}`) }}
        </h3>
      </header>
      <AccountContactInformation
        v-if="openedForm === 'contactInformation'"
        :name="user?.name || ''"
        :email="user?.email || ''"
        @on-save="handleUpdatePartner"
        @on-cancel="closeModal"
      />
      <AccountFormPassword
        v-else-if="openedForm === 'passwordChange'"
        @on-save="saveNewPassword"
        @on-cancel="closeModal"
      />
    </SfModal>
  </UiOverlay>
</template>