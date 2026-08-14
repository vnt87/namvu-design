import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@open-design/components';
import type {
  StatisticBreakdownItem,
  StatisticRange,
  StatisticsDashboardResponse,
  StatisticsEventsResponse,
} from '@open-design/contracts';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { motion, useReducedMotion } from 'motion/react';
import { useT } from '../i18n';
import styles from './StatisticsSection.module.css';

const RANGES: StatisticRange[] = ['7d', '30d', '90d', 'all'];
const CHART_COLORS = ['#7559e8', '#21a179', '#e99b3f', '#e05d6f', '#4d8bd8', '#9b6bce'];

interface Filters {
  projectId: string;
  workspaceId: string;
  modelId: string;
  providerId: string;
  feature: string;
  category: string;
  result: string;
}

const EMPTY_FILTERS: Filters = { projectId: '', workspaceId: '', modelId: '', providerId: '', feature: '', category: '', result: '' };

export function StatisticsSection(): JSX.Element {
  const t = useT();
  const reduceMotion = useReducedMotion();
  const [range, setRange] = useState<StatisticRange>('30d');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [data, setData] = useState<StatisticsDashboardResponse | null>(null);
  const [events, setEvents] = useState<StatisticsEventsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const query = useMemo(() => {
    const params = new URLSearchParams({ range });
    for (const [key, value] of Object.entries(filters)) if (value) params.set(key, value);
    return params.toString();
  }, [filters, range]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryResponse, eventsResponse] = await Promise.all([
        fetch(`/api/statistics?${query}`),
        fetch(`/api/statistics/events?${query}&limit=16`),
      ]);
      if (!summaryResponse.ok || !eventsResponse.ok) throw new Error('statistics request failed');
      setData(await summaryResponse.json() as StatisticsDashboardResponse);
      setEvents(await eventsResponse.json() as StatisticsEventsResponse);
    } catch {
      setError(t('settings.statisticsLoadError'));
    } finally {
      setLoading(false);
    }
  }, [query, t]);

  useEffect(() => { void load(); }, [load]);

  async function reset(): Promise<void> {
    if (!window.confirm(t('settings.statisticsResetConfirm'))) return;
    setResetting(true);
    try {
      const response = await fetch('/api/statistics', { method: 'DELETE' });
      if (!response.ok) throw new Error('reset failed');
      await load();
    } catch {
      setError(t('settings.statisticsResetError'));
    } finally {
      setResetting(false);
    }
  }

  async function loadMore(): Promise<void> {
    if (!events?.nextCursor) return;
    setLoadingMore(true);
    try {
      const response = await fetch(`/api/statistics/events?${query}&limit=16&cursor=${encodeURIComponent(events.nextCursor)}`);
      if (!response.ok) throw new Error('statistics request failed');
      const next = await response.json() as StatisticsEventsResponse;
      setEvents({ items: [...events.items, ...next.items], nextCursor: next.nextCursor });
    } catch {
      setError(t('settings.statisticsLoadError'));
    } finally {
      setLoadingMore(false);
    }
  }

  const summary = data?.summary;
  const hasData = Boolean(summary && summary.events > 0);
  const animation = reduceMotion ? { duration: 0 } : { duration: 0.2, ease: [0.23, 1, 0.32, 1] as const };

  return (
    <section className={styles.root}>
      <div className={styles.hero}>
        <div>
          <span className={styles.localBadge}>{t('settings.statisticsLocalBadge')}</span>
          <h3>{t('settings.statisticsTitle')}</h3>
          <p>{t('settings.statisticsDescription')}</p>
        </div>
        <div className={styles.rangePicker} role="group" aria-label={t('settings.statisticsRange')}>
          {RANGES.map((item) => (
            <button key={item} type="button" className={range === item ? styles.activeRange : ''} onClick={() => setRange(item)}>
              {item === 'all' ? t('settings.statisticsAllTime') : item}
            </button>
          ))}
        </div>
      </div>

      {data ? <FilterBar data={data} filters={filters} onChange={setFilters} /> : null}

      {loading && !data ? <DashboardSkeleton /> : null}
      {error ? <div className={styles.error} role="alert">{error}<Button onClick={() => void load()}>{t('settings.statisticsRetry')}</Button></div> : null}
      {!loading && !error && !hasData ? <div className={styles.empty}><span>◌</span><h4>{t('settings.statisticsEmpty')}</h4><p>{t('settings.statisticsEmptyHint')}</p></div> : null}

      {hasData && data ? (
        <motion.div className={styles.dashboard} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={animation}>
          <div className={styles.kpis}>
            <Kpi reduceMotion={reduceMotion} label={t('settings.statisticsRuns')} value={formatNumber(data.summary.runs)} note={formatPercent(data.summary.successRate, t('settings.statisticsSuccess'))} />
            <Kpi reduceMotion={reduceMotion} label={t('settings.statisticsTokens')} value={compactNumber(data.summary.totalTokens)} note={`${compactNumber(data.summary.inputTokens)} ${t('settings.statisticsInput')} · ${compactNumber(data.summary.outputTokens)} ${t('settings.statisticsOutput')}`} />
            <Kpi reduceMotion={reduceMotion} label={t('settings.statisticsTime')} value={formatDuration(data.summary.durationMs)} note={t('settings.statisticsGenerationTime')} />
            <Kpi reduceMotion={reduceMotion} label={t('settings.statisticsArtifacts')} value={formatNumber(data.summary.artifacts)} note={`${data.summary.featuresUsed} ${t('settings.statisticsFeatures')}`} />
          </div>

          <div className={styles.chartGrid}>
            <ChartCard title={t('settings.statisticsActivity')} className={styles.wide}>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data.timeline} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                  <defs><linearGradient id="statisticsRuns" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7559e8" stopOpacity={0.38}/><stop offset="100%" stopColor="#7559e8" stopOpacity={0.03}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#dedbe8" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={24} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #dedbe8' }} />
                  <Area type="monotone" dataKey="runs" stroke="#7559e8" strokeWidth={2.5} fill="url(#statisticsRuns)" animationDuration={reduceMotion ? 0 : 500} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title={t('settings.statisticsResults')}>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart><Pie data={data.breakdowns.results} dataKey="count" nameKey="label" innerRadius={58} outerRadius={88} paddingAngle={3} isAnimationActive={!reduceMotion}>{data.breakdowns.results.map((item, index) => <Cell key={item.key} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}</Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
              <Legend items={data.breakdowns.results} />
            </ChartCard>
            <BreakdownChart reduceMotion={reduceMotion} title={t('settings.statisticsModels')} items={data.breakdowns.models} />
            <BreakdownChart reduceMotion={reduceMotion} title={t('settings.statisticsFeatures')} items={data.breakdowns.features} />
            <BreakdownChart reduceMotion={reduceMotion} title={t('settings.statisticsTools')} items={data.breakdowns.tools} />
          </div>

          <ChartCard title={t('settings.statisticsRecent')}>
            <div className={styles.timeline}>
              {events?.items.map((event) => (
                <div className={styles.timelineRow} key={event.id}>
                  <span className={styles.eventDot} />
                  <div><strong>{humanize(event.feature ?? event.name)}</strong><small>{humanize(event.category)}{event.result ? ` · ${humanize(event.result)}` : ''}</small></div>
                  <time>{new Date(event.occurredAt).toLocaleString()}</time>
                </div>
              ))}
              {events?.nextCursor ? (
                <Button className={styles.loadMore} disabled={loadingMore} onClick={() => void loadMore()}>
                  {loadingMore ? t('common.loading') : t('settings.statisticsLoadMore')}
                </Button>
              ) : null}
            </div>
          </ChartCard>
        </motion.div>
      ) : null}

      <div className={styles.dangerZone}>
        <div><strong>{t('settings.statisticsReset')}</strong><p>{t('settings.statisticsResetHint')}</p></div>
        <Button disabled={resetting} onClick={() => void reset()}>{resetting ? t('common.loading') : t('settings.statisticsReset')}</Button>
      </div>
    </section>
  );
}

