import Fastify = require('fastify');
import fastifyPostgres = require('@fastify/postgres');
import dotenv = require('dotenv');

dotenv.config();

const server = Fastify({ logger: true });

// Povezivanje sa Supabase bazom preko našeg linka
server.register(fastifyPostgres, {
  connectionString: process.env.DATABASE_URL
});

// Osnovna ruta da proverimo da li Pinger server radi
server.get('/', async (request, reply) => {
  return { status: 'OK', app: 'Pinger Messenger API radi 24/7!' };
});

// Ruta za proveru konekcije sa bazom
server.get('/db-test', async (request, reply) => {
  try {
    const client = await server.pg.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    return { success: true, time: result.rows[0].now };
  } catch (err) {
    reply.status(500);
    return { success: false, error: err };
  }
});

// Pokretanje servera na portu 3000
const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Pinger server je pokrenut na portu 3000!');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();