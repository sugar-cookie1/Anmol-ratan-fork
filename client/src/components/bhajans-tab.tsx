import { useState, useEffect } from "react"
import { Input } from "../components/ui/input"
import { Search, Music2 } from "lucide-react"
import BhajanDetail from "./bhajan-detail"
import { getBhajans, type Bhajan } from "../api/api"

interface BhajansTabProps {
  userName?: string
}

export default function BhajansTab({ userName }: BhajansTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBhajan, setSelectedBhajan] = useState<Bhajan | null>(null)
  const [bhajans, setBhajans] = useState<Bhajan[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    async function loadBhajans() {
      setLoading(true)
      const res = await getBhajans()
      if (res.ok) {
        setBhajans(res.data)
      }
      setLoading(false)
    }
    loadBhajans()
  }, [])

  const categories = [
    {
      title: "आरती",
      subtitle: "Aarti",
      gradient: "from-orange-400 to-red-500",
      filterValue: "Aarti"
    },
    {
      title: "जिंदाराम",
      subtitle: "Jindaram",
      gradient: "from-yellow-400 to-orange-500",
      filterValue: "Jindaram"
    },
    {
      title: "भजन",
      subtitle: "Bhajan",
      gradient: "from-pink-400 to-rose-500",
      filterValue: "Bhajan"
    },
    {
      title: "सभी",
      subtitle: "All",
      gradient: "from-blue-400 to-indigo-500",
      filterValue: "All"
    },
  ]

  const handleBhajanClick = (bhajan: Bhajan) => {
    setSelectedBhajan(bhajan)
  }

  // Filter Logic
  const filteredBhajans = bhajans.filter((b) => {
    const matchesSearch = searchQuery
      ? b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.lyrics.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.titleEn && b.titleEn.toLowerCase().includes(searchQuery.toLowerCase()))
      : true

    // If searching, show all matches regardless of category
    if (searchQuery) return matchesSearch

    // If no search, use category filter
    if (selectedCategory && selectedCategory !== "All") {
      return b.category.toLowerCase().includes(selectedCategory.toLowerCase())
    }

    // Default (No search, no specific category or "All" selected) -> Show All
    return true
  })

  if (selectedBhajan) {
    return (
      <BhajanDetail
        bhajan={selectedBhajan}
        onBack={() => setSelectedBhajan(null)}
      />
    )
  }

  return (
    <div className="flex-1 bg-orange-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-b-3xl px-6 pt-12 pb-8 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full" />
        <div className="absolute bottom-2 left-8 w-8 h-8 bg-white/15 rounded-full" />

        <div className="relative z-10">
          <h1
            className="text-xl font-bold text-center mb-2"
            style={{ fontFamily: "serif" }}
          >
            धन धन सतगुरु तेरा ही आसरा
          </h1>
          <p className="text-center text-orange-100 text-lg font-medium">
            {userName || "Sangat Ji"}!
          </p>
        </div>
      </div>

      <div className="px-6 -mt-4 relative z-10">
        {/* Search Bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search bhajans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white rounded-2xl border-orange-200 focus:border-orange-400"
            />
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {categories.map((category, index) => {
            const isSelected = selectedCategory === category.filterValue;
            return (
              <div
                key={index}
                onClick={() => setSelectedCategory(isSelected ? null : category.filterValue)}
                className={`h-16 rounded-2xl bg-gradient-to-r ${category.gradient} p-4 flex items-center justify-center shadow-lg cursor-pointer transition-all ${isSelected ? 'ring-4 ring-offset-2 ring-orange-500 scale-105' : 'opacity-90 hover:opacity-100'}`}
              >
                <div className="text-center">
                  <h3
                    className="text-white font-bold text-lg"
                    style={{ fontFamily: "serif" }}
                  >
                    {category.title}
                  </h3>
                  <p className="text-white/80 text-sm">{category.subtitle}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bhajan Grid */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 pb-6">
            {filteredBhajans.map((bhajan, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleBhajanClick(bhajan)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                    <Music2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-orange-600 font-bold">
                    {bhajan.category}
                  </span>
                </div>
                <h3
                  className="font-bold text-gray-900 text-lg mb-0.5 leading-tight"
                  style={{ fontFamily: "serif" }}
                >
                  {bhajan.title}
                </h3>
                {bhajan.titleEn && (
                  <p className="text-sm text-gray-500 font-normal mb-1">
                    {bhajan.titleEn}
                  </p>
                )}
              </div>
            ))}
            {filteredBhajans.length === 0 && (
              <div className="col-span-2 text-center py-10 text-gray-500">
                No bhajans found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
