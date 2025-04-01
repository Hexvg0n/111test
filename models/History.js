// models/history.js
import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['products', 'categories', 'sellers'], // <--- Zmiana na pluralne
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.History || mongoose.model('History', HistorySchema);