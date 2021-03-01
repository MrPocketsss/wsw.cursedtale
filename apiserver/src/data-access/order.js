import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  createdOn: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  currentOrderType: {
    type: String,
    enum: [
      'Add-On',
      'Back Order',
      'Delivery',
      'Pick Up and Count',
      'Price Quote',
      'Special',
      'Will Call',
    ],
  },
  currentStatus: {
    type: String,
    enum: ['Approval', 'Confirmation', 'Archived'],
    default: 'Approval',
  },
  lastModifiedBy: { type: String, required: true },
  notes: { type: String },
  orderNumber: { type: String, required: true },
  specialConfirmation: [{ type: String, enum: ['Green Sand', 'Mesh Thread'] }],
  customer: {
    PONumber: { type: String },
    name: { type: String, required: true },
    site: { type: String },
  },
  status: [
    {
      title: { type: String, default: 'Pending Approval' },
      completed: { type: Boolean, default: false },
      completedOn: { type: Date },
      values: [
        {
          title: { type: String, default: 'Credit Approval' },
          completed: { type: Boolean, default: false },
          creditType: {
            type: String,
            enum: ['Regular', 'ACH', 'Check for $', 'Hold', 'Check on Delivery'],
          },
          creditValue: { type: Number },
          completedOn: { type: Date },
        },
        {
          title: { type: String, default: 'Manager Approval' },
          completed: { type: Boolean, default: false },
          completedOn: { type: Date },
        },
        {
          title: { type: String, default: 'Sent to Credit' },
          completed: { type: Boolean, default: false },
          completedOn: { type: Date },
        },
      ],
    },
    {
      title: { type: String, default: 'Approved' },
      completed: { type: Boolean, default: false },
      completedOn: { type: Date },
      values: [
        {
          title: { type: String, default: 'Customer Confirmation' },
          completed: { type: Boolean, default: false },
          completedOn: { type: Date },
          confirmationType: { type: String, enum: ['Fax', 'Email'] },
        },
        {
          title: { type: String, default: 'Sent to WhatsApp' },
          completed: { type: Boolean, default: false },
          completedOn: { type: Date },
        },
        {
          title: { type: String, default: 'Sent to Print' },
          completed: { type: Boolean, default: false },
          completedOn: { type: Date },
        },
        {
          title: { type: String, default: 'Sent to Green Sand' },
          completed: { type: Boolean, default: false },
          completedOn: { type: Date },
        },
        {
          title: { type: String, default: 'Sent to Mesh Thread' },
          completed: { type: Boolean, default: false },
          completedOn: { type: Date },
        },
      ],
    },
    {
      title: { type: String, default: 'Archived' },
      completedOn: { type: Date },
    },
  ],
});

const OrderModel = mongoose.model('Order', OrderSchema);

export default OrderModel;
