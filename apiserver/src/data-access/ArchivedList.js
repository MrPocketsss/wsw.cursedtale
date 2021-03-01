import mongoose from 'mongoose';

const ArchivedSchema = new mongoose.Schema({
  orderID: { type: String, required: true },
  orderNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  customerSite: { type: String },
  PONumber: { type: String },
  approved: { type: Boolean, default: false },
  confirmed: { type: Boolean, default: false },
  completedOn: { type: Date },
});

const ArchivedList = mongoose.model('Archive', ArchivedSchema);

export default ArchivedList;
