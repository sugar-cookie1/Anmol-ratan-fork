import 'dotenv/config';
import mongoose from 'mongoose';
import { Bhajan } from './models/bhajan.js';
import { connectDB } from './config/db-config.js';

const run = async () => {
    try {
        await connectDB();
        console.log("Connected to DB. Starting migration...");

        // 1. Update Hindi titles (Soni Si Dagori Waliya)
        // Matches exact Hindi string
        const res1 = await Bhajan.updateMany(
            { title: "सोनी सी डगोरी वालिया" },
            { $set: { titleEn: "Soni Si Dagori Waliya" } }
        );
        console.log(`Updated ${res1.matchedCount} 'Soni Si Dagori Waliya' bhajans (Modified: ${res1.modifiedCount})`);

        // 2. Update 'hanuman chalisa' (assuming it exists as title or similar)
        // Using simple regex or match
        const res2 = await Bhajan.updateMany(
            { title: { $regex: /hanuman chalisa/i } },
            { $set: { title: "हनुमान चालीसा", titleEn: "Hanuman Chalisa" } }
        );
        console.log(`Updated ${res2.matchedCount} 'Hanuman Chalisa' bhajans (Modified: ${res2.modifiedCount})`);

        // 3. Update 'Data Tere Pyar Ne'
        const res3 = await Bhajan.updateMany(
            { title: { $regex: /Data Tere Pyar Ne/i } },
            { $set: { title: "दाता तेरे प्यार ने", titleEn: "Data Tere Pyar Ne" } }
        );
        console.log(`Updated ${res3.matchedCount} 'Data Tere Pyar Ne' bhajans (Modified: ${res3.modifiedCount})`);

    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Done.");
        process.exit(0);
    }
};

run();
