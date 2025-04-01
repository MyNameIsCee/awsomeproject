require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./database");
const path = require('path');

const app = express();
app.use(express.json());

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, './build')));

const router = require("./routes");
app.use("/api", router);

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});

const port = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectToMongoDB();
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();