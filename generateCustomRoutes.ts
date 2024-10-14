import axios from "axios";
import { writeFile } from "fs/promises";
import { resolve } from "path";

export async function generateCustomRoutesForCategories() {
  try {
    const response = await axios.post(
      `${process.env.NUXT_PUBLIC_ODOO_BASE_URL}graphql/vsf`,
      {
        query: `
        query GetCategoriesForCustomRoutes {
          categories {
            categories {
              slug
            }
          }
        }
      `,
      }
    );

    const categories = response.data.data.categories.categories;

    const slugs = categories
      .filter(
        (category: { slug: string | null | undefined }) =>
          category.slug !== "false"
      )
      .map((category: { slug: string }) => category.slug);

    const filePath = resolve(__dirname, "customCategoriesRoutes.js");
    await writeFile(
      filePath,
      `export const customCategoriesRoutes = ${JSON.stringify(slugs)};`,
      "utf-8"
    );

    console.log("customCategoriesRoutes.js created successfully!");
  } catch (error) {
    console.error("Error generating routes: ", error);
  }
}

export async function generateCustomRoutesForProducts() {
  try {
    const response = await axios.post(
      `${process.env.NUXT_PUBLIC_ODOO_BASE_URL}graphql/vsf`,
      {
        query: `
        query GetProductsForCustomRoutes {
          products{
            products{
              slug
            }
          }
        }
      `,
      }
    );

    const products = response.data.data.products.products;

    const slugs = products
      .filter(
        (product: { slug: string | null | undefined }) =>
          product.slug !== "false"
      )
      .map((product: { slug: string }) => product.slug);

    const filePath = resolve(__dirname, "customProductsRoutes.js");
    await writeFile(
      filePath,
      `export const customProductsRoutes = ${JSON.stringify(slugs)};`,
      "utf-8"
    );

    console.log("customProductsRoutes.js created successfully!");
  } catch (error) {
    console.error("Error generating routes: ", error);
  }
}
