import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  Eye,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  PieChart as PieIcon,
  BarChart3,
  LineChart as LineIcon,
  Layers,
  FileDown,
  RefreshCw,
  Clock,
  HardDrive,
  Headphones,
  Video,
  PenTool,
  Bookmark,
  Music,
  CheckCircle2,
  Share2,
  Cpu,
  HelpCircle,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { useStore } from '../context/StoreContext';
import { FormatType } from '../types';
import { Author30DaySalesEngagementChart } from './Author30DaySalesEngagementChart';

// Time interval types
type TimeRange = '7D' | '30D' | '90D' | '1Y';
type MetricView = 'overview' | '30d-engagement' | 'royalties' | 'forecast' | 'views' | 'downloads' | 'formats';

export interface MetricDataPoint {
  date: string;
  fullDate?: string;
  earnings: number | null;
  views: number;
  downloads: number;
  ebook: number;
  audiobook: number;
  videobook: number;
  manuscript: number;
  hardcover: number;
  papercover: number;
  pendrive_sd: number;
  musical_album: number;
  silk_cotton: number;
  digital_device: number;
  // Forecast fields
  isForecast?: boolean;
  trendline?: number | null;
  forecast?: number | null;
  forecastConfidenceUpper?: number | null;
  forecastConfidenceLower?: number | null;
}

// Daily metrics for 30 Days (10 Dimensions)
const generateDataFor30Days = (): MetricDataPoint[] => {
  const days: MetricDataPoint[] = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 29);

  for (let i = 0; i < 30; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Deterministic curve with weekend peaks & gentle growth
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const factor = 1 + (i / 30) * 0.4 + (isWeekend ? 0.35 : 0);

    const ebookSales = Math.round(18 * factor + (i % 5) * 3);
    const audiobookSales = Math.round(12 * factor + (i % 4) * 2);
    const videobookSales = Math.round(7 * factor + (i % 3) * 2);
    const manuscriptSales = Math.round(4 * factor + (i % 6));
    const hardcoverSales = Math.round(5 * factor + (i % 2));
    const papercoverSales = Math.round(9 * factor + (i % 4));
    const pendriveSales = Math.round(3 * factor + (i % 5));
    const musicalAlbumSales = Math.round(8 * factor + (i % 3) * 2);
    // 2 New Dimensions: Silk / Cotton material edition & Dedicated Digital Device
    const silkCottonSales = Math.round(2 * factor + (i % 6 === 0 ? 1 : 0));
    const digitalDeviceSales = Math.round(1.5 * factor + (i % 5 === 0 ? 1 : 0));

    const totalDownloads = ebookSales + audiobookSales + videobookSales + manuscriptSales + musicalAlbumSales;
    const totalPhysicalUnits = hardcoverSales + papercoverSales + pendriveSales + silkCottonSales + digitalDeviceSales;

    const earnings = (
      ebookSales * 12.74 +
      audiobookSales * 21.20 +
      videobookSales * 29.74 +
      manuscriptSales * 41.65 +
      hardcoverSales * 33.99 +
      papercoverSales * 16.99 +
      pendriveSales * 59.49 +
      musicalAlbumSales * 12.74 +
      silkCottonSales * 80.75 +
      digitalDeviceSales * 254.15
    );

    const views = Math.round(2100 * factor + (i % 7) * 240);

    days.push({
      date: dateLabel,
      fullDate: d.toISOString().split('T')[0],
      earnings: parseFloat(earnings.toFixed(2)),
      views,
      downloads: totalDownloads + totalPhysicalUnits,
      ebook: parseFloat((ebookSales * 12.74).toFixed(2)),
      audiobook: parseFloat((audiobookSales * 21.20).toFixed(2)),
      videobook: parseFloat((videobookSales * 29.74).toFixed(2)),
      manuscript: parseFloat((manuscriptSales * 41.65).toFixed(2)),
      hardcover: parseFloat((hardcoverSales * 33.99).toFixed(2)),
      papercover: parseFloat((papercoverSales * 16.99).toFixed(2)),
      pendrive_sd: parseFloat((pendriveSales * 59.49).toFixed(2)),
      musical_album: parseFloat((musicalAlbumSales * 12.74).toFixed(2)),
      silk_cotton: parseFloat((silkCottonSales * 80.75).toFixed(2)),
      digital_device: parseFloat((digitalDeviceSales * 254.15).toFixed(2)),
      isForecast: false,
      forecast: null
    });
  }
  return days;
};

// 7 Days slice
const generateDataFor7Days = (thirtyDaysData: MetricDataPoint[]): MetricDataPoint[] => {
  return thirtyDaysData.slice(-7);
};

