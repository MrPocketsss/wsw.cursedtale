import mongoose from 'mongoose';

const ApprovedSchema = new mongoose.Schema({
  orderID: { type: String, required: true },
  orderNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  customerSite: { type: String },
  PONumber: { type: String },
  confirmType: { type: String, enum: ['Fax', 'Email'] },
  whatsApp: { type: Boolean, default: false },
  print: { type: Boolean, default: false },
  greenSand: { type: Boolean, default: false },
  meshThread: { type: Boolean, default: false },
  specialConfirmation: [{ type: String, enum: ['Green Sand', 'Mesh Thread'] }],
});

const ConfirmationList = mongoose.model('Approved', ApprovedSchema);

export default ConfirmationList;
