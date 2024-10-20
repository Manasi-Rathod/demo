const dbConnect = require('./mongodb');
const express = require('express');
const { ObjectId } = require('mongodb'); // Import ObjectId for better readability
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// GET API endpoint to retrieve all profiles
app.get('/', async (req, res) => {
    try {
        const collection = await dbConnect();
        const result = await collection.find().toArray();
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// POST API endpoint to add a new profile
app.post('/profile', async (req, res) => {
    const { name, age, email } = req.body; // Destructure for clarity

    // Validate required fields
    if (!name || !age || !email) {
        return res.status(400).json({ success: false, message: 'Name, age, and email are required.' });
    }

    try {
        const collection = await dbConnect();
        const newProfile = { name, age, email }; // Create profile object
        const result = await collection.insertOne(newProfile);
        res.status(201).json({ success: true, message: 'Profile created', id: result.insertedId });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// PUT API endpoint to update an existing profile by ID
app.put('/profile/:id', async (req, res) => {
    const id = req.params.id;
    const updatedProfile = req.body;

    try {
        const collection = await dbConnect();
        const result = await collection.updateOne(
            { _id: ObjectId(id) },
            { $set: updatedProfile }
        );
        if (result.matchedCount > 0) {
            res.status(200).json({ success: true, message: 'Profile updated' });
        } else {
            res.status(404).json({ success: false, message: 'Profile not found' });
        }
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// DELETE API endpoint to remove a profile by ID
app.delete('/profile/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const collection = await dbConnect();
        const result = await collection.deleteOne({ _id: ObjectId(id) });
        if (result.deletedCount > 0) {
            res.status(200).json({ success: true, message: 'Profile deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Profile not found' });
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