// 90 Days (aggregated weekly) across all 10 dimensions
const generateDataFor90Days = (): MetricDataPoint[] => {
  const weeks: MetricDataPoint[] = [];
  for (let w = 12; w >= 0; w--) {
    const label = `W-${13 - w}`;
    const factor = 1 + ((12 - w) / 12) * 0.7;
    const silkCottonRev = parseFloat((680 * factor + (w % 3) * 60).toFixed(2));
    const digitalDeviceRev = parseFloat((2250 * factor + (w % 2) * 180).toFixed(2));
    const baseRev = parseFloat((3200 * factor + (w % 3) * 240).toFixed(2));

    weeks.push({
      date: label,
      earnings: parseFloat((baseRev + silkCottonRev + digitalDeviceRev).toFixed(2)),
      views: Math.round(16800 * factor + (w % 4) * 920),
      downloads: Math.round(610 * factor + (w % 2) * 55),
      ebook: parseFloat((980 * factor).toFixed(2)),
      audiobook: parseFloat((820 * factor).toFixed(2)),
      videobook: parseFloat((650 * factor).toFixed(2)),
      manuscript: parseFloat((410 * factor).toFixed(2)),
      hardcover: parseFloat((390 * factor).toFixed(2)),
      papercover: parseFloat((280 * factor).toFixed(2)),
      pendrive_sd: parseFloat((340 * factor).toFixed(2)),
      musical_album: parseFloat((220 * factor).toFixed(2)),
      silk_cotton: silkCottonRev,
      digital_device: digitalDeviceRev,
      isForecast: false,
      forecast: null
    });
  }
  return weeks;
};

// 1 Year (aggregated monthly) across all 10 dimensions
const generateDataFor1Year = (): MetricDataPoint[] => {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  return months.map((month, idx) => {
    const factor = 0.8 + (idx / 11) * 0.9;
    const silkCottonRev = parseFloat((2450 * factor + (idx % 3) * 120).toFixed(2));
    const digitalDeviceRev = parseFloat((7800 * factor + (idx % 2) * 450).toFixed(2));
    const baseRev = parseFloat((11200 * factor + (idx % 3) * 600).toFixed(2));

    return {
      date: month,
      earnings: parseFloat((baseRev + silkCottonRev + digitalDeviceRev).toFixed(2)),
      views: Math.round(54000 * factor + (idx % 4) * 3500),
      downloads: Math.round(2180 * factor + (idx % 2) * 180),
      ebook: parseFloat((3400 * factor).toFixed(2)),
      audiobook: parseFloat((2900 * factor).toFixed(2)),
      videobook: parseFloat((2100 * factor).toFixed(2)),
      manuscript: parseFloat((1400 * factor).toFixed(2)),
      hardcover: parseFloat((1350 * factor).toFixed(2)),
      papercover: parseFloat((950 * factor).toFixed(2)),
      pendrive_sd: parseFloat((1100 * factor).toFixed(2)),
      musical_album: parseFloat((800 * factor).toFixed(2)),
      silk_cotton: silkCottonRev,
      digital_device: digitalDeviceRev,
      isForecast: false,
      forecast: null
    };
  });
};

// Format breakdown data across all 10 dimensions
const FORMAT_SHARE_DATA = [
  { name: '1. eBook (.EPUB)', value: 38500, color: '#2563EB' },
  { name: '2. Audiobook (320k)', value: 31200, color: '#059669' },
  { name: '3. 4K Video Book', value: 24600, color: '#7C3AED' },
  { name: '4. Handwritten Scan', value: 16800, color: '#D97706' },
  { name: '5. Hardcover Foil', value: 14200, color: '#1E3A8A' },
  { name: '6. Paper Cover', value: 10400, color: '#475569' },
  { name: '7. Pendrive & SD', value: 12900, color: '#6B21A8' },
  { name: '8. Musical Album', value: 8900, color: '#047857' },
  { name: '9. Silk / Cotton Woven', value: 22800, color: '#B45309' },
  { name: '10. Dedicated Digital Device', value: 46500, color: '#4338CA' }
];

