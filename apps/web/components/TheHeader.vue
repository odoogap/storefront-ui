<script lang="ts" setup>
import {
  SfButton,
  SfDrawer,
  SfBadge,
  SfIconShoppingCart,
  SfIconFavorite,
  SfIconPerson,
  SfIconClose,
  SfIconExpandMore,
  SfListItem,
  useDisclosure,
  useTrapFocus,
  SfIconMenu,
  SfInput,
  SfIconSearch,
  SfLink,
} from "@storefront-ui/vue";
import { onClickOutside } from "@vueuse/core";
import { flatten, path, omit } from "rambda/immutable";

defineProps<{ filled?: boolean }>();

const { loadCategoryList, categories } = useCategory();
const { isOpen, toggle, close } = useDisclosure();
const { wishlistSidebarIsOpen, toggleWishlistSideBar } = useUiState();
const { wishlistTotalItems, loadWishlist, wishlist } = useWishlist();
const NuxtLink = resolveComponent("NuxtLink");
const router = useRouter();

const menuRef = ref();
const drawerRef = ref();
useTrapFocus(drawerRef, {
  activeState: isOpen,
  arrowKeysUpDown: true,
  initialFocus: "container",
});
onClickOutside(menuRef, () => {
  close();
});

const cartCounter = useCookie<number>("cart-counter");

const inputValue = ref("");
const search = () => {
  // eslint-disable-next-line no-alert
  alert(`Successfully found 10 results for ${inputValue.value}`);
};
const actionItems = [
  {
    icon: SfIconShoppingCart,
    label: "",
    ariaLabel: "Cart",
    role: "button",
    badge: true,
    link: "/cart",
  },
  {
    icon: SfIconPerson,
    label: "Log in",
    ariaLabel: "Log in",
    role: "login",
    badge: false,
    link: "/login",
  },
];

const bannerDetails = {
  image: "/images/watch.png",
  title: "New in designer watches",
};

const handleWishlistSideBar = async () => {
  toggleWishlistSideBar();
};

await loadCategoryList({ filter: { parent: true } });

onMounted(async () => {
  await loadWishlist();
  window.addEventListener("mousemove", mouseDirection);
});

const activeMainCategory = ref(0);
const throttle = ref(false);
const direction = ref("");
const lastX = ref(0);
const lastY = ref(0);

const isActive = (key) => {
  return activeMainCategory.value === key;
};
const mouseDirection = (e) => {
  if (!throttle.value) {
    throttle.value = true;
    const theta = Math.abs(
      (180 * Math.atan2(e.pageY - lastY.value, e.pageX - lastX.value)) /
        Math.PI,
    );
    direction.value = theta > 75 ? "vertical" : "horizontal";
    lastX.value = e.pageX;
    lastY.value = e.pageY;
    setTimeout(() => {
      throttle.value = false;
    }, 50);
  }
};
const changeMainCategory = (index) => {
  if (direction.value === "vertical") {
    activeMainCategory.value = index;
  }
};
onBeforeUnmount(() => {
  window.removeEventListener("mousemove", mouseDirection);
});
const filteredCategories = (() => {
  const temp = categories.value.map((i) => {
    if (Array.isArray(i.childs)) {
      i.childs = i.childs.reduce((accumulator, currentVal) => {
        accumulator.push(omit("childs", currentVal));
        if (Array.isArray(currentVal?.childs)) {
          return accumulator.concat(flatten([...currentVal.childs]));
        }
        return accumulator;
      }, []);
    }
    return i;
  });

  return temp;
})();
</script>

