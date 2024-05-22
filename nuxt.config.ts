// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      viewport: "minimum-scale=1, initial-scale=1, width=device-width",
      title: "Vue Storefront",
      htmlAttrs: {
        lang: "en",
      },
    },
  },
  extends: [
    "./domains/auth",
    "./domains/cart-odoo",
    //"./domains/cart-redis",
    "./domains/category",
    "./domains/checkout",
    "./domains/core",
    "./domains/my-account",
    "./domains/product",
    "./domains/search-algolia",
    //"./domains/search-default",
    "./domains/wishlist",
  ],
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxtjs/device",
    "@nuxtjs/critters",
    "@nuxtjs/i18n",
    "@nuxtjs/algolia",
    "@nuxtjs/fontaine",
    "@nuxtjs/google-fonts",
    "nuxt-lazy-hydrate",
    "nuxt-lodash",
    "nuxt-icon",
    "nuxt-delay-hydration",
  ],
  runtimeConfig: {
    shouldByPassCacheQueryNames: ["LoadCartQuery", "WishlistLoadQuery"],
    public: {
      odooBaseImageUrl: "",
      odooBaseUrl: "",
      algoliaEnabled: 0,
    },
  },
  googleFonts: {
    families: {
      "Red Hat Display": [400, 500, 700],
    },
  },
  i18n: {
    locales: [
      {
        code: "en",
        file: "en.json",
      },
    ],
    strategy: "no_prefix",
    lazy: true,
    langDir: "lang",
    defaultLocale: "en",
  },
  algolia: {
    apiKey: process.env.NUXT_ALGOLIA_API_KEY,
    applicationId: process.env.NUXT_ALGOLIA_APPLICATION_ID,
    instantSearch: {
      theme: "algolia",
    },
  },
  delayHydration: {
    mode: "init",
  },
  vite: {
    optimizeDeps: {
      include: ["lodash-es"],
    },
  },
  build: {
    transpile: ["vue-toastification"],
  },
  image: {
    providers: {
      odooProvider: {
        name: "odooProvider",
        provider: "~/providers/odoo-provider.ts",
      },
    },
    screens: {
      "2xl": 1536,
      xxl: 1440,
      xl: 1280,
      lg: 1024,
      md: 768,
      sm: 640,
      xs: 376,
    },
  },
  routeRules: {
    "/": { swr: 3600 },
    "/category/*": { swr: 3600 },
    "/product/*": { swr: 3600 },

    "/_ipx/**": {
      headers: { "cache-control": "public, max-age=31536000, immutable" },
    },
    "/icons/**": {
      headers: { "cache-control": "public, max-age=31536000, immutable" },
    },
    "/favicon.ico": {
      headers: { "cache-control": "public, max-age=31536000, immutable" },
    },
  },
  nitro: {
    compressPublicAssets: true,
    storage: {
      cache: {
        driver: "redis",
        url: process.env.REDIS_URL,
      },
    },
    devStorage: {
      cache: {
        driver: "redis",
        url: process.env.REDIS_URL,
      },
    },
  },
  site: {
    url: "https://vsfsdk.labs.odoogap.com/",
    name: "ERPGAP VSF",
    description: "Welcome to an awesome ecommerce site!",
    defaultLocale: "en",
  },
  tailwindcss: {
    viewer: false,
  },
});