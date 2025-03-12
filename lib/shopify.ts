"use server"

import type { ShopifyProduct } from "@/types/shopify"

export async function fetchShopifyProducts(): Promise<{
  products?: ShopifyProduct[]
  error?: string
}> {
  try {
    const shopUrl = process.env.SHOPIFY_STORE_URL
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN

    if (!shopUrl || !accessToken) {
      return {
        error: "Shopify API credentials are missing. Please check your environment variables.",
      }
    }

    const response = await fetch(`https://${shopUrl}/admin/api/2023-10/products.json`, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        error: `Shopify API error: ${errorData.errors || response.statusText}`,
      }
    }

    const data = await response.json()
    return { products: data.products }
  } catch (error) {
    console.error("Error fetching Shopify products:", error)
    return {
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function fetchShopifyProductById(productId: string): Promise<{
  product?: ShopifyProduct
  error?: string
}> {
  try {
    const shopUrl = process.env.SHOPIFY_STORE_URL
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN

    if (!shopUrl || !accessToken) {
      return {
        error: "Shopify API credentials are missing. Please check your environment variables.",
      }
    }

    const response = await fetch(`https://${shopUrl}/admin/api/2023-10/products/${productId}.json`, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        error: `Shopify API error: ${errorData.errors || response.statusText}`,
      }
    }

    const data = await response.json()
    return { product: data.product }
  } catch (error) {
    console.error("Error fetching Shopify product:", error)
    return {
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

