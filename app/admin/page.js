"use client"

import { useState } from "react"
import Link from "next/link"

export default function AdminPanel() {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    buyLink: ""
  })

  const [categoryData, setCategoryData] = useState({
    name: ""
  })

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })
      if (response.ok) {
        alert('Produkt dodany pomyślnie!')
        setProductData({
          name: "",
          description: "",
          price: "",
          category: "",
          image: "",
          buyLink: ""
        })
      }
    } catch (error) {
      console.error('Błąd podczas dodawania produktu:', error)
    }
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })
      if (response.ok) {
        alert('Kategoria dodana pomyślnie!')
        setCategoryData({ name: "" })
      }
    } catch (error) {
      console.error('Błąd podczas dodawania kategorii:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Wróć do strony głównej
          </Link>
          <h1 className="text-3xl font-bold mt-4">Panel administratora</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formularz produktu */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Dodaj nowy produkt</h2>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nazwa</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={productData.name}
                  onChange={(e) => setProductData({...productData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Opis</label>
                <textarea
                  required
                  className="w-full p-2 border rounded"
                  value={productData.description}
                  onChange={(e) => setProductData({...productData, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cena</label>
                <input
                  type="number"
                  required
                  className="w-full p-2 border rounded"
                  value={productData.price}
                  onChange={(e) => setProductData({...productData, price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kategoria</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={productData.category}
                  onChange={(e) => setProductData({...productData, category: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Link do obrazka</label>
                <input
                  type="url"
                  required
                  className="w-full p-2 border rounded"
                  value={productData.image}
                  onChange={(e) => setProductData({...productData, image: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Link do sklepu</label>
                <input
                  type="url"
                  required
                  className="w-full p-2 border rounded"
                  value={productData.buyLink}
                  onChange={(e) => setProductData({...productData, buyLink: e.target.value})}
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Dodaj produkt
              </button>
            </form>
          </div>

          {/* Formularz kategorii */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Dodaj nową kategorię</h2>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nazwa kategorii</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={categoryData.name}
                  onChange={(e) => setCategoryData({...categoryData, name: e.target.value})}
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Dodaj kategorię
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}