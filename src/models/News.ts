import { Schema, model } from "mongoose";

const NewsSchema = new Schema({
  title: { type: String, required: true },
  link: { type: String, required: true, unique: true },
  // pubDate: { type: Date, required: true },
  description: { type: String, required: true },
  source: { type: String, required: true },
  sent: { type: Boolean, default: false },
});

export const News = model("News", NewsSchema);