function FilterBar({ data, filters, onChange }: { data: StatisticsDashboardResponse; filters: Filters; onChange: (next: Filters) => void }): JSX.Element {
  const t = useT();
  const options: Array<[keyof Filters, string, string[]]> = [
    ['projectId', t('settings.statisticsProject'), data.availableFilters.projectIds], ['workspaceId', t('settings.statisticsWorkspace'), data.availableFilters.workspaceIds],
    ['modelId', t('settings.statisticsModel'), data.availableFilters.modelIds], ['providerId', t('settings.statisticsProvider'), data.availableFilters.providerIds], ['feature', t('settings.statisticsFeature'), data.availableFilters.features],
    ['category', t('settings.statisticsCategory'), data.availableFilters.categories], ['result', t('settings.statisticsResult'), data.availableFilters.results],
  ];
  return <div className={styles.filters}>{options.filter(([, , values]) => values.length > 0).map(([key, label, values]) => <label key={key}><span>{label}</span><select value={filters[key]} onChange={(event) => onChange({ ...filters, [key]: event.target.value })}><option value="">{t('common.all')}</option>{values.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>)}{Object.values(filters).some(Boolean) ? <button type="button" onClick={() => onChange(EMPTY_FILTERS)}>{t('settings.statisticsClearFilters')}</button> : null}</div>;
}

function Kpi({ label, value, note, reduceMotion }: { label: string; value: string; note: string; reduceMotion: boolean | null }): JSX.Element { return <motion.article className={styles.kpi} whileHover={reduceMotion ? undefined : { y: -2 }}><span>{label}</span><strong>{value}</strong><small>{note}</small></motion.article>; }
function ChartCard({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }): JSX.Element { return <article className={`${styles.chartCard} ${className}`}><h4>{title}</h4>{children}</article>; }
function BreakdownChart({ title, items, reduceMotion }: { title: string; items: StatisticBreakdownItem[]; reduceMotion: boolean | null }): JSX.Element { const data = items.slice(0, 7); return <ChartCard title={title}><ResponsiveContainer width="100%" height={250}><BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}><CartesianGrid horizontal={false} stroke="#eeeaf4"/><XAxis type="number" hide/><YAxis type="category" dataKey="label" width={92} tick={{ fontSize: 11 }} tickLine={false} axisLine={false}/><Tooltip/><Bar dataKey="count" fill="#7559e8" radius={[0, 7, 7, 0]} isAnimationActive={!reduceMotion} /></BarChart></ResponsiveContainer></ChartCard>; }
function Legend({ items }: { items: StatisticBreakdownItem[] }): JSX.Element { return <div className={styles.legend}>{items.slice(0, 5).map((item, index) => <span key={item.key}><i style={{ background: CHART_COLORS[index % CHART_COLORS.length] }}/>{humanize(item.label)} <b>{item.count}</b></span>)}</div>; }
function DashboardSkeleton(): JSX.Element { return <div className={styles.skeleton} aria-busy="true">{Array.from({ length: 8 }, (_, index) => <span key={index}/>)}</div>; }
function humanize(value: string): string { return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()); }
function formatNumber(value: number): string { return new Intl.NumberFormat().format(value); }
function compactNumber(value: number): string { return new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(value); }
function formatPercent(value: number | null, suffix: string): string { return value === null ? '—' : `${Math.round(value * 100)}% ${suffix}`; }
function formatDuration(value: number): string { const minutes = Math.round(value / 60000); return minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`; }
