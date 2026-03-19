const http = require('http');
const app = require('./app');
const { connectDB, checkConnection, disconnectDB } = require('./config/db');

const server = http.createServer(app);

const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  try {
    server.close(async () => {
      console.log('✅ HTTP server closed.');
      await disconnectDB();
      process.exit(0);
    });

    setTimeout(() => {
      console.error('⏰ Graceful shutdown timeout, forcing exit');
      process.exit(1);
    }, 10000);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    console.log('🔗 Connecting to MySQL database...');

    // Connect to database first
    const prisma = await connectDB();

    console.log('✅ Connected to MySQL database');

    // Verify connection
    const health = await checkConnection();
    if (!health.connected) {
      throw new Error(`Database health check failed: ${health.error}`);
    }
    console.log('✅ Database health check passed');

    const PORT = process.env.PORT || 3000;

    server
      .listen(PORT, () => {
        console.log(
          `🚀 Server is running on port http://localhost:${PORT}`
        );
        console.log(
          `📊 Environment: ${process.env.NODE_ENV || 'development'}`
        );
      })
      .on('error', (error) => {
        console.error('❌ Server failed to start:', error);
        process.exit(1);
      });

    // Setup graceful shutdown handlers
    ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) =>
      process.on(signal, () => gracefulShutdown(signal))
    );
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);

    if (err.message.includes('did not initialize yet')) {
      console.log('\n💡 SOLUTION: Run these commands:');
      console.log('1. npx prisma generate');
      console.log('2. npx prisma migrate dev --name init');
      console.log('3. npm run dev\n');
    }

    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = server;
