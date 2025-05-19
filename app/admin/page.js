"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Trash2, Edit, Plus, ArrowLeft, Package, Tags, Clock, Users, X, Copy, Pin, PinOff } from "lucide-react" // Dodano Copy, Pin, PinOff
import { cn } from "@/lib/utils"

const defaultFormData = {
  products: {
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    buyLink: "",
  },
  categories: { name: "" },
  sellers: {
    name: "",
    link: "",
    rating: 5,
    description: "",
    image: "",
    isPinned: false, // Dodano pole isPinned
  },
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("products")
  const [showForm, setShowForm] = useState({ products: false, categories: false, sellers: false })
  const [editingItem, setEditingItem] = useState(null)
  const [data, setData] = useState({
    products: [],
    categories: [],
    sellers: [],
    history: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState(defaultFormData)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, sellersRes, historyRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
          fetch("/api/sellers"),
          fetch("/api/history"),
        ])
        setData({
          products: (await productsRes.json()).data || [],
          categories: (await categoriesRes.json()).data || [],
          sellers: (await sellersRes.json()).data || [],
          history: (await historyRes.json()).data || [],
        })
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDelete = async (type, id) => {
    if (!confirm(`Usunąć ${type.slice(0, -1)}?`)) return;
    try {
      const response = await fetch(`/api/${type}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Błąd usuwania");

      const deletedItem = data[type].find(item => item._id === id);

      setData((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item._id !== id),
        history: [
          {
            type,
            action: "delete",
            name: `Usunięto ${deletedItem?.name || type.slice(0, -1)}`,
            date: new Date().toISOString(),
          },
          ...prev.history,
        ],
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDuplicate = async (type, id) => {
    if (type !== "products") {
      alert("Duplikowanie jest obecnie dostępne tylko dla produktów.");
      return;
    }
    const itemToDuplicate = data[type].find((item) => item._id === id);
    if (!itemToDuplicate) return;

    if (!confirm(`Zduplikować ${type.slice(0, -1)} "${itemToDuplicate.name}"?`)) return;

    // eslint-disable-next-line no-unused-vars
    const { _id, ...itemDataWithoutId } = itemToDuplicate;
    const duplicatedItemData = {
      ...itemDataWithoutId,
      name: `${itemToDuplicate.name} (Kopia)`,
    };

    try {
      const response = await fetch(`/api/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicatedItemData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Błąd duplikowania");

      setData((prev) => ({
        ...prev,
        [type]: [...prev[type], result.data],
        history: [
          {
            type,
            action: "duplicate",
            name: `Zduplikowano ${result.data.name}`,
            date: new Date().toISOString(),
          },
          ...prev.history,
        ],
      }));
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTogglePin = async (sellerId, currentIsPinned) => {
    const seller = data.sellers.find(s => s._id === sellerId);
    if (!seller) return;

    const newPinnedStatus = !currentIsPinned;

    try {
      const response = await fetch(`/api/sellers/${sellerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: newPinnedStatus }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Błąd zmiany statusu przypięcia");

      setData((prev) => ({
        ...prev,
        sellers: prev.sellers.map((s) =>
          s._id === sellerId ? { ...s, isPinned: newPinnedStatus } : s
        ).sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || a.name.localeCompare(b.name)), // Keep sorted
        history: [
          {
            type: "sellers",
            action: newPinnedStatus ? "pinned" : "unpinned",
            name: `${newPinnedStatus ? "Przypięto" : "Odpięto"} sprzedawcę ${seller.name}`,
            date: new Date().toISOString(),
          },
          ...prev.history,
        ],
      }));
    } catch (error) {
      setError(error.message);
    }
  };


  const handleSubmit = async (e, type) => {
    e.preventDefault()
    const isEdit = !!editingItem
    const endpoint = isEdit ? `/${editingItem._id}` : ""

    let currentFormData = { ...formData[type] };

    if (type === "products") {
      let priceValue;
      if (typeof currentFormData.price === 'string') {
        priceValue = parseFloat(
          currentFormData.price
            .replace(',', '.')
            .replace(/[^0-9.]/g, '')
        )
      } else {
        priceValue = currentFormData.price
      }

      if (isNaN(priceValue)) {
        setError("Proszę podać prawidłową cenę")
        return
      }
      currentFormData.price = priceValue;
    }

    try {
      const response = await fetch(`/api/${type}${endpoint}`, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentFormData),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      
      setData((prev) => {
        const updatedItems = isEdit
          ? prev[type].map((item) => (item._id === result.data._id ? result.data : item))
          : [...prev[type], result.data];

        if (type === "sellers") {
          updatedItems.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || a.name.localeCompare(b.name));
        }

        return {
        ...prev,
        history: [
          {
            type,
            action: isEdit ? "update" : "create", // Changed 'create' to 'update' for edit
            name: `${isEdit ? "Zaktualizowano" : "Dodano"} ${result.data.name}`,
            date: new Date().toISOString(),
          },
          ...prev.history,
        ],
        [type]: updatedItems,
      }});
      setShowForm({ ...showForm, [type]: false })
      setEditingItem(null)
      setFormData(defaultFormData) // Reset form
    } catch (error) {
      setError(error.message)
    }
  }

  const renderForm = (type) => {
    const labels = {
      products: {
        title: "produkt",
        fields: [
          { name: "name", label: "Nazwa", type: "text", required: true },
          { name: "description", label: "Opis", type: "textarea" },
          { name: "price", label: "Cena (zł)", type: "text", pattern: "[0-9]*[.,]?[0-9]*", required: true },
          { name: "category", label: "Kategoria", type: "select", options: data.categories.map((cat) => cat.name), required: true },
          { name: "image", label: "Obraz URL", type: "url", required: true },
          { name: "buyLink", label: "Link do produktu", type: "url", required: true },
        ],
      },
      categories: {
        title: "kategorię",
        fields: [{ name: "name", label: "Nazwa kategorii", type: "text", required: true }],
      },
      sellers: {
        title: "sprzedawcę",
        fields: [
          { name: "name", label: "Nazwa", type: "text", required: true },
          { name: "link", label: "Link do profilu", type: "url", required: true },
          { name: "rating", label: "Ocena (1-5)", type: "number", min: 1, max: 5, step: 0.1, required: true },
          { name: "image", label: "Obraz URL", type: "url", required: true },
          { name: "description", label: "Opis", type: "textarea" },
          { name: "isPinned", label: "Przypięty", type: "checkbox" }, // Dodano pole checkbox
        ],
      },
    }[type]

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gradient-to-b from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl p-6 max-w-2xl w-full relative border border-zinc-700/50 shadow-xl shadow-rose-500/5">
          <button
            onClick={() => {
              setShowForm({ ...showForm, [type]: false })
              setEditingItem(null)
              setFormData(defaultFormData) // Resetuj formData po zamknięciu
            }}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <h3 className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-rose-500">
            {editingItem ? "Edytuj" : "Nowy"} {labels.title}
          </h3>
          <form onSubmit={(e) => handleSubmit(e, type)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {labels.fields.map((field) => (
              <div key={field.name} className={`${field.type === "textarea" ? "col-span-2" : field.type === "checkbox" ? "col-span-2 self-center" : ""}`}>
                {field.type !== "checkbox" && (
                    <label className="block text-sm font-medium mb-2 text-white/80">{field.label}</label>
                )}
                {field.type === "textarea" ? (
                  <textarea
                    className="w-full p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all text-white/90"
                    rows="4"
                    value={formData[type][field.name] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [type]: { ...formData[type], [field.name]: e.target.value } })
                    }
                  />
                ) : field.type === "select" ? (
                  <select
                    required={field.required}
                    className="w-full p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all text-white/90"
                    value={formData[type][field.name] || ""}
                    onChange={(e) =>
                        setFormData({ ...formData, [type]: { ...formData[type], [field.name]: e.target.value } })
                    }
                  >
                    <option value="">Wybierz {labels.title === "produkt" ? "kategorię" : ""}</option>
                    {field.options && field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === "checkbox" ? (
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            id={`${type}-${field.name}`}
                            name={field.name}
                            checked={!!formData[type][field.name]}
                            onChange={(e) =>
                                setFormData({
                                ...formData,
                                [type]: { ...formData[type], [field.name]: e.target.checked },
                                })
                            }
                            className="h-5 w-5 rounded border-zinc-700/50 bg-zinc-800/50 text-rose-500 focus:ring-rose-500/50 checked:bg-rose-500 checked:hover:bg-rose-600 transition-colors"
                        />
                        <label htmlFor={`${type}-${field.name}`} className="text-sm font-medium text-white/80">
                            {field.label}
                        </label>
                    </div>
                ) : (
                  <input
                    type={field.type}
                    required={field.required}
                    pattern={field.pattern}
                    className="w-full p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all text-white/90"
                    value={formData[type][field.name] || ""}
                    onChange={(e) => {
                      let value = e.target.value
                      if (field.type === "number") {
                        value = parseFloat(value)
                        if (field.min !== undefined) value = Math.max(field.min, value)
                        if (field.max !== undefined) value = Math.min(field.max, value)
                      }
                      setFormData({ ...formData, [type]: { ...formData[type], [field.name]: value } })
                    }}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              className="col-span-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30"
            >
              {editingItem ? "Zapisz zmiany" : "Dodaj"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const renderSection = (type) => {
    const config = {
      products: { icon: Package, title: "Produkty", color: "rose" },
      categories: { icon: Tags, title: "Kategorie", color: "blue" },
      sellers: { icon: Users, title: "Sprzedawcy", color: "indigo" },
    }[type];

    const itemsToRender = type === 'sellers' 
        ? [...data[type]].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || (a.name || "").localeCompare(b.name || ""))
        : data[type];


    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <config.icon className={`h-6 w-6 text-${config.color}-400`} />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              {config.title}
            </span>
            <span className="text-white/50 ml-1">({data[type].length})</span>
          </h2>
          <button
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                [type]: { ...defaultFormData[type] },
              }))
              setEditingItem(null); // Upewnij się, że tryb edycji jest wyłączony
              setShowForm({ ...showForm, [type]: true })
            }}
            className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-rose-500/10 hover:shadow-rose-500/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            Nowy {type.slice(0, -1)}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {itemsToRender.map((item) => (
            <div key={item._id} className="group relative bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm p-5 rounded-xl border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300">
              <div className="absolute top-3 right-3 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {type === "products" && (
                  <button
                    onClick={() => handleDuplicate(type, item._id)}
                    title="Duplikuj"
                    className="text-sky-400 hover:text-sky-300 p-1.5 bg-zinc-900/70 rounded-lg hover:bg-zinc-800/70 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                )}
                {type === "sellers" && (
                  <button
                    onClick={() => handleTogglePin(item._id, item.isPinned)}
                    title={item.isPinned ? "Odepnij" : "Przypnij"}
                    className={`${
                      item.isPinned ? "text-yellow-400 hover:text-yellow-300" : "text-gray-400 hover:text-gray-300"
                    } p-1.5 bg-zinc-900/70 rounded-lg hover:bg-zinc-800/70 transition-colors`}
                  >
                    {item.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (!item) return;
                    setEditingItem(item);
                    setFormData((prev) => ({
                      ...prev,
                      [type]: {
                        ...defaultFormData[type],
                        ...item,
                        ...(type === "products" && item.price !== undefined
                          ? { price: item.price.toString().replace(".", ",") }
                          : {}),
                        ...(type === "sellers" && { isPinned: !!item.isPinned }), 
                      },
                    }));
                    setShowForm({ ...showForm, [type]: true });
                  }}
                  title="Edytuj"
                  className="text-emerald-400 hover:text-emerald-300 p-1.5 bg-zinc-900/70 rounded-lg hover:bg-zinc-800/70 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(type, item._id)}
                  title="Usuń"
                  className="text-rose-400 hover:text-rose-300 p-1.5 bg-zinc-900/70 rounded-lg hover:bg-zinc-800/70 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {type === "sellers" && item.image && (
                <div className="relative h-48 w-full mb-4 overflow-hidden rounded-lg">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              <h3 className="font-semibold text-lg mb-3 text-white group-hover:text-rose-400 transition-colors flex items-center">
                {type === "sellers" && item.isPinned && (
                  <Pin className="h-4 w-4 text-yellow-400 mr-2 shrink-0" title="Przypięty"/>
                )}
                {item.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(item)
                  .filter(([key]) => !["_id", "name", "image", "__v", "isPinned"].includes(key)) // Ukryj isPinned z listy tagów
                  .map(([key, value]) => (
                    <span
                      key={key}
                      className="bg-rose-500/10 text-rose-300 px-3 py-1 rounded-full text-sm inline-block border border-rose-500/20"
                    >
                      {key === "rating"
                        ? `${value}/5`
                        : key === "price"
                          ? `${value} zł`
                          : typeof value === 'string' && value.length > 20
                            ? `${value.substring(0, 20)}...`
                            : String(value)}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 selection:bg-rose-500/30 selection:text-white">
      {/* Background elements and header - bez zmian */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-br from-rose-500/10 via-purple-500/5 to-transparent transform translate-y-0"
          style={{ transform: "translate3d(0, 0, 0)", backfaceVisibility: "hidden" }}
        />
        <div
          className="absolute bottom-0 right-0 w-full h-[50vh] bg-gradient-to-tl from-blue-500/10 via-indigo-500/5 to-transparent transform translate-y-0"
          style={{ transform: "translate3d(0, 0, 0)", backfaceVisibility: "hidden" }}
        />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-rose-500/5 blur-3xl animate-float-slow" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl animate-float-medium" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl animate-float-fast" />
        </div>
      </div>
      <div className="fixed inset-0 bg-[url('/placeholder.svg?height=200&width=200')] opacity-[0.03] pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
            Powrót do sklepu
          </Link>
          <h1 className="text-4xl font-bold mt-6 bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-rose-400 drop-shadow-[0_0_25px_rgba(244,63,94,0.2)]">
            Panel Administracyjny
          </h1>
        </div>
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-300 p-4 rounded-xl mb-8 backdrop-blur-sm">
            {error}
          </div>
        )}
        <nav className="mb-8 border-b border-zinc-800/50">
          <div className="flex gap-4">
            {["products", "categories", "sellers", "history"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-3 rounded-t-lg flex items-center gap-2 transition-all",
                  activeTab === tab
                    ? "bg-zinc-800/80 backdrop-blur-sm text-rose-400 border-b-2 border-rose-400"
                    : "text-white/60 hover:text-white/90 hover:bg-zinc-800/30",
                )}
              >
                {tab === "products" && <Package className="h-5 w-5" />}
                {tab === "categories" && <Tags className="h-5 w-5" />}
                {tab === "sellers" && <Users className="h-5 w-5" />}
                {tab === "history" && <Clock className="h-5 w-5" />}
                {tab === "products" ? "Produkty" : tab === "categories" ? "Kategorie" : tab === "sellers" ? "Sprzedawcy" : "Historia"}
              </button>
            ))}
          </div>
        </nav>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-zinc-800/30 backdrop-blur-sm p-5 rounded-xl animate-pulse border border-zinc-800/50">
                <div className="h-48 bg-zinc-700/30 rounded-lg mb-4"></div>
                <div className="h-6 bg-zinc-700/30 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-zinc-700/30 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {["products", "categories", "sellers"].includes(activeTab) && renderSection(activeTab)}
            {activeTab === "history" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
                  <Clock className="h-6 w-6 text-rose-400" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Historia zmian</span>
                  <span className="text-white/50 ml-1">({data.history.length})</span>
                </h2>
                <div className="space-y-4">
                  {data.history.slice().sort((a,b) => new Date(b.date) - new Date(a.date)).map((item, index) => ( // Sort history by date descending
                    <div
                      key={index}
                      className="bg-gradient-to-b from-zinc-800/40 to-zinc-900/40 backdrop-blur-sm p-4 rounded-xl border-l-4 border-rose-500/30 hover:border-rose-500/70 transition-all hover:translate-y-[-2px] hover:shadow-lg hover:shadow-rose-500/5"
                    >
                      <div className="flex items-center gap-3">
                        <div
                           className={cn(
                            "p-2 rounded-lg",
                            item.action === "delete" ? "bg-red-500/10 border border-red-500/20" :
                            item.action === "pinned" || item.action === "unpinned" ? "bg-yellow-500/10 border border-yellow-500/20" :
                            item.action === "duplicate" ? "bg-sky-500/10 border border-sky-500/20" :
                            item.type === "products" ? "bg-rose-500/10 border border-rose-500/20" :
                            item.type === "categories" ? "bg-blue-500/10 border border-blue-500/20" :
                            "bg-indigo-500/10 border border-indigo-500/20"
                          )}
                        >
                          {item.action === "pinned" || item.action === "unpinned" ? (
                            <Pin className="h-5 w-5 text-yellow-400" />
                          ) : item.action === "duplicate" && item.type === "products" ? (
                            <Copy className="h-5 w-5 text-sky-400" />
                           ) : item.type === "products" ? (
                            <Package className="h-5 w-5 text-rose-400" />
                          ) : item.type === "categories" ? (
                            <Tags className="h-5 w-5 text-blue-400" />
                          ) : (
                            <Users className="h-5 w-5 text-indigo-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white/90">
                            {item.action === "create" ? "Utworzono" :
                             item.action === "update" ? "Zaktualizowano" :
                             item.action === "delete" ? "Usunięto" :
                             item.action === "duplicate" ? "Zduplikowano" :
                             item.action === "pinned" ? "Przypięto" :
                             item.action === "unpinned" ? "Odpięto" :
                             "Nieznana akcja"}{" "}
                            {item.type === "products" ? "produkt" :
                             item.type === "sellers" ? "sprzedawcę" :
                             "kategorię"}
                          </p>
                          <p className="text-sm text-white/60 truncate">{item.name}</p>
                          <p className="text-xs text-white/50 mt-1">{new Date(item.date).toLocaleString("pl-PL")}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        {showForm.products && renderForm("products")}
        {showForm.categories && renderForm("categories")}
        {showForm.sellers && renderForm("sellers")}
      </div>
      <style jsx global>{`
        @keyframes floatSlow { 0% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-20px, 20px) rotate(5deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
        @keyframes floatMedium { 0% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(30px, -20px) rotate(-5deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
        @keyframes floatFast { 0% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-15px, -25px) rotate(7deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
        .animate-float-slow { animation: floatSlow 20s ease-in-out infinite; }
        .animate-float-medium { animation: floatMedium 15s ease-in-out infinite; }
        .animate-float-fast { animation: floatFast 12s ease-in-out infinite; }
      `}</style>
    </div>
  )
}