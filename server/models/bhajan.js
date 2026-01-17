import mongoose from "mongoose";

const bhajanSchema = new mongoose.Schema({
    title: { type: String, required: true },
    titleEn: { type: String, trim: true }, // English Title for search and display
    lyrics: { type: String, required: true }, // Full lyrics text
    category: { type: String, default: "General" },
    createdAt: { type: Date, default: Date.now },
});

export const Bhajan = mongoose.model("Bhajan", bhajanSchema);
