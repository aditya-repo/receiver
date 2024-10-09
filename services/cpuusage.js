const os = require('os');

const cpuMiddleware = (req, res, next) => {
    // Log process memory usage (RSS - Resident Set Size)
    const memoryUsage = process.memoryUsage();
    console.log(`Memory Usage (RSS): ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`);

    // Log process CPU usage
    const cpuUsage = process.cpuUsage();
    console.log(`CPU Usage (User): ${(cpuUsage.user / 1000).toFixed(2)} ms`);
    console.log(`CPU Usage (System): ${(cpuUsage.system / 1000).toFixed(2)} ms`);

    // Log system-wide free memory and CPU load averages
    const freeMemory = os.freemem() / 1024 / 1024; // MB
    const totalMemory = os.totalmem() / 1024 / 1024; // MB
    const loadAverage = os.loadavg(); // Load averages for the past 1, 5, and 15 minutes

    console.log(`Free System Memory: ${freeMemory.toFixed(2)} MB`);
    console.log(`Total System Memory: ${totalMemory.toFixed(2)} MB`);
    console.log(`CPU Load Average (1 min, 5 min, 15 min): ${loadAverage.join(', ')}`);

    next(); // Move to the next middleware or route handler
}

module.exports = cpuMiddleware