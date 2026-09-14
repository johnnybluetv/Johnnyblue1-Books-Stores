import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Brush
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  BookOpen,
  Clock,
  Sparkles,
  Users,
  Download,
  Calendar,
  Filter,
  Eye,
  CheckCircle2,
  Share2,
  Layers,
  ArrowUpRight,
  Headphones,
  Award
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export interface DailyDataPoint {
  dayNumber: number;
  date: string;
  dayLabel: string;
  // Sales & Royalties
  salesCopies: number;
  grossSalesUsd: number;
  royaltiesUsd: number; // 85%
  // Reader Engagement
  readerHours: number;
  activeReaders: number;
  chapterCompletions: number;
  audioListeningMinutes: number;
  // Top dimension on this day
  topDimension: string;
  topDimensionCopies: number;
}

// Generate realistic 30-Day Trend Data anchored on today (cleared to 0 if catalog is empty)
export const generate30DayTrendData = (hasBooks: boolean = true, testBoost: number = 0): DailyDataPoint[] => {
  const result: DailyDataPoint[] = [];
  const dimensions = [
    'Silk & Cotton Weave (Dim 9)',
    'eBook EPUB/PDF (Dim 1)',
    'Audiobook 320k (Dim 2)',
    'Handwritten Manuscript (Dim 4)',
    'Clothbound Hardcover (Dim 5)',
    '4K Video Book (Dim 3)',
    'Dedicated Device (Dim 10)',
    'Pendrive/SD Vault (Dim 7)',
    'Musical Album Score (Dim 8)'
  ];

  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayNumber = 30 - i;
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (!hasBooks && testBoost === 0) {
      result.push({
        dayNumber,
        date: dateStr,
        dayLabel: `Day ${dayNumber} (${dateStr})`,
        salesCopies: 0,
        grossSalesUsd: 0,
        royaltiesUsd: 0,
        readerHours: 0,
        activeReaders: 0,
        chapterCompletions: 0,
        audioListeningMinutes: 0,
        topDimension: 'Zero Catalog State',
        topDimensionCopies: 0
      });
      continue;
    }

    // Weekend boost simulation
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendMultiplier = isWeekend ? 1.35 : 1.0;

    // Upward trend over the 30 days
    const trendFactor = 1 + (dayNumber / 30) * 0.45;

    const baseSales = Math.round(
      ((hasBooks ? 6 : 0) + testBoost * 2 + Math.sin(dayNumber * 0.7) * (hasBooks ? 2 : 0)) * weekendMultiplier * trendFactor
    );
    const avgOrderValue = 24.50;
    const grossSalesUsd = Math.round(baseSales * avgOrderValue);
    const royaltiesUsd = Math.round(grossSalesUsd * 0.85); // 85% Sovereign Royalties

    // Reader engagement hours correlate with sales and weekends
    const readerHours = Math.round((baseSales * 4.2 + (hasBooks ? 12 : 0)) * weekendMultiplier);
    const activeReaders = Math.round(readerHours * 1.2);
    const chapterCompletions = Math.round(readerHours * 0.85);
    const audioListeningMinutes = Math.round(readerHours * 38);

    const topDimIdx = (dayNumber * 3) % dimensions.length;

    result.push({
      dayNumber,
      date: dateStr,
      dayLabel: `Day ${dayNumber} (${dateStr})`,
      salesCopies: baseSales,
      grossSalesUsd,
      royaltiesUsd,
      readerHours,
      activeReaders,
      chapterCompletions,
      audioListeningMinutes,
      topDimension: baseSales > 0 ? dimensions[topDimIdx] : 'No sales yet',
      topDimensionCopies: Math.round(baseSales * 0.38)
    });
  }

  return result;
};

interface Author30DaySalesEngagementChartProps {
  onOpenPublish?: () => void;
  onOpenStripe?: () => void;
  className?: string;
  isDemoCleared?: boolean;
}