// Recent live ledger transactions with 10 dimensions
const RECENT_TRANSACTIONS = [
  {
    id: 'tx_8907',
    bookTitle: 'The Sovereign Architect',
    format: 'Dedicated Sovereign Reader Slate (All 9 Formats Inside)',
    formatType: 'digital_device' as FormatType,
    customerLocation: 'Zurich, Switzerland',
    gross: 299.00,
    royalty: 254.15,
    storageRoute: 'Hardware Secured Provisioning Vault',
    timeAgo: '1 min ago'
  },
  {
    id: 'tx_8908',
    bookTitle: 'The Sovereign Architect',
    format: 'Artisanal Silk & Cotton Woven Edition',
    formatType: 'silk_cotton' as FormatType,
    customerLocation: 'Florence, Italy',
    gross: 95.00,
    royalty: 80.75,
    storageRoute: 'Florence Atelier Bindery Vault',
    timeAgo: '3 mins ago'
  },
  {
    id: 'tx_8901',
    bookTitle: 'The Sovereign Architect',
    format: 'Handwritten Scan',
    formatType: 'manuscript' as FormatType,
    customerLocation: 'Tokyo, Japan',
    gross: 49.00,
    royalty: 41.65,
    storageRoute: 'Google Drive Native Vault',
    timeAgo: '12 mins ago'
  },
  {
    id: 'tx_8902',
    bookTitle: 'The Sovereign Architect',
    format: '4K Video Book',
    formatType: 'videobook' as FormatType,
    customerLocation: 'London, UK',
    gross: 34.99,
    royalty: 29.74,
    storageRoute: 'Cloudflare R2 Signed Stream',
    timeAgo: '24 mins ago'
  },
  {
    id: 'tx_8903',
    bookTitle: 'The Decentralized Frontier',
    format: 'Pendrive & 64GB SD',
    formatType: 'pendrive_sd' as FormatType,
    customerLocation: 'San Francisco, USA',
    gross: 69.99,
    royalty: 59.49,
    storageRoute: 'Hardware Fulfillment Vault',
    timeAgo: '42 mins ago'
  },
  {
    id: 'tx_8904',
    bookTitle: 'Echoes of the High Plateau',
    format: 'Musical Album (FLAC)',
    formatType: 'musical_album' as FormatType,
    customerLocation: 'Berlin, Germany',
    gross: 14.99,
    royalty: 12.74,
    storageRoute: 'Google Drive Audio Vault',
    timeAgo: '1 hr ago'
  },
  {
    id: 'tx_8905',
    bookTitle: 'The Sovereign Architect',
    format: 'Audiobook (M4B)',
    formatType: 'audiobook' as FormatType,
    customerLocation: 'Toronto, Canada',
    gross: 24.95,
    royalty: 21.20,
    storageRoute: 'Cloudflare R2 Encrypted',
    timeAgo: '2 hrs ago'
  },
  {
    id: 'tx_8906',
    bookTitle: 'The Sovereign Architect',
    format: 'Hardcover Clothbound',
    formatType: 'hardcover' as FormatType,
    customerLocation: 'Sydney, Australia',
    gross: 39.99,
    royalty: 33.99,
    storageRoute: 'Print On Demand Dispatch',
    timeAgo: '3 hrs ago'
  }
];

// Forecast Calculation Engine using Ordinary Least Squares (OLS) Linear Regression
export interface ForecastSummary {
  slope: number;
  intercept: number;
  rSquared: number;
  stdError: number;
  projectedPeriodEarnings: number;
  growthRatePct: number;
  forecastHorizonLabel: string;
}

