import express from 'express';
import walletRoutes from './wallet';
import userRoutes from './user';
import adminRoutes from './admin';


const app = express();

app.use('/', walletRoutes);
app.use('/', userRoutes);
app.use('/', adminRoutes);


export default app;
