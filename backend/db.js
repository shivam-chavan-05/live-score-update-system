const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
  matchId: String,
  score: String,
  updatedAt: { type: Date, default: Date.now }
});

const Score = mongoose.model("Score", ScoreSchema);

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
};

module.exports = { connectDB, Score };