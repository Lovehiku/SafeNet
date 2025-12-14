const http = require('http');
const app = require('./app');
const config = require('./utils/config');
const { connectDB } = require('./utils/db');

async function bootstrap() {
  await connectDB();
  const server = http.createServer(app);
  server.listen(config.port, () => {
    console.log(`SafeNet Guardian API running on http://localhost:${config.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});

