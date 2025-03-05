"use client"

import { useState } from "react"
import Select from "react-select"
import { products } from "../data/products"

export default function SnuffSpecForm() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [formData, setFormData] = useState({
    productName: "",
    productSku: "",
    // We'll add more fields here later
  })

  const handleProductChange = (selectedOption) => {
    setSelectedProduct(selectedOption)
    setFormData((prevData) => ({
      ...prevData,
      productName: selectedOption.label,
      productSku: selectedOption.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here we'll handle form submission (e.g., saving to state or sending to an API)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div>
        <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
          Select Product
        </label>
        <Select
          id="product"
          options={products}
          value={selectedProduct}
          onChange={handleProductChange}
          placeholder="Search for a product..."
          className="basic-single"
          classNamePrefix="select"
          formatOptionLabel={({ label, value }) => (
            <div className="flex justify-between">
              <span>{label}</span>
              <span className="text-gray-500">{value}</span>
            </div>
          )}
        />
      </div>

      {selectedProduct && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Selected Product:</h3>
          <p>Name: {selectedProduct.label}</p>
          <p>SKU: {selectedProduct.value}</p>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!selectedProduct}
      >
        Submit Specification
      </button>
    </form>
  )
}

