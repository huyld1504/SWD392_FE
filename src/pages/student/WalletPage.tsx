import { useState, useMemo } from 'react';
import { useMyWallets, useTransactions } from '@/hooks/useWallets';
import { format } from 'date-fns';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function WalletPage() {
  const { data: wallets, isLoading: isLoadingWallets } = useMyWallets();

  // Pick the MAIN wallet
  const mainWallet = useMemo(() => {
    return wallets?.find((w) => w.walletType === 'MAIN') || wallets?.[0];
  }, [wallets]);

  // Date filters
  const [fromDate, setFromDate] = useState('2026-03-01');
  const [toDate, setToDate] = useState('2026-03-31');

  // Load transactions
  const { data: transactionsData, isLoading: isLoadingTransactions } = useTransactions(
    mainWallet?.walletId ?? 0,
    { page: 1, limit: 10, startDate: fromDate, endDate: toDate }
  );

  const transactions = transactionsData?.data || [];
  const totalElements = transactionsData?.totalItems || 0;

  if (isLoadingWallets) {
    return <LoadingSpinner fullScreen text="Đang tải ví..." />;
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-6xl mx-auto w-full font-sans">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Ví của tôi</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý số dư BLUE và lịch sử giao dịch của bạn.</p>
      </div>

      {/* Wallet Card */}
      <div className="mb-10">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-[#087a71] p-8 text-white shadow-xl shadow-teal-600/20">
          {/* Decorative background element */}
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-black/10 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-teal-50/80 uppercase tracking-widest">
                    Ví chính ({mainWallet?.walletType || 'MAIN'})
                  </p>
                  <span className="px-2 py-0.5 bg-green-400/20 border border-green-400/30 text-[10px] font-bold text-green-300 rounded-full uppercase">
                    {mainWallet?.status === 'LOCKED' ? 'Bị khóa' : 'Hoạt động'}
                  </span>
                </div>
                <p className="text-4xl font-black tracking-tighter">
                  {mainWallet?.balance || 0} <span className="text-2xl">💙 BLUE</span>
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-teal-50/60 font-mono text-sm">
                <span className="material-symbols-outlined text-sm">key</span>
                ID Ví: WS-{mainWallet?.walletId?.toString().padStart(8, '0') || '00000000'}
              </div>
              <div className="flex gap-2">
                <button className="bg-white text-teal-700 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-teal-50 transition-colors flex items-center gap-2 shadow-sm cursor-pointer border-none">
                  <span className="material-symbols-outlined text-lg">add_circle</span> Nạp BLUE
                </button>
                <button className="bg-white/20 border border-white/30 backdrop-blur-md text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-white/30 transition-colors cursor-pointer">
                  Rút tiền
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-teal-500/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-teal-500/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-600">history</span>
            Lịch sử giao dịch
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-teal-500/5 rounded-lg px-3 py-1.5 border border-teal-500/10">
              <span className="text-xs text-slate-500 font-medium">Từ</span>
              <input
                className="bg-transparent border-none text-xs p-0 focus:ring-0 text-slate-700 dark:text-slate-300 outline-none"
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 bg-teal-500/5 rounded-lg px-3 py-1.5 border border-teal-500/10">
              <span className="text-xs text-slate-500 font-medium">Đến</span>
              <input
                className="bg-transparent border-none text-xs p-0 focus:ring-0 text-slate-700 dark:text-slate-300 outline-none"
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
              />
            </div>
            <button className="bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-teal-500 transition-colors border-none cursor-pointer">
              Lọc
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoadingTransactions ? (
            <div className="p-8 flex justify-center"><LoadingSpinner text="Đang tải giao dịch..." /></div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Không có giao dịch nào trong khoảng thời gian này.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-teal-500/5 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Thời gian</th>
                  <th className="px-6 py-4">Loại giao dịch</th>
                  <th className="px-6 py-4 text-right">Số tiền</th>
                  <th className="px-6 py-4 text-right">Mô tả</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-500/5">
                {transactions.map((tx: any) => {
                  const isPositive = tx.amount > 0;
                  const absAmount = Math.abs(tx.amount);

                  // Simple logic to guess icon and color based on amount / transaction type
                  let icon = 'swap_horiz';
                  let iconColors = 'bg-blue-100 dark:bg-blue-900/30 text-blue-600';

                  if (tx.transactionType === 'DEPOSIT' || isPositive) {
                    icon = 'add';
                    iconColors = 'bg-green-100 dark:bg-green-900/30 text-green-600';
                  } else if (tx.transactionType === 'WITHDRAWAL' || tx.transactionType === 'DONATE' || !isPositive) {
                    icon = tx.transactionType === 'DONATE' ? 'favorite' : 'file_download';
                    iconColors = 'bg-red-100 dark:bg-red-900/30 text-red-600';
                  }

                  return (
                    <tr key={tx.transactionId} className="hover:bg-teal-500/5 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {format(new Date(tx.createdAt), 'dd/MM/yyyy')}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {format(new Date(tx.createdAt), 'HH:mm:ss')}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${iconColors}`}>
                            <span className="material-symbols-outlined text-sm">{icon}</span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {tx.transactionType}
                            </div>
                            <div className="text-xs text-slate-500 truncate max-w-[200px]" title={tx.description}>
                              {tx.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-5 text-right font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? '+' : '-'}{absAmount} BLUE
                      </td>
                      <td className="px-6 py-5 text-right font-medium text-slate-600 dark:text-slate-400">
                        {tx.status}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-teal-500/5 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Hiển thị {transactions.length} trên {totalElements} giao dịch
          </p>
          <div className="flex gap-2">
            <button className="h-8 w-8 rounded bg-teal-500/5 text-slate-500 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors border-none cursor-pointer">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="h-8 w-8 rounded bg-teal-600 text-white flex items-center justify-center font-bold text-xs border-none cursor-pointer">1</button>
            <button className="h-8 w-8 rounded bg-teal-500/5 text-slate-500 flex items-center justify-center hover:bg-teal-600/10 font-bold text-xs transition-colors border-none cursor-pointer">2</button>
            <button className="h-8 w-8 rounded bg-teal-500/5 text-slate-500 flex items-center justify-center hover:bg-teal-600/10 font-bold text-xs transition-colors border-none cursor-pointer">3</button>
            <button className="h-8 w-8 rounded bg-teal-500/5 text-slate-500 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors border-none cursor-pointer">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