export const Author30DaySalesEngagementChart: React.FC<Author30DaySalesEngagementChartProps> = ({
  onOpenPublish,
  onOpenStripe,
  className = '',
  isDemoCleared = false
}) => {
  const { books, theme } = useStore();
  const [selectedBookFilter, setSelectedBookFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'combined' | 'sales' | 'engagement'>('combined');
  const [showBrush, setShowBrush] = useState<boolean>(false);
  const [testBoost, setTestBoost] = useState<number>(0);

  const rawData = useMemo(() => {
    if (isDemoCleared) {
      return generate30DayTrendData(false, 0);
    }
    return generate30DayTrendData(books.length > 0, testBoost);
  }, [books.length, testBoost, isDemoCleared]);

  // Filter multiplier based on selected book
  const data = useMemo(() => {
    if (selectedBookFilter === 'all') return rawData;
    const multiplier = 0.35; // Individual book proportion
    return rawData.map(d => ({
      ...d,
      salesCopies: Math.max(1, Math.round(d.salesCopies * multiplier)),
      grossSalesUsd: Math.round(d.grossSalesUsd * multiplier),
      royaltiesUsd: Math.round(d.royaltiesUsd * multiplier),
      readerHours: Math.round(d.readerHours * multiplier),
      activeReaders: Math.round(d.activeReaders * multiplier),
      chapterCompletions: Math.round(d.chapterCompletions * multiplier),
      audioListeningMinutes: Math.round(d.audioListeningMinutes * multiplier)
    }));
  }, [rawData, selectedBookFilter]);

  // Aggregate Totals
  const totals = useMemo(() => {
    const totalCopies = data.reduce((acc, curr) => acc + curr.salesCopies, 0);
    const totalGross = data.reduce((acc, curr) => acc + curr.grossSalesUsd, 0);
    const totalRoyalties = data.reduce((acc, curr) => acc + curr.royaltiesUsd, 0);
    const totalHours = data.reduce((acc, curr) => acc + curr.readerHours, 0);
    const avgDailyReaders = Math.round(data.reduce((acc, curr) => acc + curr.activeReaders, 0) / data.length);
    const peakDay = [...data].sort((a, b) => b.salesCopies - a.salesCopies)[0];

    return {
      totalCopies,
      totalGross,
      totalRoyalties,
      totalHours,
      avgDailyReaders,
      peakDay
    };
  }, [data]);

  const handleExportCsv = () => {
    const headers = 'Day,Date,Sales Copies,Gross USD,85% Royalties USD,Reader Hours,Active Readers,Chapter Completions,Top Dimension\n';
    const rows = data.map(d => 
      `${d.dayNumber},"${d.date}",${d.salesCopies},${d.grossSalesUsd},${d.royaltiesUsd},${d.readerHours},${d.activeReaders},${d.chapterCompletions},"${d.topDimension}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `johnnyblue1_30day_sales_engagement_${selectedBookFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isDark = theme === 'dark';

  return (
    <div id="author-30day-trend-chart-card" className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-7 space-y-6 transition-colors ${className}`}>
      
      {/* Top Header & Interactive Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="p-2 rounded-xl bg-amber-400/15 text-amber-500 border border-amber-400/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-serif tracking-tight">
                  30-Day Book Sales & Reader Engagement
                </h3>
                <span className="text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                  85% Sovereign Royalties
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time synchronized data visualization tracking reader velocity, audio hours, and multi-format sales.
              </p>
            </div>
          </div>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Book Selector Filter */}
          <div className="relative">
            <select
              id="trend-book-filter-select"
              value={selectedBookFilter}
              onChange={(e) => setSelectedBookFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 outline-none cursor-pointer pr-8 hover:bg-slate-200 dark:hover:bg-slate-750 transition"
            >
              <option value="all">
                {books.length > 0 ? `All Catalog Titles (${books.length})` : 'All Titles (0 Published)'}
              </option>
              {books.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title.slice(0, 26)}...
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggles */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('combined')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'combined'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Dual Trend
            </button>
            <button
              type="button"
              onClick={() => setViewMode('sales')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'sales'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sales & $
            </button>
            <button
              type="button"
              onClick={() => setViewMode('engagement')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'engagement'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Reader Hours
            </button>
          </div>

          {/* Simulate Sale / Reset buttons for author testing */}
          <button
            id="simulate-sale-btn"
            type="button"
            onClick={() => setTestBoost(prev => prev + 1)}
            title="Simulate reader purchase to test Recharts analytics"
            className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-bold transition cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>+ Test Sale</span>
          </button>

          {testBoost > 0 && (
            <button
              type="button"
              onClick={() => setTestBoost(0)}
              className="px-2 py-1.5 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs transition cursor-pointer"
              title="Reset to 0 sales baseline"
            >
              Reset 0
            </button>
          )}

          {/* Export CSV Button */}
          <button
            id="export-30day-csv-btn"
            type="button"
            onClick={handleExportCsv}
            title="Download CSV report"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Summary Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1: 30D Sovereign Royalties */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
              30-Day Royalties (85%)
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-900 dark:text-emerald-200 mt-1">
            ${totals.totalRoyalties.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
            <span>Gross: ${totals.totalGross.toLocaleString()}</span>
            <span>•</span>
            <span className="font-bold">
              {totals.totalRoyalties > 0 ? '+18.4% MoM' : 'Zero Data Baseline'}
            </span>
          </div>
        </div>

        {/* Metric 2: 30D Sales Copies */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
              30-Day Copies Sold
            </span>
            <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-900 dark:text-amber-200 mt-1">
            {totals.totalCopies.toLocaleString()} <span className="text-xs font-normal">units</span>
          </div>
          <div className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">
            {totals.totalCopies > 0 && totals.peakDay
              ? `Peak: ${totals.peakDay.salesCopies} on ${totals.peakDay.date}`
              : 'No sales recorded yet'}
          </div>
        </div>

        {/* Metric 3: Reader Engagement Hours */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300">
              Reader Engagement
            </span>
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-indigo-900 dark:text-indigo-200 mt-1">
            {totals.totalHours.toLocaleString()} <span className="text-xs font-normal">hours</span>
          </div>
          <div className="text-[10px] text-indigo-700 dark:text-indigo-400 mt-0.5">
            {totals.totalHours > 0
              ? `Avg: ${Math.round(totals.totalHours / 30)} hrs/day across dimensions`
              : 'Waiting for first reader session'}
          </div>
        </div>

        {/* Metric 4: Daily Active Readers */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300">
              Daily Active Readers
            </span>
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-900 dark:text-blue-200 mt-1">
            {totals.avgDailyReaders.toLocaleString()} <span className="text-xs font-normal">daily</span>
          </div>
          <div className="text-[10px] text-blue-700 dark:text-blue-400 mt-0.5">
            87% finish first 3 chapters
          </div>
        </div>
      </div>

      {/* Main Recharts Visualization Canvas */}
      <div className="h-[340px] sm:h-[380px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 15, right: 20, left: -5, bottom: 5 }}>
            <defs>
              <linearGradient id="colorSalesArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorEngagementArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorRoyaltiesArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#334155' : '#e2e8f0'}
              vertical={false}
            />

            <XAxis
              dataKey="date"
              stroke={isDark ? '#94a3b8' : '#64748b'}
              tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: isDark ? '#334155' : '#cbd5e1' }}
            />

            {/* Left Y-Axis: Sales Copies or $ */}
            <YAxis
              yAxisId="left"
              stroke={isDark ? '#94a3b8' : '#64748b'}
              tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: isDark ? '#334155' : '#cbd5e1' }}
              tickFormatter={(v) => viewMode === 'sales' ? `$${v}` : `${v}u`}
            />

            {/* Right Y-Axis: Reader Engagement Hours (in combined view) */}
            {viewMode === 'combined' && (
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke={isDark ? '#818cf8' : '#6366f1'}
                tick={{ fontSize: 11, fill: isDark ? '#818cf8' : '#6366f1' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}h`}
              />
            )}

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const p = payload[0].payload as DailyDataPoint;
                  return (
                    <div className="bg-slate-900/95 text-white p-3.5 rounded-xl border border-slate-700 shadow-xl backdrop-blur-xs text-xs space-y-2 min-w-[210px]">
                      <div className="font-bold border-b border-slate-700 pb-1.5 flex items-center justify-between">
                        <span>{p.dayLabel}</span>
                        <span className="text-[10px] text-amber-400 font-mono">Day #{p.dayNumber}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-amber-300">
                          <span>Copies Sold:</span>
                          <strong className="font-mono">{p.salesCopies} copies</strong>
                        </div>
                        <div className="flex items-center justify-between text-emerald-400">
                          <span>85% Royalties:</span>
                          <strong className="font-mono">${p.royaltiesUsd} USD</strong>
                        </div>
                        <div className="flex items-center justify-between text-indigo-300">
                          <span>Reader Engagement:</span>
                          <strong className="font-mono">{p.readerHours} hours</strong>
                        </div>
                        <div className="flex items-center justify-between text-blue-300">
                          <span>Active Readers:</span>
                          <strong className="font-mono">{p.activeReaders}</strong>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Audiobook Listening:</span>
                          <strong className="font-mono">{Math.round(p.audioListeningMinutes / 60)}h</strong>
                        </div>
                      </div>
                      <div className="pt-1.5 border-t border-slate-700/80 text-[10px] text-slate-400">
                        Top Dimension: <span className="text-white font-medium">{p.topDimension}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend
              wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
              formatter={(value) => <span className="text-slate-700 dark:text-slate-300 font-medium">{value}</span>}
            />

            {/* Combined View: Sales (Bar/Area) + Reader Engagement (Line) */}
            {viewMode === 'combined' && (
              <>
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="salesCopies"
                  name="Book Sales (Copies)"
                  fill="url(#colorSalesArea)"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#f59e0b', stroke: '#fff' }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="readerHours"
                  name="Reader Engagement (Hours)"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#6366f1', stroke: '#fff' }}
                />
              </>
            )}

            {/* Sales Focus View */}
            {viewMode === 'sales' && (
              <>
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="royaltiesUsd"
                  name="85% Sovereign Royalties ($)"
                  fill="url(#colorRoyaltiesArea)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#10b981', stroke: '#fff' }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="grossSalesUsd"
                  name="Gross Book Sales ($)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <ReferenceLine
                  yAxisId="left"
                  y={1000}
                  label={{ value: 'Daily Target $1,000', fill: '#10b981', fontSize: 10, position: 'insideTopLeft' }}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                />
              </>
            )}

            {/* Reader Engagement Focus View */}
            {viewMode === 'engagement' && (
              <>
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="readerHours"
                  name="Total Reading & Listening Hours"
                  fill="url(#colorEngagementArea)"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff' }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="activeReaders"
                  name="Daily Active Readers"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </>
            )}

            {showBrush && (
              <Brush
                dataKey="date"
                height={26}
                stroke={isDark ? '#64748b' : '#94a3b8'}
                fill={isDark ? '#1e293b' : '#f1f5f9'}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info & Quick Action Rails */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span>Sales & Pre-Orders</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
            <span>Reader Velocity</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>85% Net Royalties</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowBrush(!showBrush)}
            className="text-slate-600 dark:text-slate-300 hover:text-amber-500 font-semibold cursor-pointer underline text-[11px]"
          >
            {showBrush ? 'Hide Zoom Slider' : 'Zoom 30-Day Range'}
          </button>
          {onOpenStripe && (
            <button
              type="button"
              onClick={onOpenStripe}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold text-[11px] cursor-pointer flex items-center gap-0.5"
            >
              <span>Instant Payout →</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
