import { useState, useMemo } from 'react';
import { useMyWallets, useTransactions, useCreateEarnedWallet } from '@/hooks/useWallets';
import { format } from 'date-fns';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function LectureWalletPage() {
  const { data: wallets, isLoading: isLoadingWallets } = useMyWallets();
  const { mutate: createEarned, isPending: isCreating } = useCreateEarnedWallet();

  const mainWallet = useMemo(() => wallets?.find((w) => w.walletType === 'MAIN'), [wallets]);
  const earnedWallet = useMemo(() => wallets?.find((w) => w.walletType === 'EARNED'), [wallets]);

  const [activeWallet, setActiveWallet] = useState<'MAIN' | 'EARNED'>('MAIN');
  const selectedWallet = activeWallet === 'EARNED' ? earnedWallet : mainWallet;

  const [fromDate, setFromDate] = useState('2026-03-01');
  const [toDate, setToDate] = useState('2026-03-31');
  const [txPage, setTxPage] = useState(1);

  const { data: txData, isLoading: isLoadingTx } = useTransactions(
    selectedWallet?.walletId ?? 0,
    { page: txPage, size: 10, fromDate, toDate },
  );

  const transactions = txData?.data || [];
  const totalTx = txData?.totalItems || 0;
  const totalTxPages = txData?.totalPages || 1;

  if (isLoadingWallets) {
    return <LoadingSpinner fullScreen text="Đang tải ví..." />;
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-6xl mx-auto w-full font-sans">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ví của tôi</h1>
        <p className="text-slate-500 mt-1">Quản lý số dư và lịch sử giao dịch của bạn.</p>
      </div>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* MAIN Wallet */}
        <div
          className={`relative overflow-hidden rounded-2xl p-8 shadow-xl cursor-pointer transition-all ${activeWallet === 'MAIN' ? 'ring-2 ring-teal-500 ring-offset-2' : ''
            } bg-gradient-to-br from-[#E0F8F7] via-[#B2EBF2] to-[#80DEEA] text-slate-900`}
          onClick={() => { setActiveWallet('MAIN'); setTxPage(1); }}
        >
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-teal-700/80 uppercase tracking-widest">Ví chính (MAIN)</p>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase border ${mainWallet?.status === 'LOCKED'
                ? 'bg-red-400/20 border-red-400/30 text-red-600'
                : 'bg-green-400/20 border-green-400/30 text-green-700'
                }`}>
                {mainWallet?.status === 'LOCKED' ? 'Bị khóa' : 'Hoạt động'}
              </span>
            </div>
            <p className="text-4xl font-black tracking-tighter">
              {mainWallet?.balance ?? 0} <span className="text-2xl">💙 BLUE</span>
            </p>
            <p className="text-sm text-teal-700/60 mt-4 font-mono">
              ID: WS-{mainWallet?.walletId?.toString().padStart(8, '0') || '00000000'}
            </p>
          </div>
        </div>

        {/* EARNED Wallet */}
        {earnedWallet ? (
          <div
            className={`relative overflow-hidden rounded-2xl p-8 shadow-xl cursor-pointer transition-all ${activeWallet === 'EARNED' ? 'ring-2 ring-amber-500 ring-offset-2' : ''
              } bg-gradient-to-br from-[#FFF8E1] via-[#FFE082] to-[#FFD54F] text-slate-900`}
            onClick={() => { setActiveWallet('EARNED'); setTxPage(1); }}
          >
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-amber-700/80 uppercase tracking-widest">Ví kiếm được (EARNED)</p>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase border ${earnedWallet.status === 'LOCKED'
                  ? 'bg-red-400/20 border-red-400/30 text-red-600'
                  : 'bg-green-400/20 border-green-400/30 text-green-700'
                  }`}>
                  {earnedWallet.status === 'LOCKED' ? 'Bị khóa' : 'Hoạt động'}
                </span>
              </div>
              <p className="text-4xl font-black tracking-tighter">
                {earnedWallet.balance} <span className="text-2xl">🪙 GOLD</span>
              </p>
              <p className="text-sm text-amber-700/60 mt-4 font-mono">
                ID: WS-{earnedWallet.walletId.toString().padStart(8, '0')}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl p-8 shadow-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-900 flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-slate-600 mb-2">Chưa có ví EARNED</p>
            <p className="text-sm text-slate-500 mb-4 text-center">
              Tạo ví EARNED (GOLD) để nhận phần thưởng từ bài viết được duyệt.
            </p>
            <button
              onClick={() => createEarned()}
              disabled={isCreating}
              className="px-6 py-2.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50 border-none cursor-pointer"
            >
              {isCreating ? 'Đang tạo...' : '+ Tạo ví EARNED'}
            </button>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-teal-500/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-teal-500/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-600">history</span>
            Lịch sử giao dịch — {activeWallet === 'MAIN' ? 'Ví chính' : 'Ví EARNED'}
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-teal-500/5 rounded-lg px-3 py-1.5 border border-teal-500/10">
              <span className="text-xs text-slate-500 font-medium">Từ</span>
              <input
                className="bg-transparent border-none text-xs p-0 focus:ring-0 text-slate-700 outline-none"
                type="date"
                value={fromDate}
                onChange={(e) => { setFromDate(e.target.value); setTxPage(1); }}
              />
            </div>
            <div className="flex items-center gap-2 bg-teal-500/5 rounded-lg px-3 py-1.5 border border-teal-500/10">
              <span className="text-xs text-slate-500 font-medium">Đến</span>
              <input
                className="bg-transparent border-none text-xs p-0 focus:ring-0 text-slate-700 outline-none"
                type="date"
                value={toDate}
                onChange={(e) => { setToDate(e.target.value); setTxPage(1); }}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoadingTx ? (
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
                  <th className="px-6 py-4">Đối tác</th>
                  <th className="px-6 py-4 text-right">Số tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-500/5">
                {transactions.map((tx: any) => {
                  const INCOMING_TYPES = ['RECEIVE_DONATE', 'CREDIT', 'FEEDING'];
                  const isIncoming = INCOMING_TYPES.includes(tx.transactionType);

                  const TX_LABELS: Record<string, string> = {
                    RECEIVE_DONATE: 'Nhận ủng hộ',
                    DONATE: 'Ủng hộ',
                    FEEDING: 'Nhận thưởng',
                    CREDIT: 'Nạp tiền',
                    DEBIT: 'Rút tiền',
                  };
                  const TX_ICONS: Record<string, string> = {
                    RECEIVE_DONATE: 'favorite',
                    DONATE: 'favorite',
                    FEEDING: 'bolt',
                    CREDIT: 'add_circle',
                    DEBIT: 'remove_circle',
                  };

                  const label = TX_LABELS[tx.transactionType] ?? tx.transactionType;
                  const icon = TX_ICONS[tx.transactionType] ?? 'swap_horiz';
                  const iconColors = isIncoming ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600';

                  return (
                    <tr key={tx.transactionId} className="hover:bg-teal-500/5 transition-colors">
                      <td className="px-6 py-5">
                        <div className="text-sm font-medium text-slate-800">
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
                          <span className="text-sm font-semibold text-slate-800">{label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {tx.counterpartyName ? (
                          <div>
                            <div className="text-sm font-medium text-slate-800">{tx.counterpartyName}</div>
                            {tx.counterpartyEmail && (
                              <div className="text-xs text-slate-400">{tx.counterpartyEmail}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">—</span>
                        )}
                      </td>
                      <td className={`px-6 py-5 text-right font-bold text-base ${isIncoming ? 'text-green-500' : 'text-red-500'}`}>
                        {isIncoming ? '+' : '-'}{tx.amount} {tx.currency}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-teal-500/5 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Hiển thị {transactions.length} trên {totalTx} giao dịch
          </p>
          <div className="flex gap-2">
            <button
              disabled={txPage <= 1}
              onClick={() => setTxPage((p) => p - 1)}
              className="h-8 w-8 rounded bg-teal-500/5 text-slate-500 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors border-none cursor-pointer disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            {Array.from({ length: totalTxPages }, (_, i) => i + 1)
              .slice(Math.max(0, txPage - 2), txPage + 1)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => setTxPage(p)}
                  className={`h-8 w-8 rounded flex items-center justify-center font-bold text-xs border-none cursor-pointer transition-colors ${p === txPage
                    ? 'bg-teal-600 text-white'
                    : 'bg-teal-500/5 text-slate-500 hover:bg-teal-600/10'
                    }`}
                >
                  {p}
                </button>
              ))}
            <button
              disabled={txPage >= totalTxPages}
              onClick={() => setTxPage((p) => p + 1)}
              className="h-8 w-8 rounded bg-teal-500/5 text-slate-500 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-colors border-none cursor-pointer disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
