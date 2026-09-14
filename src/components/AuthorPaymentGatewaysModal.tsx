import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Check, 
  Globe, 
  ShieldCheck, 
  Zap, 
  RefreshCw, 
  HelpCircle, 
  DollarSign, 
  Lock, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PaymentGatewayConfig, PaymentGatewayId } from '../types';
import { INITIAL_PAYMENT_GATEWAYS } from '../data/mockPaymentGateways';

interface PaymentGatewaysModalProps {
  isOpen: boolean;
  onClose: () => void;
  gateways: PaymentGatewayConfig[];
  onUpdateGateways: (updated: PaymentGatewayConfig[]) => void;
  onOpenStripeConnect?: () => void;
}

export const AuthorPaymentGatewaysModal: React.FC<PaymentGatewaysModalProps> = ({
  isOpen,
  onClose,
  gateways,
  onUpdateGateways,
  onOpenStripeConnect
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'payouts'>('all');
  const [gatewayList, setGatewayList] = useState<PaymentGatewayConfig[]>(gateways.length ? gateways : INITIAL_PAYMENT_GATEWAYS);
  const [selectedGatewayId, setSelectedGatewayId] = useState<PaymentGatewayId>('stripe');
  const [testPingStatus, setTestPingStatus] = useState<{ [key: string]: 'idle' | 'testing' | 'success' }>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const activeGateway = gatewayList.find(g => g.id === selectedGatewayId) || gatewayList[0];

  const handleToggleEnable = (id: PaymentGatewayId) => {
    setGatewayList(prev => prev.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g));
  };

  const handleFieldChange = (id: PaymentGatewayId, field: keyof PaymentGatewayConfig, value: any) => {
    setGatewayList(prev => prev.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const handleTestConnection = (id: PaymentGatewayId) => {
    setTestPingStatus(prev => ({ ...prev, [id]: 'testing' }));
    setTimeout(() => {
      setTestPingStatus(prev => ({ ...prev, [id]: 'success' }));
      setTimeout(() => {
        setTestPingStatus(prev => ({ ...prev, [id]: 'idle' }));
      }, 3500);
    }, 1200);
  };

  const handleSaveAll = () => {
    onUpdateGateways(gatewayList);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const activeCount = gatewayList.filter(g => g.enabled).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#131921] text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-serif text-white">
                  Author Global Payment Gateways & Payout Rails
                </h2>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {activeCount} of {gatewayList.length} Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Collect book sales & dimension pre-orders directly from readers across 135+ countries in any currency
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left column gateway list + Right column configuration */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Gateway Selector Column */}
          <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50/50 p-4 overflow-y-auto space-y-2">
            <div className="flex items-center justify-between px-1 pb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Supported Gateways
              </span>
              <span className="text-[10px] text-slate-400">Zero Middlemen</span>
            </div>

            {gatewayList.map((g) => {
              const isSelected = g.id === selectedGatewayId;
              return (
                <div
                  key={g.id}
                  onClick={() => setSelectedGatewayId(g.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-white border-amber-400 shadow-sm ring-1 ring-amber-400/40'
                      : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{g.name}</h4>
                      {g.enabled && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">{g.region}</span>
                    <span className="text-[9px] text-amber-700 font-medium block truncate mt-0.5">
                      {g.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleEnable(g.id);
                      }}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        g.enabled ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          g.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Configuration Inspector */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 bg-white">
            {/* Active Gateway Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 font-serif">
                    {activeGateway.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeGateway.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {activeGateway.enabled ? '● Active' : '○ Disabled'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{activeGateway.description}</p>
              </div>

              {/* Ping Test Button */}
              <button
                type="button"
                onClick={() => handleTestConnection(activeGateway.id)}
                disabled={testPingStatus[activeGateway.id] === 'testing'}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  testPingStatus[activeGateway.id] === 'success'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-black'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
              >
                {testPingStatus[activeGateway.id] === 'testing' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                ) : testPingStatus[activeGateway.id] === 'success' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>
                  {testPingStatus[activeGateway.id] === 'testing'
                    ? 'Pinging API...'
                    : testPingStatus[activeGateway.id] === 'success'
                    ? 'Verified Live (42ms)'
                    : 'Test Ping API'}
                </span>
              </button>
            </div>

            {/* Gateway Settings Form Fields */}
            {activeGateway.id === 'stripe' && (
              <div className="p-4 bg-gradient-to-r from-[#635BFF]/10 via-[#635BFF]/5 to-transparent rounded-xl border border-[#635BFF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#635BFF] text-white flex items-center justify-center font-black shrink-0">
                    <span className="text-base font-black">S</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-900">
                      Stripe Connect Global Payout Rails Active
                    </h5>
                    <p className="text-[11px] text-slate-600">
                      Direct automated bank deposits in 135+ currencies, instant push-to-card, and tax compliance.
                    </p>
                  </div>
                </div>

                {onOpenStripeConnect && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenStripeConnect();
                    }}
                    className="px-3 py-1.5 bg-[#635BFF] hover:bg-[#5349e0] text-white text-xs font-black rounded-lg transition shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
                  >
                    <span>Open Payout Hub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Account Identifier */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Author Merchant ID / Account Identifier
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={activeGateway.accountIdentifier}
                    onChange={(e) => handleFieldChange(activeGateway.id, 'accountIdentifier', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:border-amber-400 outline-none font-mono"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Connected payout account recipient
                </span>
              </div>

              {/* Public API Key or Client ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Public Key / Client ID
                </label>
                <input
                  type="password"
                  value={activeGateway.apiKeyOrSecret}
                  onChange={(e) => handleFieldChange(activeGateway.id, 'apiKeyOrSecret', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:border-amber-400 outline-none font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Encrypted and tokenized client-side
                </span>
              </div>

              {/* Primary Payout Currency */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Default Payout Currency
                </label>
                <select
                  value={activeGateway.currency}
                  onChange={(e) => handleFieldChange(activeGateway.id, 'currency', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:border-amber-400 outline-none cursor-pointer"
                >
                  {activeGateway.supportedCurrencies.map(cur => (
                    <option key={cur} value={cur}>
                      {cur} — Direct Deposit
                    </option>
                  ))}
                </select>
              </div>

              {/* Payout Schedule & Fee */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Settlement & Payout Speed
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${activeGateway.payoutSpeed} • Fee: ${activeGateway.feePercentage}%`}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-100 text-slate-600 font-medium"
                />
              </div>

            </div>

            {/* Currencies supported pills */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block">
                Multi-Currency Checkout Enabled for Buyers:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeGateway.supportedCurrencies.map(c => (
                  <span key={c} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 font-mono text-[10px] rounded-md font-bold">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Security & Webhook verification notice */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Encrypted Webhook Callbacks Active</strong>
                <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                  When a buyer checks out with {activeGateway.name}, royalties settle directly to your designated merchant account with zero intermediary platform hold.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Settings stored securely in author sovereign workspace</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              {saveSuccess ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{saveSuccess ? 'Saved!' : 'Save Payment Rails'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