<template>
  <div class="w-full">
    <div
      v-if="isOpen"
      class="fixed !w-screen !h-screen inset-0 bg-neutral-500 bg-opacity-50 transition-opacity duration-1000 top-index"
    />
    <header
      ref="menuRef"
      :class="[
        'h-14 md:h-20 flex z-50 md:sticky md:top-0 md:shadow-md flex-wrap md:flex-nowrap w-full py-2 md:py-5 border-0 bg-primary-700 border-neutral-200 md:z-10',
        { 'bg-primary-700 text-white': filled },
        { 'bg-white border-b border-neutral-200': !filled },
      ]"
    >
      <div
        class="flex items-center justify-between lg:justify-start h-full w-full narrow-container"
      >
        <NuxtLink to="/" aria-label="Sf Homepage" class="h-6 md:h-7 -mt-1.5">
          <VsfLogo />
        </NuxtLink>
        <SfButton
          v-if="filled"
          class="hidden lg:flex text-white font-body bg-transparent hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white ml-6"
          type="button"
          :aria-haspopup="true"
          :aria-expanded="isOpen"
          variant="tertiary"
          square
          @click="toggle()"
        >
          <template #suffix>
            <SfIconExpandMore class="hidden md:inline-flex" />
          </template>
          <span class="hidden md:inline-flex whitespace-nowrap px-2"
            >Browse products</span
          >
        </SfButton>
        <nav>
          <ul>
            <li role="none">
              <transition
                enter-active-class="transform transition duration-500 ease-in-out"
                leave-active-class="transform transition duration-500 ease-in-out"
                enter-from-class="-translate-x-full md:translate-x-0 md:opacity-0"
                enter-to-class="translate-x-0 md:translate-x-0 md:opacity-100"
                leave-from-class="translate-x-0 md:opacity-100"
                leave-to-class="-translate-x-full md:translate-x-0 md:opacity-0"
              >
                <SfDrawer
                  ref="drawerRef"
                  v-model="isOpen"
                  disable-click-away
                  placement="top"
                  class="bg-white p-0 max-h-screen overflow-y-auto lg:!absolute lg:!top-[5rem] max-w-full lg:p-6 top-index"
                >
                  <div
                    class="hidden md:grid grid-cols-1 lg:gap-x-6 lg:grid-cols-4 lg:relative h-[60vh]"
                  >
                    <div
                      class="sticky top-0 flex items-center justify-between py-2 px-4 bg-primary-700 lg:hidden w-full"
                    >
                      <div
                        class="flex items-center typography-text-lg font-medium text-white"
                      >
                        Browse products
                      </div>
                      <SfButton
                        square
                        variant="tertiary"
                        aria-label="Close navigation menu"
                        class="text-white ml-2"
                        @click="close()"
                        @keydown.enter.space="close()"
                      >
                        <SfIconClose />
                      </SfButton>
                    </div>
                    <div class="main-categories">
                      <SfListItem
                        v-for="(category, index) in filteredCategories"
                        :key="'cat' + category.id"
                        tag="a"
                        size="sm"
                        role="none"
                        :class="[
                          'typography-text-base lg:typography-text-sm py-4 lg:py-1.5 text-black rounded-xl',
                          isActive(index) ? 'active' : '',
                        ]"
                        @mouseover="changeMainCategory(index)"
                      >
                        {{ category.name }}
                      </SfListItem>
                    </div>
                    <div class="sub-categories col-span-3">
                      <div
                        v-for="(child, childIndex) in filteredCategories[
                          activeMainCategory
                        ].childs"
                        :key="
                          'sub' +
                          filteredCategories[activeMainCategory].id +
                          child.id +
                          childIndex
                        "
                        class="sub-category rounded-xl"
                      >
                        <SfLink
                          :href="child.slug"
                          variant="primary"
                          class="text-black rounded-xl no-underline"
                        >
                          <NuxtImg
                            class="w-full h-auto rounded-md image-category"
                            :src="`/web/image/product.public.category/${child.id}/image_1920`"
                            :alt="child.name ?? ''"
                            width="150"
                            height="150"
                            loading="lazy"
                            provider="odooProvider"
                          />
                          <div class="label text-center">
                            {{ child.name }}
                          </div>
                        </SfLink>
                      </div>
                    </div>

                    <SfButton
                      square
                      size="sm"
                      variant="tertiary"
                      aria-label="Close navigation menu"
                      class="hidden lg:block lg:absolute lg:right-0 lg:top-0 hover:bg-primary-50 active:bg-white"
                      @click="close()"
                    >
                      <SfIconClose class="text-neutral-500" />
                    </SfButton>
                  </div>
                  <!-- Mobile -->

                  <div
                    class="md:hidden sm:grid grid-cols-1 lg:gap-x-6 lg:grid-cols-3 lg:narrow-container lg:relative"
                  >
                    <div
                      class="sticky top-0 flex items-center justify-between py-2 px-4 bg-primary-700 lg:hidden w-full"
                    >
                      <div
                        class="flex items-center typography-text-lg font-medium text-white"
                      >
                        Browse products
                      </div>
                      <SfButton
                        square
                        variant="tertiary"
                        aria-label="Close navigation menu"
                        class="text-white ml-2"
                        @click="close()"
                        @keydown.enter.space="close()"
                      >
                        <SfIconClose />
                      </SfButton>
                    </div>
                    <div
                      v-for="{ name, childs } in filteredCategories"
                      :key="name"
                      class="[&:nth-child(2)]:pt-0 pt-6 md:pt-0 text-black"
                    >
                      <h2
                        role="presentation"
                        class="typography-text-base font-medium text-neutral-900 whitespace-nowrap p-4 lg:py-1.5"
                      >
                        {{ name }}
                      </h2>
                      <hr class="mb-3.5" />
                      <ul>
                        <li
                          v-for="{ name, slug, childs: subcategory } in childs"
                          :key="name"
                        >
                          <SfListItem
                            v-if="subcategory !== null"
                            tag="a"
                            :href="slug"
                            size="sm"
                            role="none"
                            class="typography-text-base lg:typography-text-sm py-4 lg:py-1.5"
                          >
                            {{ name }}
                          </SfListItem>
                        </li>
                      </ul>
                    </div>
                    <div
                      class="flex flex-col items-center justify-center bg-neutral-100 lg:rounded-md border-neutral-300 overflow-hidden grow"
                    >
                      <NuxtImg
                        :src="bannerDetails.image"
                        :alt="bannerDetails.title"
                        class="object-contain"
                      />
                      <p
                        class="mb-4 mt-4 px-4 text-center text-black typography-text-base font-medium"
                      >
                        {{ bannerDetails.title }}
                      </p>
                    </div>
                  </div>
                </SfDrawer>
              </transition>
            </li>
          </ul>
        </nav>
        <form
          v-if="filled"
          role="search"
          class="hidden lg:flex flex-[100%] mt-2 md:mt-0 md:ml-10 pb-2 md:pb-0"
          @submit.prevent="search"
        >
          <SfInput
            v-model="inputValue"
            type="search"
            class="[&::-webkit-search-cancel-button]:appearance-none"
            placeholder="Search"
            wrapper-class="flex-1 h-10 pr-0"
            size="base"
          >
            <template #suffix>
              <span class="flex items-center">
                <SfButton
                  variant="tertiary"
                  square
                  aria-label="search"
                  type="submit"
                  class="rounded-l-none hover:bg-transparent active:bg-transparent"
                >
                  <SfIconSearch />
                </SfButton>
              </span>
            </template>
          </SfInput>
        </form>
        <nav
          v-if="filled"
          class="hidden lg:flex flex-nowrap justify-end items-center md:ml-10 gap-x-1"
          aria-label="SF Navigation"
        >
          <div>
            <SfButton
              class="group relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-1 -ml-0.5 rounded-md"
              type="button"
              :aria-haspopup="true"
              :aria-expanded="wishlistSidebarIsOpen"
              variant="tertiary"
              square
              @click="handleWishlistSideBar"
            >
              <template #prefix>
                <SfIconFavorite class="text-white" />
                <SfBadge
                  :content="wishlistTotalItems"
                  class="outline outline-primary-700 bg-white !text-neutral-900 group-hover:outline-primary-800 group-active:outline-primary-900 flex justify-center"
                  data-testid="wishlist-badge"
                />
              </template>
            </SfButton>
            <WishlistSidebar
              :is-open="wishlistSidebarIsOpen"
              @close="toggleWishlistSideBar"
            />
          </div>
          <SfButton
            v-for="{ ariaLabel, label, icon, link, badge, role } in actionItems"
            :key="ariaLabel"
            class="group relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-1 -ml-0.5 rounded-md"
            :aria-label="ariaLabel"
            :tag="NuxtLink"
            :to="link"
            variant="tertiary"
            square
          >
            <template #prefix>
              <Component :is="icon" />
              <SfBadge
                v-if="badge"
                :content="cartCounter || 0"
                class="outline outline-primary-700 bg-white !text-neutral-900 group-hover:outline-primary-800 group-active:outline-primary-900 flex justify-center"
                data-testid="cart-badge"
              />
            </template>
            <span
              v-if="role === 'login'"
              class="hidden lg:inline-flex whitespace-nowrap pr-2"
              >{{ label }}</span
            >
          </SfButton>
        </nav>
        <div v-if="filled">
          <SfButton
            v-if="filled"
            variant="tertiary"
            class="relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 rounded-md lg:hidden"
            square
            @click="$emit('searchModalOpen')"
          >
            <SfIconSearch />
          </SfButton>
          <SfButton
            class="block lg:hidden text-white font-body bg-transparent hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white self-end"
            type="button"
            :aria-haspopup="true"
            :aria-expanded="isOpen"
            variant="tertiary"
            square
            @click="toggle()"
          >
            <SfIconMenu class="text-white" />
          </SfButton>
        </div>
      </div>
    </header>
  </div>
</template>
<style scoped>
.main-categories {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  gap: 0px 0px;
}

.main-category {
  display: flex;
  cursor: pointer;
  flex-direction: row;
  align-items: center;
  padding-left: 15px;
}

.main-category:not(:last-of-type) {
  /* border-bottom: 1px solid #e80000; */
}

.main-category .icon {
  margin-right: 15px;
}

.main-category.active {
  background: #c9c9c9;
  border-radius: 20px;
}

.sub-categories {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    ". . . ."
    ". . . ."
    ". . . .";
  overflow-y: auto;
  height: 100%;
  grid-auto-rows: 10rem;
}

.sub-category {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.sub-category:hover {
}

.image-category:hover {
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.sub-category .label {
  margin-top: 15px;
  color: #000000;
}
.sub-category .label:hover {
  color: #8a8a8a;
}
</style>
