import React, { useEffect, useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, Tooltip as RechartsTooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Calendar, Download, Search, ListFilter, ArrowUpDown, MoreHorizontal, ChevronLeft, ChevronRight, Banknote, ShoppingBag, UserPlus, PieChart, TrendingUp, TrendingDown, X, User, Hash, CreditCard, Clock, CheckCircle2, XCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { apiRequest } from '../lib/apiClient';

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');
const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'ETB',
  maximumFractionDigits: 2,
});

const TRANSACTION_CURRENCY_FORMATTER = new Intl.NumberFormat('en-ET', {
  style: 'currency',
  currency: 'ETB',
  maximumFractionDigits: 2,
});

const STATUS_FILTERS = [
  { label: 'All order', value: 'All' },
  { label: 'Success', value: 'success' },
  { label: 'Failed', value: 'failed' },
];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const toInputDateValue = (date) => {
  const safeDate = new Date(date);
  if (Number.isNaN(safeDate.getTime())) return '';
  return safeDate.toISOString().slice(0, 10);
};

const getInitialDateRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    startDate: toInputDateValue(start),
    endDate: toInputDateValue(end),
  };
};

const toReadableDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return `${date.toLocaleString('en-US', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
};

const formatDateRangeLabel = ({ startDate, endDate }) => {
  if (!startDate || !endDate) return 'Select date range';
  return `${toReadableDate(startDate)} - ${toReadableDate(endDate)}`;
};

const buildFinanceQueryString = ({ page, limit, status, search, startDate, endDate }) => {
  const params = new URLSearchParams();

  if (page) params.set('page', String(page));
  if (limit) params.set('limit', String(limit));
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);

  return params.toString();
};

const asRangeStartTime = (value) => {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date.getTime();
};

const asRangeEndTime = (value) => {
  if (!value) return null;
  const date = new Date(`${value}T23:59:59.999`);
  return Number.isNaN(date.getTime()) ? null : date.getTime();
};

const isTransactionWithinDateRange = (transactionDate, startDate, endDate) => {
  const time = new Date(transactionDate).getTime();
  if (Number.isNaN(time)) return false;

  const startTime = asRangeStartTime(startDate);
  const endTime = asRangeEndTime(endDate);

  if (startTime && time < startTime) return false;
  if (endTime && time > endTime) return false;
  return true;
};

const escapeCsvCell = (value) => {
  const stringValue = String(value ?? '');
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const formatCurrency = (value) => CURRENCY_FORMATTER.format(Number(value || 0));

const formatTransactionCurrency = (value) => TRANSACTION_CURRENCY_FORMATTER.format(Number(value || 0));

const formatPercent = (value) => `${Number(value || 0).toFixed(1)}%`;

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
};

const toTitleCase = (value) => String(value || '').charAt(0).toUpperCase() + String(value || '').slice(1);

const formatStatus = (value) => {
  const status = String(value || '').toLowerCase();
  if (['success', 'successful', 'complete', 'completed', 'paid'].includes(status)) {
    return { label: 'Complete', textClass: 'text-success', dotClass: 'bg-success' };
  }

  if (status === 'pending') {
    return { label: 'Pending', textClass: 'text-warning', dotClass: 'bg-warning' };
  }

  if (status === 'failed') {
    return { label: 'Failed', textClass: 'text-error', dotClass: 'bg-error' };
  }

  return { label: toTitleCase(status || '-'), textClass: 'text-muted-foreground', dotClass: 'bg-muted-foreground' };
};

const CustomBlueBar = (props) => {
  const { x, y, width, height, fill } = props;
  const GAP = 8; 
  if (height <= GAP) return null;
  return <rect x={x} y={y} width={width} height={height - GAP} fill={fill} />;
};

const FinanceAnalytics = ({ embedded = false }) => {
  const initialRange = useMemo(() => getInitialDateRange(), []);

  const [overview, setOverview] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [ordersRefundsData, setOrdersRefundsData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState(initialRange);
  const [draftDateRange, setDraftDateRange] = useState(initialRange);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError('');

        const dashboardQuery = buildFinanceQueryString({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        });

        const [overviewRes, revenueRes, ordersVsRefundsRes] = await Promise.all([
          apiRequest(`/api/admin/finance/overview?${dashboardQuery}`),
          apiRequest(`/api/admin/finance/revenue-over-time?${dashboardQuery}`),
          apiRequest(`/api/admin/finance/orders-vs-refunds?${dashboardQuery}`),
        ]);

        if (!isMounted) return;

        setOverview(overviewRes || null);

        const revenueMap = new Map((revenueRes || []).map((entry) => [entry.day, Number(entry.revenue || 0)]));
        const normalizedRevenue = WEEK_DAYS.map((day) => ({
          name: day.toUpperCase(),
          value: revenueMap.get(day) || 0,
        }));
        setRevenueData(normalizedRevenue);

        const ordersData = Array.isArray(ordersVsRefundsRes?.ordersData) ? ordersVsRefundsRes.ordersData : [];
        const refundsData = Array.isArray(ordersVsRefundsRes?.refundsData) ? ordersVsRefundsRes.refundsData : [];

        const orderMap = new Map(ordersData.map((entry) => [entry._id, Number(entry.totalOrders || 0)]));
        const refundMap = new Map(refundsData.map((entry) => [entry._id, Number(entry.totalRefunds || 0)]));
        const weekKeys = Array.from(new Set([...orderMap.keys(), ...refundMap.keys()])).sort((a, b) => a - b);
        const selectedWeeks = weekKeys.slice(-4);

        const normalizedWeeks = selectedWeeks.map((weekNumber, index) => ({
          name: `WK${index + 1}`,
          orders: orderMap.get(weekNumber) || 0,
          refunds: refundMap.get(weekNumber) || 0,
        }));

        setOrdersRefundsData(
          normalizedWeeks.length > 0
            ? normalizedWeeks
            : [
                { name: 'WK1', orders: 0, refunds: 0 },
                { name: 'WK2', orders: 0, refunds: 0 },
                { name: 'WK3', orders: 0, refunds: 0 },
                { name: 'WK4', orders: 0, refunds: 0 },
              ]
        );
      } catch (fetchError) {
        if (!isMounted) return;
        setError(fetchError.message || 'Failed to load finance analytics');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [dateRange.endDate, dateRange.startDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      setSearchQuery(searchInput.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let isMounted = true;

    const fetchTransactions = async () => {
      try {
        setIsTableLoading(true);
        const queryString = buildFinanceQueryString({
          page: currentPage,
          limit: 10,
          status: statusFilter,
          search: searchQuery,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        });

        const response = await apiRequest(`/api/admin/finance/transactions?${queryString}`);

        if (!isMounted) return;

        setTransactions(Array.isArray(response?.transactions) ? response.transactions : []);
        setTotalCount(Number(response?.totalCount || 0));
        setTotalPages(Math.max(Number(response?.totalPages || 1), 1));
      } catch (fetchError) {
        if (!isMounted) return;
        setError(fetchError.message || 'Failed to load transactions');
      } finally {
        if (isMounted) setIsTableLoading(false);
      }
    };

    fetchTransactions();

    return () => {
      isMounted = false;
    };
  }, [currentPage, dateRange.endDate, dateRange.startDate, searchQuery, statusFilter]);

  const cards = useMemo(
    () => [
      {
        title: 'Total Revenue',
        value: formatCurrency(overview?.totalRevenue),
        change: '+0.0%',
        trend: 'up',
        icon: Banknote,
        iconBg: 'bg-muted',
        iconColor: 'text-primary',
      },
      {
        title: 'Avg. Order Value',
        value: formatCurrency(overview?.avgOrderValue),
        change: '+0.0%',
        trend: 'up',
        icon: ShoppingBag,
        iconBg: 'bg-accent',
        iconColor: 'text-accent-foreground',
      },
      {
        title: 'Acquisition Cost',
        value: formatCurrency(overview?.acquisitionCost),
        change: '-0.0%',
        trend: 'down',
        icon: UserPlus,
        iconBg: 'bg-destructive',
        iconColor: 'text-destructive-foreground',
      },
      {
        title: 'Profit Margin',
        value: formatPercent(overview?.profitMargin),
        change: '+0.0%',
        trend: 'up',
        icon: PieChart,
        iconBg: 'bg-secondary',
        iconColor: 'text-secondary-foreground',
      },
    ],
    [overview]
  );

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  }, [currentPage, totalPages]);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const onSelectStatus = (value) => {
    setCurrentPage(1);
    setStatusFilter(value);
  };

  const onOpenDateRange = () => {
    setDraftDateRange(dateRange);
    setIsDatePickerOpen((prev) => !prev);
  };

  const onApplyDateRange = () => {
    if (draftDateRange.startDate && draftDateRange.endDate && draftDateRange.startDate > draftDateRange.endDate) {
      setError('Start date cannot be after end date.');
      return;
    }

    setError('');
    setCurrentPage(1);
    setDateRange(draftDateRange);
    setIsDatePickerOpen(false);
  };

  const onResetDateRange = () => {
    setError('');
    setCurrentPage(1);
    setDraftDateRange(initialRange);
    setDateRange(initialRange);
    setIsDatePickerOpen(false);
  };

  const onExportTransactions = async () => {
    try {
      setIsExporting(true);
      setError('');

      const queryString = buildFinanceQueryString({
        page: 1,
        limit: 1000,
        status: statusFilter,
        search: searchQuery,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      const response = await apiRequest(`/api/admin/finance/transactions?${queryString}`);
      const fetchedTransactions = Array.isArray(response?.transactions) ? response.transactions : [];

      const dateFilteredTransactions = fetchedTransactions.filter((transaction) =>
        isTransactionWithinDateRange(transaction.createdAt, dateRange.startDate, dateRange.endDate)
      );

      if (dateFilteredTransactions.length === 0) {
        setError('No transactions available for export in the selected range.');
        return;
      }

      const header = ['Customer ID', 'Name', 'Date', 'Amount', 'Currency', 'Status', 'TX Ref', 'Chapa Ref'];
      const rows = dateFilteredTransactions.map((transaction) => {
        const customerId = transaction.userId?._id ? `#${String(transaction.userId._id).slice(-6).toUpperCase()}` : '#UNKNOWN';
        const name = transaction.userId?.name || 'Unknown';
        const date = formatDate(transaction.createdAt);
        const amount = Number(transaction.amount || 0).toFixed(2);
        const currency = transaction.currency || 'ETB';
        const status = formatStatus(transaction.status).label;
        const txRef = transaction.tx_ref || '';
        const chapaRef = transaction.chapa_reference || '';

        return [customerId, name, date, amount, currency, status, txRef, chapaRef];
      });

      const csv = [header, ...rows]
        .map((row) => row.map(escapeCsvCell).join(','))
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const exportDate = toInputDateValue(new Date());

      link.href = url;
      link.setAttribute('download', `finance-transactions-${exportDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (exportError) {
      setError(exportError.message || 'Failed to export transactions');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-background text-sm ${embedded ? "p-6 md:p-10 pb-24 lg:pb-10 w-full" : "p-8 pt-20"}`}>
      <div className={embedded ? "w-full" : "max-w-7xl mx-auto xl:px-4"}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-muted-foreground font-medium text-[11px] mb-1.5 uppercase tracking-wider">Financial Overview</p>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Revenue Dashboard</h1>
          </div>
          <div className="flex gap-3 relative">
            <div className="relative">
              <button
                type="button"
                onClick={onOpenDateRange}
                className="flex items-center gap-2 bg-surface-soft px-4 py-2.5 shadow-sm rounded-2xl text-primary font-medium text-xs hover:bg-muted transition-colors"
              >
                <Calendar className="w-4 h-4 text-primary" />
                {formatDateRangeLabel(dateRange)}
              </button>

              {isDatePickerOpen ? (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border bg-card p-4 shadow-lg z-20">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Select date range</p>
                  <div className="grid grid-cols-1 gap-3">
                    <label className="text-xs font-medium text-muted-foreground">
                      Start date
                      <input
                        type="date"
                        value={draftDateRange.startDate}
                        onChange={(event) => setDraftDateRange((prev) => ({ ...prev, startDate: event.target.value }))}
                        className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none"
                      />
                    </label>
                    <label className="text-xs font-medium text-muted-foreground">
                      End date
                      <input
                        type="date"
                        value={draftDateRange.endDate}
                        onChange={(event) => setDraftDateRange((prev) => ({ ...prev, endDate: event.target.value }))}
                        className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none"
                      />
                    </label>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsDatePickerOpen(false)}
                      className="rounded-lg border px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={onResetDateRange}
                      className="rounded-lg border px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={onApplyDateRange}
                      className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onExportTransactions}
              disabled={isExporting}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-xs shadow-md hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {cards.map((card, idx) => {
            const isUp = card.trend === 'up';
            return (
              <div key={idx} className="bg-card p-6 rounded-[20px] shadow-sm border flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-11.5 h-11.5 rounded-[16px] flex items-center justify-center ${card.iconBg} bg-opacity-80`}>
                    <card.icon className={`w-5.5 h-5.5 ${card.iconColor}`} fill="none" strokeWidth={2.5} />
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-[12px] font-bold flex items-center gap-1.5 ${isUp ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'}`}>
                    {isUp ? <TrendingUp className="w-3.5 h-3.5" strokeWidth={2.5} /> : <TrendingDown className="w-3.5 h-3.5" strokeWidth={2.5} />}
                    {card.change}
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest mb-1.5">{card.title}</h3>
                  <p className="text-[18px] lg:text-[20px] font-black text-foreground tracking-tight leading-none">{isLoading ? '...' : card.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Area Chart */}
          <div className="bg-card p-6 rounded-2xl shadow-sm border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-foreground tracking-tight">Revenue over time</h2>
              <div className="flex gap-1 bg-muted p-1 rounded-full border">
                <button className="px-4 py-1.5 bg-card text-primary shadow-sm rounded-full text-xs font-semibold transition-all">Daily</button>
                <button className="px-4 py-1.5 text-muted-foreground rounded-full text-xs font-medium hover:text-foreground transition-all">Weekly</button>
              </div>
            </div>
            <div className="h-70">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 600 }} dy={10} />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders vs Refunds Bar Chart */}
          <div className="bg-card p-6 rounded-2xl shadow-sm border">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold text-foreground tracking-tight">Orders vs Refunds</h2>
              <div className="flex gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-xs font-medium text-muted-foreground">Orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-chart-2"></div>
                  <span className="text-xs font-medium text-muted-foreground">Refunds</span>
                </div>
              </div>
            </div>
            <div className="h-65">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersRefundsData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} barGap={0}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 600 }} dy={10} />
                  <RechartsTooltip
                    cursor={{ fill: 'transparent' }}
                  />
                  <Bar dataKey="refunds" stackId="a" fill="var(--chart-2)" radius={[10, 10, 0, 0]} barSize={16} />
                  <Bar dataKey="orders" stackId="a" fill="var(--chart-1)" shape={<CustomBlueBar />} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground tracking-tight mb-5">Recent Transactions</h2>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-0 gap-4">
              <div className="flex gap-8">
                {STATUS_FILTERS.map((status) => {
                  const active = statusFilter === status.value;

                  return (
                    <button
                      key={status.value}
                      onClick={() => onSelectStatus(status.value)}
                      className={`${active ? 'text-primary font-bold border-primary -mb-0.5' : 'text-muted-foreground font-medium border-transparent hover:text-foreground'} text-sm pb-3 border-b-2 transition-colors`}
                    >
                      {status.label}
                      {status.value === 'All' ? (
                        <span className="font-medium text-primary/70"> ({NUMBER_FORMATTER.format(totalCount)})</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 relative pb-2 md:pb-0">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search payment history"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setCurrentPage(1);
                        setSearchQuery(searchInput.trim());
                      }
                    }}
                    className="pl-10 pr-4 py-2.5 bg-muted rounded-xl text-[13px] font-medium placeholder:text-muted-foreground text-foreground w-64 outline-none transition-colors"
                  />
                </div>
                <button className="w-10 h-10 border rounded-xl text-muted-foreground hover:bg-muted flex items-center justify-center bg-card shadow-sm ml-2">
                  <ListFilter className="w-5 h-5 stroke-2" />
                </button>
                <button className="w-10 h-10 border rounded-xl text-muted-foreground hover:bg-muted flex items-center justify-center bg-card shadow-sm">
                  <ArrowUpDown className="w-5 h-5 stroke-2" />
                </button>
                <button className="w-12 h-10 border rounded-xl text-muted-foreground hover:bg-muted flex items-center justify-center bg-card shadow-sm">
                  <MoreHorizontal className="w-5 h-5 stroke-2" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm mt-2">
              <thead>
                <tr className="text-[13px] text-muted-foreground font-bold capitalize border-b">
                  <th className="pb-4 pt-2">Customer Id</th>
                  <th className="pb-4 pt-2">Name</th>
                  <th className="pb-4 pt-2">Date</th>
                  <th className="pb-4 pt-2">Total</th>
                  <th className="pb-4 pt-2">Method</th>
                  <th className="pb-4 pt-2">Status</th>
                  <th className="pb-4 pt-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {isTableLoading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground font-medium">Loading transactions...</td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground font-medium">No transactions found.</td>
                  </tr>
                ) : (
                  transactions.map((tr) => {
                    const formattedStatus = formatStatus(tr.status);
                    const customerId = tr.userId?._id ? `#${String(tr.userId._id).slice(-6).toUpperCase()}` : '#UNKNOWN';

                    return (
                      <tr key={tr._id} className="border-border/50 hover:bg-muted/50 transition-colors group">
                        <td className="py-5 text-foreground font-bold">{customerId}</td>
                        <td className="py-5 text-foreground font-medium">{tr.userId?.name || 'Unknown'}</td>
                        <td className="py-5 text-muted-foreground font-medium">{formatDate(tr.createdAt)}</td>
                        <td className="py-5 text-foreground font-bold tracking-tight">{formatTransactionCurrency(tr.amount)}</td>
                        <td className="py-5 text-muted-foreground font-medium">{tr.currency || 'ETB'}</td>
                        <td className="py-5">
                          <span className={`inline-flex items-center gap-1.5 font-medium text-[13px] ${formattedStatus.textClass}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${formattedStatus.dotClass}`}></div>
                            {formattedStatus.label}
                          </span>
                        </td>
                        <td className="py-5 text-right">
                          <button
                            onClick={() => {
                              setSelectedTransaction(tr);
                              setIsDetailOpen(true);
                            }}
                            className="text-primary font-bold text-[13px] hover:text-primary/80 transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-8 border-t pt-6">
              <button
                onClick={() => canGoPrev && setCurrentPage((prev) => prev - 1)}
                disabled={!canGoPrev}
                className="flex items-center gap-1 text-muted-foreground font-medium text-[13px] hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex gap-1.5">
                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium text-[13px] transition-colors ${
                      pageNumber === currentPage
                        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                {totalPages > pageNumbers[pageNumbers.length - 1] ? (
                  <span className="w-8 h-8 flex items-center justify-center text-muted-foreground font-bold tracking-widest">...</span>
                ) : null}
                {totalPages > pageNumbers[pageNumbers.length - 1] ? (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground font-medium text-[13px] transition-colors"
                  >
                    {totalPages}
                  </button>
                ) : null}
            </div>
              <button
                onClick={() => canGoNext && setCurrentPage((prev) => prev + 1)}
                disabled={!canGoNext}
                className="flex items-center gap-1 text-muted-foreground font-medium text-[13px] hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ── Transaction Detail Modal ── */}
      {isDetailOpen && selectedTransaction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-end"
          onClick={() => setIsDetailOpen(false)}
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
        >
          {/* Drawer panel */}
          <div
            className="relative h-full w-full max-w-md bg-card shadow-2xl flex flex-col overflow-y-auto"
            style={{ animation: 'slideInRight 0.25s ease-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-card z-10">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Transaction</p>
                <h2 className="text-xl font-black text-foreground tracking-tight">Details</h2>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 px-6 py-6 space-y-5">
              {/* Status Banner */}
              {(() => {
                const s = formatStatus(selectedTransaction.status);
                const isSuccess = s.label === 'Complete';
                const isPending = s.label === 'Pending';
                return (
                  <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 ${
                    isSuccess ? 'bg-success/10 border border-success/20' :
                    isPending ? 'bg-warning/10 border border-warning/20' :
                    'bg-error/10 border border-error/20'
                  }`}>
                    {isSuccess ? (
                      <CheckCircle2 className="w-7 h-7 text-success shrink-0" />
                    ) : isPending ? (
                      <AlertCircle className="w-7 h-7 text-warning-foreground shrink-0" />
                    ) : (
                      <XCircle className="w-7 h-7 text-error shrink-0" />
                    )}
                    <div>
                      <p className={`text-lg font-black ${s.textClass}`}>{s.label}</p>
                      <p className="text-xs text-muted-foreground font-medium">Payment Status</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-xl font-black text-foreground">{formatTransactionCurrency(selectedTransaction.amount)}</p>
                      <p className="text-xs text-muted-foreground font-medium">{selectedTransaction.currency || 'ETB'}</p>
                    </div>
                  </div>
                );
              })()}

              {/* Customer Info */}
              <div className="bg-muted/40 rounded-2xl p-5 border space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Customer</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{selectedTransaction.userId?.name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">{selectedTransaction.userId?.email || 'No email'}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="font-mono text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-lg">
                      #{selectedTransaction.userId?._id ? String(selectedTransaction.userId._id).slice(-6).toUpperCase() : 'UNKNOWN'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transaction References */}
              <div className="bg-muted/40 rounded-2xl p-5 border space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">References</p>

                <div className="space-y-3">
                  {/* TX Ref */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Hash className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground font-medium mb-0.5">TX Reference</p>
                        <p className="font-mono text-xs font-bold text-foreground truncate">{selectedTransaction.tx_ref || '—'}</p>
                      </div>
                    </div>
                    {selectedTransaction.tx_ref && (
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedTransaction.tx_ref)}
                        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title="Copy"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Chapa Ref */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground font-medium mb-0.5">Chapa Reference</p>
                        <p className="font-mono text-xs font-bold text-foreground truncate">{selectedTransaction.chapa_reference || '—'}</p>
                      </div>
                    </div>
                    {selectedTransaction.chapa_reference && (
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedTransaction.chapa_reference)}
                        className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title="Copy"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-muted/40 rounded-2xl p-5 border">
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Payment Info</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <CreditCard className="w-4 h-4" /> Method
                    </span>
                    <span className="text-xs font-bold text-foreground">{selectedTransaction.payment_method || selectedTransaction.currency || 'Chapa'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <Banknote className="w-4 h-4" /> Currency
                    </span>
                    <span className="text-xs font-bold text-foreground">{selectedTransaction.currency || 'ETB'}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-medium">Total Amount</span>
                    <span className="text-base font-black text-foreground">{formatTransactionCurrency(selectedTransaction.amount)}</span>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-muted/40 rounded-2xl p-5 border">
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Timeline</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <Clock className="w-4 h-4" /> Created
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {selectedTransaction.createdAt
                        ? new Date(selectedTransaction.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                        : '—'}
                    </span>
                  </div>
                  {selectedTransaction.updatedAt && selectedTransaction.updatedAt !== selectedTransaction.createdAt && (
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Clock className="w-4 h-4" /> Updated
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        {new Date(selectedTransaction.updatedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t sticky bottom-0 bg-card">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="w-full py-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-in animation keyframe */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FinanceAnalytics;
