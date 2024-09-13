const mongoose = require("mongoose");

const databaseConnection = async (URL) => {
    const startTime = Date.now();

    try {
        // Connection options for optimization
        await mongoose.connect(URL, {
            maxIdleTimeMS: 10000,    // Max idle time for connections in milliseconds
            serverSelectionTimeoutMS: 3000,  // Time after which Mongoose will stop trying to connect (5 seconds)
            socketTimeoutMS: 20000, // Close sockets after 45 seconds of inactivity
            maxPoolSize: 10,         // Max number of connections in the pool
            minPoolSize: 5           // Min number of connections in the pool
        });

        const endTime = Date.now();
        const timeTaken = ((endTime - startTime) / 1000);
        console.log(`Database connected successfully in ${timeTaken} seconds`);
    } catch (err) {
        console.error(`Database connection error: ${err}`);
    }
};

module.exports = databaseConnection;
