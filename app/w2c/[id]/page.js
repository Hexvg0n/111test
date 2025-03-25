"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const ProductDetailPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Pobierz główny produkt
        const productRes = await fetch(`/api/products/${id}`)
        if (!productRes.ok) throw new Error('Produkt nie znaleziony')
        const productData = await productRes.json()

        // Pobierz wszystkie produkty dla sekcji powiązanych
        const allProductsRes = await fetch('/api/products')
        const allProducts = await allProductsRes.json()

        // Filtruj powiązane produkty
        const related = allProducts.filter(p => 
          p.category === productData.category && 
          p._id !== productData._id
        ).slice(0, 3)

        setProduct(productData)
        setRelatedProducts(related)
        setError(null)
      } catch (err) {
        console.error('Błąd:', err)
        setError(err.message)
        setProduct(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) fetchProductData()
  }, [id])

  if (isLoading) {
    return (
      <div className="relative bg-black min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 to-black" />
        <div className="container mx-auto pt-32 pb-16 px-4 md:px-6 flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="relative bg-black min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 to-black" />
        <div className="container mx-auto pt-32 pb-16 px-4 md:px-6 text-center">
          <p className="text-xl text-white/70 mb-4">{error || 'Produkt nie istnieje'}</p>
          <Link href="/w2c" className="text-white underline hover:text-white/80">
            ← Wróć do listy produktów
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-black min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 to-black" />
      
      <div className="container mx-auto pt-24 pb-16 px-4 md:px-6 relative">
        {/* Przycisk powrotu */}
        <Link 
          href="/w2c" 
          className="inline-flex items-center text-white/70 hover:text-white mb-8 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Wróć do listy
        </Link>

        {/* Główna sekcja produktu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Zdjęcie produktu */}
          <div className="relative h-96 rounded-xl overflow-hidden bg-gray-800">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </div>

          {/* Detale produktu */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <span className="text-2xl font-bold text-white">
                {product.price} zł
              </span>
            </div>

            <h1 className="text-4xl font-bold text-white">{product.name}</h1>
            <p className="text-lg text-white/80">{product.description}</p>

            {/* Przyciski akcji */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.open(product.buyLink, '_blank')}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3 rounded-lg hover:bg-white/90 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Kup teraz
              </button>
            </div>

            {/* Dodatkowe informacje */}
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-xl font-semibold text-white mb-4">Specyfikacja</h3>
              <ul className="space-y-2 text-white/80">
                <li>• Materiał: Wysokiej jakości tworzywo</li>
                <li>• Dostępne rozmiary: 36-45</li>
                <li>• Gwarancja: 12 miesięcy</li>
                <li>• Darmowa dostawa od 300 zł</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Powiązane produkty */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">Podobne produkty</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/w2c/${product._id}`}
                  className="bg-white/5 rounded-xl overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="aspect-square bg-gray-800 relative">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-white truncate">{product.name}</h3>
                    <p className="text-white/70 mt-1">{product.price} zł</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage