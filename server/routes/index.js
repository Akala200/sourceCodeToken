import express from 'express';
import walletRoutes from './wallet';
import userRoutes from './user';



const app = express();

app.use('/', walletRoutes);
app.use('/', userRoutes);



export default app;
