"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingBag, ImageIcon, ArrowUpDown, ArrowUp, ArrowDown, Check } from "lucide-react" // Dodano Check
import { cn } from "@/lib/utils"
import Navbar from "@/components/navbar"

// Komponent ProductCard pozostaje bez zmian, jak w poprzedniej poprawnej wersji
function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        "bg-gradient-to-b from-zinc-800/60 to-zinc-900/70 backdrop-blur-sm rounded-xl overflow-hidden flex flex-col h-full",
        "border border-zinc-700/50 hover:border-rose-500/40",
        "transition-all duration-300 ease-out",
        isHovered && "transform -translate-y-2 shadow-2xl shadow-rose-900/30",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-80 w-full overflow-hidden group">
        {product.image ? (
          <div
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out",
              isHovered ? "scale-110" : "scale-100",
            )}
            style={{ backgroundImage: `url(${product.image})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
            <ImageIcon className="h-16 w-16 text-zinc-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-rose-300 px-3 py-1.5 rounded-full text-sm font-medium border border-rose-500/30">
          {product.price} zł
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-rose-300 transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{product.description}</p>
          {product.category && (
            <div className="flex items-center mb-3">
              <span className="text-xs text-rose-300 bg-rose-700/30 px-3 py-1 rounded-full border border-rose-600/40">
                {product.category}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4 gap-2">
          <a
            href={`/qc?url=${encodeURIComponent(product.buyLink || '')}`} // Dodano || '' dla bezpieczeństwa
            className="text-zinc-300 hover:text-white text-sm font-medium px-3 py-2 bg-zinc-700/50 hover:bg-zinc-700/80 rounded-lg transition-colors flex items-center gap-1.5 border border-zinc-600/70"
          >
            <ImageIcon className="h-4 w-4" /> Pokaż QC
          </a>
          <a
            href={product.buyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-white text-sm font-medium px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 rounded-lg transition-colors shadow-lg shadow-rose-600/30 hover:shadow-rose-500/40"
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
  const [sortOption, setSortOption] = useState("category")
  const [sortDirection, setSortDirection] = useState("asc")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/products").then(res => res.json()),
          fetch("/api/categories").then(res => res.json())
        ]);

        setProducts(productsRes.data || []);
        // Ustawiamy filteredProducts na początku na wszystkie produkty
        setFilteredProducts(productsRes.data || []);
        setCategories((categoriesRes.data || []).map((cat) => cat.name).filter(Boolean));
      } catch (error) {
        console.error("Błąd ładowania danych:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let tempProducts = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tempProducts = tempProducts.filter(
        (product) =>
          (product.name && product.name.toLowerCase().includes(query)) ||
          (product.description && product.description.toLowerCase().includes(query))
      );
    }

    if (selectedCategories.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        product.category && selectedCategories.includes(product.category)
      );
    }

    tempProducts.sort((a, b) => {
      let valA, valB;
      switch (sortOption) {
        case "price":
          valA = parseFloat(a.price) || 0;
          valB = parseFloat(b.price) || 0;
          return sortDirection === "asc" ? valA - valB : valB - valA;
        case "name":
          valA = a.name || "";
          valB = b.name || "";
          return sortDirection === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        case "category":
          valA = a.category || "";
          valB = b.category || "";
          return sortDirection === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        default:
          return 0;
      }
    });
    setFilteredProducts(tempProducts);
  }, [searchQuery, selectedCategories, products, sortOption, sortDirection]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc")
  }

  return (
    <div className="relative bg-black min-h-screen text-white selection:bg-rose-600/40 selection:text-white">
      <Navbar />
    
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className={cn(
            "w-44 h-44 bg-rose-400 rounded-full absolute top-12 blur-[120px]")}
        />
        <div
          className={cn(
            "absolute -bottom-1/4 right-0 w-full h-3/4",
            "bg-gradient-radial from-rose-800/20 via-rose-800/5 to-transparent",
            "opacity-50 blur-3xl animate-pulse-medium"
          )}
          style={{ filter: 'blur(100px)' }}
        />
        <div className="absolute top-1/3 left-1/5 w-1/2 h-1/2 rounded-full bg-rose-900/10 opacity-30 blur-3xl animate-float-extra-slow mix-blend-plus-lighter" />
        <div className="absolute top-1/2 right-1/6 w-1/3 h-1/3 rounded-full bg-red-900/10 opacity-20 blur-3xl animate-float-fast mix-blend-plus-lighter" />
      </div>

      {/* Zakomentowano teksturę szumu, aby uniknąć błędu 404 */}
      {/* <div className="fixed inset-0 bg-[url('/placeholder.svg?height=200&width=200')] opacity-[0.03] pointer-events-none z-1" /> */}

      <div className="container mx-auto pt-24 pb-16 px-4 md:px-6 relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-rose-400 drop-shadow-[0_0_25px_rgba(244,63,94,0.3)]">
            W2C - Where to Cop
          </span>
        </h1>

        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Szukaj produktów..."
              className="w-full pl-12 pr-4 py-3 bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/60 focus:border-rose-500/60 focus:ring-2 focus:ring-rose-500/30 rounded-xl text-white transition-all placeholder-zinc-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/60 focus:border-rose-500/60 focus:ring-2 focus:ring-rose-500/30 rounded-xl text-white px-4 py-3 appearance-none pr-8 cursor-pointer"
              >
                <option value="name">Nazwa</option>
                <option value="price">Cena</option>
                <option value="category">Kategoria</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4 pointer-events-none" />
            </div>
            
            <button
              onClick={toggleSortDirection}
              className="bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/60 hover:border-rose-500/60 hover:bg-zinc-700/60 rounded-xl text-white p-3 transition-all flex items-center justify-center"
              title={sortDirection === "asc" ? "Sortuj rosnąco" : "Sortuj malejąco"}
            >
              {sortDirection === "asc" ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-72 shrink-0">
            <div className="bg-gradient-to-b from-zinc-800/50 to-zinc-900/60 backdrop-blur-md rounded-xl p-6 sticky top-24 border border-zinc-700/50 shadow-xl">
              <h2 className="text-xl font-semibold mb-6 text-white/90">
                Kategorie
              </h2>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin h-7 w-7 border-2 border-rose-500/70 border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {categories.length > 0 ? categories.map((category) => (
                    <label key={category} className="flex items-center space-x-3.5 cursor-pointer group p-1.5 rounded-md hover:bg-zinc-700/30 transition-colors">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id={`cat-${category}`}
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="peer sr-only"
                        />
                        <div className="h-5 w-5 border-2 border-zinc-600 group-hover:border-zinc-500 rounded-sm flex items-center justify-center peer-checked:bg-rose-500 peer-checked:border-rose-600 transition-all duration-150">
                          {selectedCategories.includes(category) && (
                            <Check className="h-3.5 w-3.5 text-white" strokeWidth={3}/>
                          )}
                        </div>
                      </div>
                      <span 
                        className="text-zinc-300 group-hover:text-white transition-colors"
                      >
                        {category}
                      </span>
                    </label>
                  )) : <p className="text-zinc-400 text-sm">Brak dostępnych kategorii.</p>}
                </div>
              )}

              {selectedCategories.length > 0 && (
                <button
                  className="mt-8 w-full py-2.5 text-zinc-300 border border-zinc-600/70 rounded-lg hover:bg-zinc-700/40 hover:text-white transition-all duration-150 hover:border-zinc-500"
                  onClick={() => setSelectedCategories([])}
                >
                  Wyczyść filtry
                </button>
              )}
            </div>
          </div>

          <div className="flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="animate-spin h-12 w-12 border-4 border-rose-500/40 border-t-rose-600 rounded-full mb-4"></div>
                <p className="text-zinc-400">Ładowanie produktów...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 px-4 bg-gradient-to-b from-zinc-800/50 to-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-700/50">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-600/10 mb-6">
                  <Search className="h-8 w-8 text-rose-400" />
                </div>
                <p className="text-xl font-medium text-white mb-2">Nie znaleziono produktów</p>
                <p className="text-zinc-400">Spróbuj zmienić kryteria wyszukiwania lub wyczyścić filtry.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => ( // Dodano index jako fallback dla klucza
                  <ProductCard key={product._id || `product-${index}`} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Poprawiony blok <style jsx global> */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes pulse-medium {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.03); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }
        .animate-pulse-medium {
          animation: pulse-medium 8s ease-in-out infinite;
        }

        @keyframes float-extra-slow {
          0% { transform: translate(0px, 0px) rotate(0deg); }
          25% { transform: translate(10px, -15px) rotate(2deg); }
          50% { transform: translate(-5px, 10px) rotate(-1deg); }
          75% { transform: translate(5px, 5px) rotate(1deg); }
          100% { transform: translate(0px, 0px) rotate(0deg); }
        }
        .animate-float-extra-slow {
          animation: float-extra-slow 25s ease-in-out infinite;
        }
        @keyframes float-fast {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-15px, -25px) rotate(7deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-float-fast {
          animation: float-fast 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}