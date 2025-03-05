"use client"

import { useState } from "react"
import Select from "react-select"
import { products } from "../data/products"

export default function SnuffSpecForm() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here we'll handle form submission (e.g., saving to state or sending to an API)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="product" className="block text-sm font-medium text-gray-700">
          Select Product
        </label>
        <Select
          id="product"
          options={products}
          value={selectedProduct}
          onChange={handleProductChange}
          placeholder="Search for a product..."
          className="mt-1"
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
          <h3 className="font-semibold">Selected Product:</h3>
          <p>Name: {selectedProduct.label}</p>
          <p>SKU: {selectedProduct.value}</p>
        </div>
      )}

      {/* We'll add more form fields here later */}

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!selectedProduct}
      >
        Submit Specification
      </button>
    </form>
  )
}

