import express from 'express';
import walletRoutes from './wallet';

const app = express();

app.use('/', walletRoutes);

export default app;
