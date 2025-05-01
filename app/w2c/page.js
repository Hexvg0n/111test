"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingBag, ImageIcon, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import Navbar from "@/components/navbar"

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        "bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl overflow-hidden flex flex-col h-full",
        "border border-zinc-800/50 hover:border-zinc-700/50",
        "transition-all duration-300 ease-out",
        isHovered && "translate-y-[-8px] shadow-lg shadow-rose-500/10",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-80 w-full overflow-hidden">
        {product.image ? (
          <div
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-transform duration-500",
              isHovered && "scale-110",
            )}
            style={{ backgroundImage: `url(${product.image})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
            <ImageIcon className="h-16 w-16 text-zinc-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-rose-400 px-3 py-1 rounded-full text-sm font-medium border border-rose-500/20">
          {product.price} zł
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-2 text-white group-hover:text-rose-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-white/70 text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center mb-3">
            <span className="text-xs text-rose-300 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              {product.category}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2 gap-2">
          <a
            href={`/qc?url=${encodeURIComponent(product.buyLink)}`}
            className="text-white/90 hover:text-white text-sm font-medium px-3 py-2 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <ImageIcon className="h-4 w-4" /> Pokaż QC
          </a>
          <a
            href={product.buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-white text-sm font-medium px-3 py-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 rounded-lg transition-colors shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30"
          >
            <ShoppingBag className="h-4 w-4 mr-1.5" /> Kup teraz
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
  const [sortOption, setSortOption] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([fetch("/api/products"), fetch("/api/categories")])

        // Handle products response
        const productsResponse = await productsRes.json()
        const productsData = productsResponse.data || [] // Extract the data array

        // Handle categories response
        const categoriesResponse = await categoriesRes.json()
        const categoriesData = Array.isArray(categoriesResponse) ? categoriesResponse : categoriesResponse?.data || []

        setProducts(productsData)
        setFilteredProducts(productsData)
        setCategories(categoriesData.map((cat) => cat.name))
        setIsLoading(false)
      } catch (error) {
        console.error("Błąd ładowania danych:", error)
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
        (product) => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
      )
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => selectedCategories.includes(product.category))
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "price":
          const priceA = parseFloat(a.price)
          const priceB = parseFloat(b.price)
          return sortDirection === "asc" ? priceA - priceB : priceB - priceA
        case "name":
          return sortDirection === "asc" 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        case "category":
          return sortDirection === "asc"
            ? a.category.localeCompare(b.category)
            : b.category.localeCompare(a.category)
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategories, products, sortOption, sortDirection])

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc")
  }

  return (
    <div className="relative bg-[#0A0A0A] min-h-screen text-white selection:bg-rose-500/30 selection:text-white">
      <Navbar />
    
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top gradient - bardziej miękkie przejścia */}
        <div
          className="absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-br from-rose-500/10 from-10% via-purple-500/5 via-40% to-transparent to-90%"
          style={{
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden",
            filter: "blur(20px)",
          }}
        />

        {/* Bottom gradient - rozmyte krawędzie */}
        <div
          className="absolute bottom-0 right-0 w-full h-[50vh] bg-gradient-to-tl from-purple-500/10 from-10% via-indigo-500/5 via-40% to-transparent to-90%"
          style={{
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden",
            filter: "blur(20px)",
          }}
        />

        {/* Animated particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-rose-500/5 blur-3xl animate-float-slow" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl animate-float-medium" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl animate-float-fast" />
        </div>
      </div>

      {/* Noise texture overlay */}
      <div className="fixed inset-0 bg-[url('/placeholder.svg?height=200&width=200')] opacity-[0.03] pointer-events-none z-10" />

      <div className="container mx-auto pt-24 pb-16 px-4 md:px-6 relative z-20">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-rose-400 drop-shadow-[0_0_25px_rgba(244,63,94,0.2)]">
            W2C - Where to Cop
          </span>
        </h1>

        {/* Search and Sort Bar */}
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mb-10">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Szukaj produktów..."
              className="w-full pl-12 pr-4 py-3 bg-zinc-800/40 backdrop-blur-sm border border-zinc-700/50 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 rounded-xl text-white transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-zinc-800/40 backdrop-blur-sm border border-zinc-700/50 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 rounded-xl text-white px-4 py-3 appearance-none"
            >
              <option value="name">Nazwa</option>
              <option value="price">Cena</option>
              <option value="category">Kategoria</option>
            </select>
            
            <button
              onClick={toggleSortDirection}
              className="bg-zinc-800/40 backdrop-blur-sm border border-zinc-700/50 hover:border-rose-500/50 rounded-xl text-white p-3 transition-all"
              title={sortDirection === "asc" ? "Sortuj rosnąco" : "Sortuj malejąco"}
            >
              {sortDirection === "asc" ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Category Filters */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl p-6 sticky top-24 border border-zinc-800/50">
              <h2 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                Kategorie
              </h2>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin h-6 w-6 border-2 border-rose-500/50 border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center space-x-3">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="peer sr-only"
                        />
                        <div className="h-5 w-5 border border-zinc-600 rounded flex items-center justify-center peer-checked:bg-rose-500 peer-checked:border-rose-500 transition-colors">
                          {selectedCategories.includes(category) && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <label
                        htmlFor={category}
                        className="text-white/80 hover:text-white cursor-pointer transition-colors"
                      >
                        {category}
                      </label>
                    </label>
                  ))}
                </div>
              )}

              {selectedCategories.length > 0 && (
                <button
                  className="mt-6 w-full py-2.5 text-white/80 border border-zinc-700/50 rounded-lg hover:bg-zinc-700/30 hover:text-white transition-all"
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
              <div className="flex flex-col items-center justify-center py-24">
                <div className="animate-spin h-12 w-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full mb-4"></div>
                <p className="text-white/70">Ładowanie produktów...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 px-4 bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm rounded-xl border border-zinc-800/50">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 mb-4">
                  <Search className="h-8 w-8 text-rose-400" />
                </div>
                <p className="text-xl font-medium text-white mb-2">Nie znaleziono produktów</p>
                <p className="text-white/60">Spróbuj zmienić kryteria wyszukiwania lub wyczyścić filtry</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes floatSlow {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, 20px) rotate(5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        @keyframes floatMedium {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(30px, -20px) rotate(-5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        @keyframes floatFast {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-15px, -25px) rotate(7deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        .animate-float-slow {
          animation: floatSlow 20s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: floatMedium 15s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: floatFast 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

