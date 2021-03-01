import mongoose from 'mongoose';

const PendingSchema = new mongoose.Schema({
  orderID: { type: String, required: true },
  orderNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  customerSite: { type: String },
  PONumber: { type: String },
  creditApproved: { type: Boolean, required: true },
  managerApproved: { type: Boolean, required: true },
});

const PendingList = mongoose.model('Pending', PendingSchema);

export default PendingList;