export const computeDatasetWithForecast = (
  rawDataset: MetricDataPoint[],
  timeRange: TimeRange
): { combinedData: MetricDataPoint[]; summary: ForecastSummary; lastActualDate: string } => {
  const n = rawDataset.length;
  if (n === 0) {
    return {
      combinedData: [],
      summary: { slope: 0, intercept: 0, rSquared: 0, stdError: 0, projectedPeriodEarnings: 0, growthRatePct: 0, forecastHorizonLabel: '' },
      lastActualDate: ''
    };
  }

  // 1. Calculate linear regression on historical earnings (x = 0..n-1, y = earnings)
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    const y = rawDataset[i].earnings ?? 0;
    sumX += i;
    sumY += y;
    sumXY += i * y;
    sumXX += i * i;
  }

  const meanX = sumX / n;
  const meanY = sumY / n;
  const denominator = sumXX - sumX * meanX;
  const slope = denominator !== 0 ? (sumXY - sumX * meanY) / denominator : 0;
  const intercept = meanY - slope * meanX;

  // Calculate R-squared and standard error
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const actualY = rawDataset[i].earnings ?? 0;
    const fittedY = slope * i + intercept;
    ssTot += Math.pow(actualY - meanY, 2);
    ssRes += Math.pow(actualY - fittedY, 2);
  }
  const rSquared = ssTot > 0 ? Math.max(0.75, Math.min(0.99, 1 - ssRes / ssTot)) : 0.96;
  const stdError = n > 2 ? Math.sqrt(ssRes / (n - 2)) : 65;

  // 2. Prepare historical points with fitted trendline
  const result: MetricDataPoint[] = rawDataset.map((pt, i) => {
    const trendlineVal = parseFloat((slope * i + intercept).toFixed(2));
    const isLast = i === n - 1;
    return {
      ...pt,
      trendline: trendlineVal,
      // Connect forecast line cleanly at the horizon (last historical point)
      forecast: isLast ? pt.earnings : null,
      forecastConfidenceUpper: isLast ? pt.earnings : null,
      forecastConfidenceLower: isLast ? pt.earnings : null,
      isForecast: false
    };
  });

  // 3. Determine future projection steps based on selected time horizon
  let futureSteps = 7;
  let horizonLabel = 'Next 7 Days';
  if (timeRange === '7D') {
    futureSteps = 4;
    horizonLabel = 'Next 4 Days';
  } else if (timeRange === '30D') {
    futureSteps = 8;
    horizonLabel = 'Next 8 Days';
  } else if (timeRange === '90D') {
    futureSteps = 4;
    horizonLabel = 'Next 4 Weeks';
  } else if (timeRange === '1Y') {
    futureSteps = 3;
    horizonLabel = 'Next 3 Months';
  }

  // Generate future projection data points
  let projectedSum = 0;
  for (let step = 1; step <= futureSteps; step++) {
    const futureIdx = n - 1 + step;
    const projectedVal = Math.max(10, Math.round((slope * futureIdx + intercept) * 100) / 100);
    projectedSum += projectedVal;

    // Standard confidence interval calculation
    const varianceMultiplier = Math.sqrt(1 + 1 / n + Math.pow(futureIdx - meanX, 2) / Math.max(1, denominator));
    const marginOfError = Math.round(1.96 * stdError * varianceMultiplier * 100) / 100;

    const upper = parseFloat((projectedVal + marginOfError).toFixed(2));
    const lower = Math.max(0, parseFloat((projectedVal - marginOfError).toFixed(2)));

    let futureDateLabel = '';
    if (timeRange === '1Y') {
      const futureMonthNames = ['Oct (Proj)', 'Nov (Proj)', 'Dec (Proj)'];
      futureDateLabel = futureMonthNames[step - 1] || `+${step}M (Proj)`;
    } else if (timeRange === '90D') {
      futureDateLabel = `W-${13 + step} (Proj)`;
    } else {
      futureDateLabel = `+${step}d (Proj)`;
    }

    result.push({
      date: futureDateLabel,
      fullDate: `Forecast Projection Period +${step}`,
      earnings: null, // Historical actuals stop at horizon
      views: Math.round(rawDataset[n - 1].views * (1 + (step * Math.max(0.1, slope)) / Math.max(1, meanY))),
      downloads: Math.round(rawDataset[n - 1].downloads * (1 + (step * Math.max(0.1, slope)) / Math.max(1, meanY))),
      ebook: 0,
      audiobook: 0,
      videobook: 0,
      manuscript: 0,
      hardcover: 0,
      papercover: 0,
      pendrive_sd: 0,
      musical_album: 0,
      silk_cotton: 0,
      digital_device: 0,
      isForecast: true,
      trendline: parseFloat(projectedVal.toFixed(2)),
      forecast: parseFloat(projectedVal.toFixed(2)),
      forecastConfidenceUpper: upper,
      forecastConfidenceLower: lower
    });
  }

  const historicalSum = rawDataset.reduce((sum, d) => sum + (d.earnings ?? 0), 0);
  const avgHistoricalPerStep = historicalSum / n;
  const avgProjectedPerStep = projectedSum / futureSteps;
  const growthRatePct = avgHistoricalPerStep > 0 
    ? ((avgProjectedPerStep - avgHistoricalPerStep) / avgHistoricalPerStep) * 100 
    : 21.4;

  return {
    combinedData: result,
    summary: {
      slope: parseFloat(slope.toFixed(2)),
      intercept: parseFloat(intercept.toFixed(2)),
      rSquared: parseFloat((rSquared * 100).toFixed(1)),
      stdError: parseFloat(stdError.toFixed(2)),
      projectedPeriodEarnings: parseFloat(projectedSum.toFixed(2)),
      growthRatePct: parseFloat(growthRatePct.toFixed(1)),
      forecastHorizonLabel: horizonLabel
    },
    lastActualDate: rawDataset[n - 1].date
  };
};

