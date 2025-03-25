"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import Link from "next/link"

const styles = {
  glowText: {
    textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
  },
  productCard: {
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  productCardHover: {
    transform: "translateY(-10px) scale(1.05)",
    boxShadow: "0 10px 25px rgba(255, 255, 255, 0.1)",
  },
}

function ProductCard({ product }) {
  return (
    <div
      className="bg-white/5 rounded-xl overflow-hidden flex flex-col h-full"
      style={styles.productCard}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, styles.productCardHover)
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = ""
        e.currentTarget.style.boxShadow = ""
      }}
    >
      <div className="relative h-64 w-full bg-gray-800">
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
          {product.price} zł
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-1">{product.name}</h3>
          <p className="text-white/70 text-sm mb-3">{product.description}</p>
          <div className="flex items-center mb-3">
            <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded">{product.category}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
        <Link 
  href={`/w2c/${product._id}`} // Użyj _id zamiast id jeśli tak zwraca MongoDB
  className="text-white/90 hover:text-white text-sm font-medium"
>
  Szczegóły
</Link>
          <a
            href={product.buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-white/90 hover:text-white text-sm font-medium"
          >
            Kup teraz <span className="ml-1">→</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function W2CPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ])
        
        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        setProducts(productsData)
        setFilteredProducts(productsData)
        setCategories(categoriesData.map(cat => cat.name))
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = products

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) => product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query),
      )
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => selectedCategories.includes(product.category))
    }

    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategories, products])

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  return (
    <div className="relative bg-black min-h-screen">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 to-black pointer-events-none"></div>
  
      <div className="container mx-auto pt-24 pb-16 px-4 md:px-6 relative">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8" style={styles.glowText}>
          W2C - Where to Cop
        </h1>
  
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Szukaj produktów..."
              className="w-full pl-10 bg-white/5 border border-white/10 focus:border-white/30 h-12 rounded-md text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
  
        <div className="flex flex-col md:flex-row gap-8">
          {/* Category Filters */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white/5 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-medium mb-4">Kategorie</h2>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="rounded border-white/30 bg-transparent"
                      />
                      <label htmlFor={category} className="text-white/90 cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              )}
  
              {selectedCategories.length > 0 && (
                <button
                  className="mt-4 w-full py-2 text-white/70 border border-white/10 rounded-md hover:bg-white/10"
                  onClick={() => setSelectedCategories([])}
                >
                  Wyczyść filtry
                </button>
              )}
            </div>
          </div>
  
          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-white/70">
                <p className="text-xl">Nie znaleziono produktów</p>
                <p className="mt-2">Spróbuj zmienić kryteria wyszukiwania</p>
              </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredProducts.map((product) => (
    <ProductCard 
      key={product.id} // Dodaj to
      product={product} 
    />
  ))}
</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}