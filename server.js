const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose'); // --- NEW: Import Mongoose ---

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
const upload = multer();
const port = 3000;

// --- NEW: Connect to your MongoDB database ---
// Make sure MongoDB server is running!
// 'myOrderAppDB' is your database name. It will be created if it doesn't exist.
mongoose.connect('mongodb://localhost:27017/myOrderAppDB')
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => console.error('Connection error:', err));

// --- NEW: Define a Schema and Model for your order ---
// A Schema is the blueprint for your data.
const orderSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    order_details: String,
    orderDate: { type: Date, default: Date.now } // Adds a timestamp
});

// A Model is the class you use to interact with the database
const Order = mongoose.model('Order', orderSchema);

// --- UPDATED: Your endpoint now saves the order ---
// We make the function 'async' so we can use 'await'
app.post('/submit_order', upload.none(), async (req, res) => {
    
    // You still get the data from the request body
    const name = req.body.name;
    const email = req.body.email;
    const address = req.body.address;
    const order_details = req.body.order_details;

    // --- NEW: Save to database inside a try...catch block ---
    try {
        // 1. Create a new order document using your Model
        const newOrder = new Order({
            name: name,
            email: email,
            address: address,
            order_details: order_details
        });

        // 2. Save the new order to the database (this is the 'await' part)
        const savedOrder = await newOrder.save();

        console.log('--- NEW ORDER SAVED TO DB ---');
        console.log(savedOrder);
        console.log('-----------------------------');

        res.send('success'); // Send back the same success message

    } catch (error) {
        // If something goes wrong (e.g., database disconnects)
        console.error('Error saving order:', error);
        res.status(500).send('Error processing your order. Please try again.');
    }
});
// --- NEW: A "GET" route to send all saved orders to the frontend ---
app.get('/get-orders', async (req, res) => {
    try {
        const allOrders = await Order.find(); // Finds ALL documents in the Order collection
        res.json(allOrders); // Sends the data back as a JSON array
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Error fetching orders');
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server running! Open your app at http://localhost:${port}/`);
});