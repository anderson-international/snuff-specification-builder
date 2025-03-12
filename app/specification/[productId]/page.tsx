import { fetchShopifyProductById } from "@/lib/shopify"
import { getSpecificationsByProductId } from "@/lib/supabase-actions"
import SpecificationBuilder from "@/components/specification-builder"
import { notFound } from "next/navigation"

export default async function SpecificationPage({
  params,
}: {
  params: { productId: string }
}) {
  const { product, error: productError } = await fetchShopifyProductById(params.productId)
  const { data: existingSpecs, error: specsError } = await getSpecificationsByProductId(Number(params.productId))

  if (productError || !product) {
    console.error("Error fetching product:", productError)
    notFound()
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <SpecificationBuilder product={product} existingSpecifications={existingSpecs || []} />
    </div>
  )
}

