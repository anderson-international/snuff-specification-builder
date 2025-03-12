"use client"

import { useState, useMemo } from "react"
import type { ShopifyProduct } from "@/types/shopify"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import SpecificationBuilder from "./specification-builder"

interface ProductSearchProps {
  initialProducts: ShopifyProduct[]
  error?: string
}

export default function ProductSearch({ initialProducts, error }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [products] = useState<ShopifyProduct[]>(initialProducts)
  const [selectedProduct, setSelectedProduct] = useState<ShopifyProduct | null>(null)

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products

    const lowerCaseSearch = searchTerm.toLowerCase()
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(lowerCaseSearch) ||
        product.vendor.toLowerCase().includes(lowerCaseSearch) ||
        product.product_type.toLowerCase().includes(lowerCaseSearch) ||
        (product.tags && product.tags.toLowerCase().includes(lowerCaseSearch)),
    )
  }, [products, searchTerm])

  const handleProductSelect = (product: ShopifyProduct) => {
    setSelectedProduct(product)
  }

  const handleCloseSpecification = () => {
    setSelectedProduct(null)
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error fetching products</h3>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adding some products to your Shopify store.</p>
      </div>
    )
  }

  // If a product is selected, show the specification builder
  if (selectedProduct) {
    return <SpecificationBuilder product={selectedProduct} onClose={handleCloseSpecification} />
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="text"
          placeholder="Search products by name, vendor, type, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium mb-2">No matching products</h3>
          <p className="text-muted-foreground">Try a different search term</p>
        </div>
      ) : (
        <>
          {/* Desktop view - Table */}
          <div className="hidden md:block overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Inventory</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleProductSelect(product)}
                  >
                    <TableCell>
                      {product.image ? (
                        <div className="relative h-16 w-16 rounded-md overflow-hidden">
                          <Image
                            src={product.image.src || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="bg-muted h-16 w-16 rounded-md flex items-center justify-center">
                          <p className="text-xs text-muted-foreground">No image</p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-xs">
                          {product.body_html?.replace(/<[^>]*>?/gm, "") || "No description"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.product_type || "None"}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {product.variants && product.variants.length > 0 ? product.variants[0].inventory_quantity : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile view - Compact list */}
          <div className="md:hidden space-y-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center space-x-4 border-b pb-4 cursor-pointer hover:bg-muted/50 p-2 rounded-md"
                onClick={() => handleProductSelect(product)}
              >
                {product.image ? (
                  <div className="relative h-14 w-14 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image.src || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-muted h-14 w-14 rounded-md flex items-center justify-center flex-shrink-0">
                    <p className="text-xs text-muted-foreground">No image</p>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.title}</p>
                  <div className="flex justify-between items-center mt-1">
                    <Badge variant="outline" className="text-xs">
                      {product.product_type || "None"}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {product.variants && product.variants.length > 0
                        ? `${product.variants[0].inventory_quantity} in stock`
                        : "Inventory N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="text-sm text-muted-foreground text-center">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  )
}

