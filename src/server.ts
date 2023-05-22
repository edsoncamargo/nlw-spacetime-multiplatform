import 'dotenv/config';

import fastify from 'fastify';
import cors from '@fastify/cors';
import { memoriesRoutes } from './routes/memories';
import { authRoutes } from './routes/auth';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import { uploadRoutes } from './routes/upload';
import { resolve } from 'node:path';

const app = fastify();

app.register(multipart);
app.register(require('@fastify/static'), {
    root: resolve(__dirname, '../uploads'),
    prefix: '/uploads'
})
app.register(cors, {
    origin: true
});
app.register(jwt, {
    secret: 'spacetime' /** Maneira de diferenciar JWT gerados deste backend e de outros (criptografia do token), ele será assinado por essa palavra chave  */
});
app.register(authRoutes);
app.register(memoriesRoutes);
app.register(uploadRoutes);

app
    .listen({
        port: 3333,
        host: "0.0.0.0"
    })
    .then(() => {
        console.log('HTTP server running (port: 3333, host: 0.0.0.0) 🚀');
    })
