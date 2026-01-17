import { Button } from "../components/ui/button"
import { ArrowLeft, Play, Heart, Share, Download } from "lucide-react"

import type { Bhajan } from "../api/api"

interface BhajanDetailProps {
  bhajan: Bhajan
  onBack: () => void
}

export default function BhajanDetail({ bhajan, onBack }: BhajanDetailProps) {


  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 px-6 pt-12 pb-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>

          <div className="flex-1">
            <h1 className="text-xl font-bold leading-tight" style={{ fontFamily: "serif" }}>
              {bhajan.title}
            </h1>
            {bhajan.titleEn && (
              <p className="text-white/80 text-sm font-normal">
                {bhajan.titleEn}
              </p>
            )}
            <p className="text-orange-100 text-xs mt-1">{bhajan.category}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Play className="w-5 h-5 mr-2" />
            Play
          </Button>

          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
            <Heart className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
            <Share className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
            <Download className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Lyrics */}
      <div className="px-6 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
          <h2 className="text-lg font-semibold text-orange-800 mb-4">Lyrics</h2>

          <div className="space-y-4">
            {bhajan.lyrics.split("\n").map((line, index) => (
              <p
                key={index}
                className={`${line.trim() === "" ? "h-2" : "text-gray-700 leading-relaxed"}`}
                style={{
                  fontFamily:
                    line.includes("राम") || line.includes("कृष्ण")
                      ? "serif"
                      : "inherit",
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
          <h3 className="text-lg font-semibold text-orange-800 mb-3">
            About this Bhajan
          </h3>

          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium">Category:</span> {bhajan.category}
            </p>
            <p>
              <span className="font-medium">Language:</span> Hindi/Sanskrit
            </p>
            <p>
              <span className="font-medium">Duration:</span> 4:30 mins
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
