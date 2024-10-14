import axios from "axios";
import { writeFile } from "fs/promises";
import { resolve } from "path";

export async function generateCustomRoutes() {
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

    const filePath = resolve(__dirname, "customRoutes.js");
    await writeFile(
      filePath,
      `export const customRoutes = ${JSON.stringify(slugs)};`,
      "utf-8"
    );

    console.log("customRoutes.js created successfully!");
  } catch (error) {
    console.error("Error generating routes: ", error);
  }
}
