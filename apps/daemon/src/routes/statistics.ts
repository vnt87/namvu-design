import express, { type Express, type RequestHandler } from 'express';
import type Database from 'better-sqlite3';
import type { StatisticEventBatchRequest } from '@open-design/contracts';
import {
  getStatisticsDashboard,
  insertStatisticEvents,
  listStatisticEvents,
  parseStatisticFilters,
  resetStatistics,
} from '../statistics/persistence.js';

export function registerStatisticsRoutes(
  app: Express,
  db: Database.Database,
  requireLocalDaemonRequest: RequestHandler,
): void {
  app.post('/api/statistics/events', requireLocalDaemonRequest, express.json({ limit: '64kb' }), (req, res) => {
    const body = (req.body ?? {}) as Partial<StatisticEventBatchRequest>;
    if (!Array.isArray(body.events) || body.events.length === 0 || body.events.length > 50) {
      res.status(400).json({ error: 'events must contain between 1 and 50 items' });
      return;
    }
    res.json(insertStatisticEvents(db, body.events));
  });

  app.get('/api/statistics', requireLocalDaemonRequest, (req, res) => {
    res.json(getStatisticsDashboard(db, parseStatisticFilters(req.query as Record<string, unknown>)));
  });

  app.get('/api/statistics/events', requireLocalDaemonRequest, (req, res) => {
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : null;
    const limitRaw = typeof req.query.limit === 'string' ? Number(req.query.limit) : 50;
    const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(200, Math.round(limitRaw))) : 50;
    res.json(listStatisticEvents(db, parseStatisticFilters(req.query as Record<string, unknown>), cursor, limit));
  });

  app.delete('/api/statistics', requireLocalDaemonRequest, (_req, res) => {
    res.json({ deleted: resetStatistics(db) });
  });
}
