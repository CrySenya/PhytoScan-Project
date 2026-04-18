// Starts Express server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import plantsRouter     from './routes/plants';
import scanRouter       from './routes/scan';
import submissionsRouter from './routes/submissions';
import leaderboardRouter from './routes/leaderboard';

const app  = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow large image uploads

// ── Routes ──────────────────────────────────────────────────────────────
app.use('/api/plants',      plantsRouter);
app.use('/api/scan',        scanRouter);
app.use('/api/submissions', submissionsRouter);
app.use('/api/leaderboard', leaderboardRouter);

// ── Health check ─────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', app: 'PhytoScan API' }));

app.listen(PORT, () => console.log(`PhytoScan API running on port ${PORT}`));