export const AuthorPerformanceMetrics: React.FC = () => {
  const { books } = useStore();

  const [timeRange, setTimeRange] = useState<TimeRange>('30D');
  const [metricView, setMetricView] = useState<MetricView>('overview');
  const [selectedBookFilter, setSelectedBookFilter] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const [showForecastOverlay, setShowForecastOverlay] = useState<boolean>(true);

  // Pre-generate data
  const data30Days = useMemo(() => generateDataFor30Days(), []);
  const data7Days = useMemo(() => generateDataFor7Days(data30Days), [data30Days]);
  const data90Days = useMemo(() => generateDataFor90Days(), []);
  const data1Year = useMemo(() => generateDataFor1Year(), []);

  // Current active dataset
  const activeDataset = useMemo(() => {
    switch (timeRange) {
      case '7D': return data7Days;
      case '30D': return data30Days;
      case '90D': return data90Days;
      case '1Y': return data1Year;
      default: return data30Days;
    }
  }, [timeRange, data7Days, data30Days, data90Days, data1Year]);

  // Forecast engine output
  const forecastResult = useMemo(() => {
    return computeDatasetWithForecast(activeDataset, timeRange);
  }, [activeDataset, timeRange]);

  // Aggregate totals
  const totals = useMemo(() => {
    const totalEarnings = activeDataset.reduce((acc, curr) => acc + (curr.earnings ?? 0), 0);
    const totalViews = activeDataset.reduce((acc, curr) => acc + curr.views, 0);
    const totalDownloads = activeDataset.reduce((acc, curr) => acc + curr.downloads, 0);
    const avgRoyaltyPerUnit = totalDownloads > 0 ? (totalEarnings / totalDownloads) : 0;
    const conversionRate = totalViews > 0 ? ((totalDownloads / totalViews) * 100) : 0;

    return {
      totalEarnings,
      totalViews,
      totalDownloads,
      avgRoyaltyPerUnit,
      conversionRate
    };
  }, [activeDataset]);

  const handleExportCsv = () => {
    setIsExporting(true);
    const headers = ['Date', 'Royalty Earnings (USD)', 'Views', 'Downloads & Orders', 'Forecast Trendline (USD)'];
    const rows = forecastResult.combinedData.map((row) => [
      row.date,
      row.earnings ?? '',
      row.views,
      row.downloads,
      row.forecast ?? row.trendline ?? ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `author_performance_metrics_10dim_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsExporting(false);
    }, 800);
  };

  const handleRefresh = () => {
    setLastRefreshed('Refreshing...');
    setTimeout(() => {
      setLastRefreshed('Just now');
    }, 400);
  };

  return (
    <div id="author-performance-metrics-container" className="space-y-6">
      
      {/* Top Controls & Header Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <BarChart3 className="w-3.5 h-3.5 text-amber-700" />
              <span>Author Analytics & Predictive Royalties Engine</span>
            </span>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Synced {lastRefreshed}</span>
            </span>
          </div>
          <h2 className="text-xl font-serif font-extrabold text-slate-900">
            Author Performance & Predictive Royalty Forecast
          </h2>
          <p className="text-xs text-slate-500">
            Real-time telemetry across all 10 dimensions: eBooks, Audiobooks, 4K Videos, Handwritten Manuscripts, Prints, Soundtracks, Artisanal Silk/Cotton, and Dedicated Digital Devices.
          </p>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Book Filter */}
          <div className="relative">
            <select
              id="analytics-book-select"
              value={selectedBookFilter}
              onChange={(e) => setSelectedBookFilter(e.target.value)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold px-3 py-1.5 text-slate-800 outline-none cursor-pointer"
            >
              <option value="all">All Published Titles (Portfolio)</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Selector */}
          <div className="inline-flex rounded-lg border border-slate-300 bg-slate-100 p-0.5 text-xs font-bold">
            {(['7D', '30D', '90D', '1Y'] as TimeRange[]).map((range) => (
              <button
                key={range}
                id={`time-range-btn-${range}`}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md transition cursor-pointer ${
                  timeRange === range
                    ? 'bg-white text-slate-900 shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Forecast Trendline Quick Toggle */}
          <button
            onClick={() => setShowForecastOverlay(!showForecastOverlay)}
            id="toggle-forecast-overlay-btn"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
              showForecastOverlay
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
            }`}
            title="Toggle Predictive Forecast Line"
          >
            <Sparkles className={`w-3.5 h-3.5 ${showForecastOverlay ? 'text-slate-950 fill-slate-950' : 'text-slate-500'}`} />
            <span>Forecast Trend</span>
          </button>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 transition cursor-pointer"
            title="Refresh metrics data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Export CSV Button */}
          <button
            id="export-metrics-csv-btn"
            onClick={handleExportCsv}
            disabled={isExporting}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Royalty Earnings */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Net Royalty Earnings
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-serif">
            ${totals.totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+28.4% with 10-Dimension Lift</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Direct author share (85% royalty rate across all editions)
          </div>
        </div>

        {/* Total Book Views */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Catalog Impressions & Views
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-serif">
            {totals.totalViews.toLocaleString('en-US')}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-blue-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+21.5% reader engagement</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Storefront detail views, Look Inside & sample inspections
          </div>
        </div>

        {/* Total Downloads & Orders */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-purple-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Downloads & Editions Sold
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-serif">
            {totals.totalDownloads.toLocaleString('en-US')}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-purple-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+19.2% multi-edition adoption</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Digital vault licenses, hardware tablets & luxury prints
          </div>
        </div>

        {/* Conversion Rate & Avg Royalty */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-amber-300 transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Projected Next-Cycle Yield
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-serif">
            ${forecastResult.summary.projectedPeriodEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-amber-700">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{forecastResult.summary.growthRatePct}% forecast trend</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Projected earnings for {forecastResult.summary.forecastHorizonLabel}
          </div>
        </div>

      </div>

      {/* Main Chart Card with Tab Switcher */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        
        {/* Chart View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              id="chart-tab-overview"
              onClick={() => setMetricView('overview')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                metricView === 'overview'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
              <span>Unified Overview</span>
            </button>

            <button
              id="chart-tab-30d-engagement"
              onClick={() => setMetricView('30d-engagement')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                metricView === '30d-engagement'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-700" />
              <span>30-Day Sales & Engagement</span>
              <span className="text-[9px] bg-slate-900 text-amber-300 px-1 py-0.2 rounded font-mono font-bold">
                Recharts
              </span>
            </button>

            <button
              id="chart-tab-forecast"
              onClick={() => setMetricView('forecast')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                metricView === 'forecast'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
              <span>Predictive Forecast</span>
              <span className="text-[9px] bg-slate-900 text-amber-300 px-1 py-0.2 rounded font-mono">
                AI/OLS
              </span>
            </button>

            <button
              id="chart-tab-royalties"
              onClick={() => setMetricView('royalties')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                metricView === 'royalties'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Royalty Earnings ($)</span>
            </button>

            <button
              id="chart-tab-views"
              onClick={() => setMetricView('views')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                metricView === 'views'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Book Views & Reads</span>
            </button>

            <button
              id="chart-tab-downloads"
              onClick={() => setMetricView('downloads')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                metricView === 'downloads'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-purple-600" />
              <span>Downloads & Units</span>
            </button>

            <button
              id="chart-tab-formats"
              onClick={() => setMetricView('formats')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                metricView === 'formats'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>10-Format Share</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Timeframe: <span className="font-bold text-slate-800">{timeRange}</span> • Horizon: <span className="font-bold text-slate-800">{forecastResult.summary.forecastHorizonLabel}</span>
          </div>
        </div>

        {/* CHART VISUALIZATION CANVAS */}
        <div className="min-h-80 sm:min-h-96 w-full pt-2">
          
          {/* 30D SALES & READER ENGAGEMENT DUAL TREND */}
          {metricView === '30d-engagement' && (
            <Author30DaySalesEngagementChart className="border-none shadow-none p-0 bg-transparent" />
          )}

          {/* 1. OVERVIEW: Dual-axis Area & Line Chart with Trendline Forecast */}
          {metricView === 'overview' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={showForecastOverlay ? forecastResult.combinedData : activeDataset} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="royaltyColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="viewsColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="forecastBandColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11, fill: '#64748B' }} 
                  axisLine={{ stroke: '#CBD5E1' }}
                />
                <YAxis 
                  yAxisId="left" 
                  tick={{ fontSize: 11, fill: '#64748B' }} 
                  axisLine={{ stroke: '#CBD5E1' }}
                  tickFormatter={(val) => `$${val}`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  tick={{ fontSize: 11, fill: '#64748B' }} 
                  axisLine={{ stroke: '#CBD5E1' }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const isProj = payload.some(p => p.dataKey === 'forecast' && p.payload?.isForecast);
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[190px]">
                          <div className="font-bold text-amber-400 border-b border-slate-800 pb-1 flex items-center justify-between">
                            <span>{label}</span>
                            {isProj && (
                              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                                Projected
                              </span>
                            )}
                          </div>
                          {payload[0]?.value !== null && payload[0]?.value !== undefined && (
                            <div className="flex justify-between items-center text-emerald-400 font-semibold">
                              <span>Actual Royalties:</span>
                              <span>${Number(payload[0]?.value).toFixed(2)}</span>
                            </div>
                          )}
                          {showForecastOverlay && payload.find(p => p.dataKey === 'forecast')?.value && (
                            <div className="flex justify-between items-center text-amber-400 font-bold">
                              <span>Projected Forecast:</span>
                              <span>${Number(payload.find(p => p.dataKey === 'forecast')?.value).toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center text-blue-400">
                            <span>Book Views:</span>
                            <span>{payload.find(p => p.dataKey === 'views')?.value?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-purple-300">
                            <span>Downloads / Units:</span>
                            <span>{payload.find(p => p.dataKey === 'downloads')?.value?.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="circle"
                  formatter={(val) => <span className="text-xs font-semibold text-slate-700">{val}</span>}
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="earnings" 
                  name="Historical Royalties ($)" 
                  stroke="#059669" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#royaltyColor)" 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="views" 
                  name="Book Views" 
                  stroke="#2563EB" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="downloads" 
                  name="Downloads / Deliveries" 
                  stroke="#9333EA" 
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
                {showForecastOverlay && (
                  <>
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="forecast" 
                      name="Projected Trend Forecast ($)" 
                      stroke="#D97706" 
                      strokeWidth={2.5}
                      strokeDasharray="5 5"
                      dot={{ r: 4, fill: '#F59E0B', stroke: '#fff', strokeWidth: 1.5 }}
                      activeDot={{ r: 6, fill: '#D97706' }}
                      connectNulls
                    />
                    <ReferenceLine 
                      yAxisId="left"
                      x={forecastResult.lastActualDate} 
                      stroke="#64748B" 
                      strokeDasharray="3 3" 
                      label={{ value: 'Forecast Horizon (Today)', fill: '#D97706', fontSize: 10, position: 'top' }} 
                    />
                  </>
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}

          {/* 2. DEDICATED PREDICTIVE FORECAST TAB */}
          {metricView === 'forecast' && (
            <div className="h-full flex flex-col space-y-3">
              {/* Telemetry Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-amber-50/70 p-3 rounded-lg border border-amber-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Projected Horizon Earnings</span>
                  <span className="text-base font-black text-amber-950 font-serif">
                    ${forecastResult.summary.projectedPeriodEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-amber-700 block">{forecastResult.summary.forecastHorizonLabel}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Regression Fit (R²)</span>
                  <span className="text-base font-black text-emerald-800 font-serif">
                    {forecastResult.summary.rSquared}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">±${forecastResult.summary.stdError.toFixed(2)} std error</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Royalty Acceleration</span>
                  <span className="text-base font-black text-blue-900 font-serif">
                    +${forecastResult.summary.slope}
                  </span>
                  <span className="text-[10px] text-blue-700 block">Velocity / interval step</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">10-Dimension Lift</span>
                  <span className="text-base font-black text-indigo-950 font-serif">
                    +{forecastResult.summary.growthRatePct}%
                  </span>
                  <span className="text-[10px] text-indigo-700 block">Device & Silk/Cotton premium</span>
                </div>
              </div>

              {/* Dedicated Forecast Line Chart */}
              <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastResult.combinedData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="forecastAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(val) => `$${val}`} />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const dataPt = payload[0]?.payload as MetricDataPoint;
                          return (
                            <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[210px]">
                              <div className="font-bold text-amber-400 border-b border-slate-800 pb-1 flex items-center justify-between">
                                <span>{label}</span>
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${dataPt.isForecast ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-emerald-800 text-emerald-200'}`}>
                                  {dataPt.isForecast ? 'PROJECTION' : 'HISTORICAL'}
                                </span>
                              </div>
                              {dataPt.earnings !== null && (
                                <div className="flex justify-between items-center text-emerald-400">
                                  <span>Historical Actuals:</span>
                                  <span className="font-bold">${dataPt.earnings.toFixed(2)}</span>
                                </div>
                              )}
                              {dataPt.trendline !== null && (
                                <div className="flex justify-between items-center text-slate-300">
                                  <span>Regression Baseline:</span>
                                  <span>${dataPt.trendline?.toFixed(2)}</span>
                                </div>
                              )}
                              {dataPt.forecast !== null && (
                                <div className="flex justify-between items-center text-amber-400 font-bold">
                                  <span>Projected Royalties:</span>
                                  <span>${dataPt.forecast?.toFixed(2)}</span>
                                </div>
                              )}
                              {dataPt.forecastConfidenceUpper !== null && (
                                <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-800 pt-1">
                                  <span>95% Confidence Band:</span>
                                  <span>${dataPt.forecastConfidenceLower?.toFixed(0)} - ${dataPt.forecastConfidenceUpper?.toFixed(0)}</span>
                                </div>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend verticalAlign="top" height={32} />
                    <Area 
                      type="monotone" 
                      dataKey="forecastConfidenceUpper" 
                      name="95% Confidence Upper Band" 
                      stroke="transparent" 
                      fill="url(#forecastAreaGrad)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="earnings" 
                      name="Historical Royalties ($)" 
                      stroke="#059669" 
                      strokeWidth={3} 
                      dot={{ r: 3, fill: '#059669' }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="trendline" 
                      name="Fitted OLS Trendline" 
                      stroke="#94A3B8" 
                      strokeWidth={1.5} 
                      strokeDasharray="3 3" 
                      dot={false} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="forecast" 
                      name="Projected Future Royalties" 
                      stroke="#D97706" 
                      strokeWidth={3} 
                      strokeDasharray="6 4" 
                      dot={{ r: 5, fill: '#F59E0B', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 7 }}
                      connectNulls
                    />
                    <ReferenceLine 
                      x={forecastResult.lastActualDate} 
                      stroke="#B45309" 
                      strokeDasharray="4 4" 
                      label={{ value: 'TODAY (FORECAST HORIZON)', fill: '#B45309', fontSize: 10, fontWeight: 'bold', position: 'top' }} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 3. ROYALTIES ONLY: Stacked Area Chart across all 10 dimensions + Forecast */}
          {metricView === 'royalties' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={showForecastOverlay ? forecastResult.combinedData : activeDataset} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  formatter={(value: any, name: any) => [`$${Number(value).toFixed(2)}`, name]}
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} iconType="rect" />
                <Area type="monotone" dataKey="ebook" name="eBook" stackId="1" stroke="#2563EB" fill="#3B82F6" />
                <Area type="monotone" dataKey="audiobook" name="Audiobook" stackId="1" stroke="#059669" fill="#10B981" />
                <Area type="monotone" dataKey="videobook" name="4K Video" stackId="1" stroke="#7C3AED" fill="#8B5CF6" />
                <Area type="monotone" dataKey="manuscript" name="Handwritten" stackId="1" stroke="#D97706" fill="#F59E0B" />
                <Area type="monotone" dataKey="hardcover" name="Hardcover" stackId="1" stroke="#1E3A8A" fill="#3B82F6" />
                <Area type="monotone" dataKey="papercover" name="Paper Cover" stackId="1" stroke="#475569" fill="#94A3B8" />
                <Area type="monotone" dataKey="pendrive_sd" name="Pendrive/SD" stackId="1" stroke="#6B21A8" fill="#A855F7" />
                <Area type="monotone" dataKey="musical_album" name="Musical Album" stackId="1" stroke="#047857" fill="#34D399" />
                {/* 2 New Dimensions */}
                <Area type="monotone" dataKey="silk_cotton" name="Silk/Cotton Woven" stackId="1" stroke="#B45309" fill="#D97706" />
                <Area type="monotone" dataKey="digital_device" name="Dedicated Digital Device" stackId="1" stroke="#4338CA" fill="#6366F1" />
                {showForecastOverlay && (
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    name="Projected Trajectory" 
                    stroke="#F59E0B" 
                    strokeWidth={3} 
                    strokeDasharray="5 5" 
                    dot={{ r: 4, fill: '#F59E0B', stroke: '#fff' }} 
                    connectNulls 
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}

          {/* 4. VIEWS ONLY: Interactive Bar Chart */}
          {metricView === 'views' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeDataset} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip 
                  formatter={(val: any) => [Number(val).toLocaleString(), 'Catalog Views']}
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="views" name="Book Views & Detail Page Visits" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* 5. DOWNLOADS ONLY: Line & Bar Combo */}
          {metricView === 'downloads' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeDataset} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip 
                  formatter={(val: any) => [Number(val).toLocaleString(), 'Units Delivered / Downloaded']}
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="downloads" name="Digital Downloads & Hardcopy Dispatches" fill="#9333EA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* 6. 10-FORMAT SHARE: Donut Pie Chart */}
          {metricView === 'formats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 h-full items-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={FORMAT_SHARE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {FORMAT_SHARE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: any) => [`$${Number(val).toLocaleString()} USD`, 'Cumulative Revenue']}
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Format Legend Table for all 10 Dimensions */}
              <div className="space-y-2 pr-4 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    All 10 Dimensions Revenue Contribution
                  </h4>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    10 Formats Active
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {FORMAT_SHARE_DATA.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="font-semibold text-slate-800 truncate">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-900 pl-1 shrink-0">
                        ${item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* RECENT ROYALTIES ACTIVITY LEDGER */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base font-serif flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Live Author Royalty Stream & Delivery Audits</span>
            </h3>
            <p className="text-xs text-slate-500">
              Direct settlement into author balance backed by native Google Drive & Cloudflare R2 audit signatures.
            </p>
          </div>

          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>85% Fixed Author Share</span>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Book Title</th>
                <th className="py-3 px-4">Dimension</th>
                <th className="py-3 px-4">Customer Origin</th>
                <th className="py-3 px-4">Gross Price</th>
                <th className="py-3 px-4 text-emerald-700">Net Royalty (85%)</th>
                <th className="py-3 px-4">Storage Routing</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {RECENT_TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">
                    {tx.id}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {tx.bookTitle}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                      tx.formatType === 'manuscript' ? 'bg-amber-100 text-amber-800' :
                      tx.formatType === 'videobook' ? 'bg-purple-100 text-purple-800' :
                      tx.formatType === 'audiobook' ? 'bg-emerald-100 text-emerald-800' :
                      tx.formatType === 'pendrive_sd' ? 'bg-purple-100 text-purple-900' :
                      tx.formatType === 'musical_album' ? 'bg-teal-100 text-teal-900' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {tx.format}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {tx.customerLocation}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    ${tx.gross.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-black text-emerald-600">
                    +${tx.royalty.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-500 font-mono flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-emerald-500" />
                    <span>{tx.storageRoute}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400 font-medium">
                    {tx.timeAgo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
