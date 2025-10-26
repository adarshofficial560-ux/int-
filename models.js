
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: String,
  itemName: String,
  quantity: Number,
  orderDate: { type: Date, default: Date.now }
  // Add any other fields you collect in your order.html form
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;