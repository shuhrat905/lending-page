import React from 'react';
import { ToastMessage } from '../types/auth';
import { CheckCircle2, AlertCircle, Info, Key, X, Copy } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  onUseOtp?: (code: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss, onUseOtp }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-xl p-4 shadow-2xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-3 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-100'
              : toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/30 text-rose-100'
              : toast.type === 'otp'
              ? 'bg-amber-950/90 border-amber-500/40 text-amber-100'
              : 'bg-slate-900/90 border-slate-700 text-slate-100'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {toast.type === 'otp' && <Key className="w-5 h-5 text-amber-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">{toast.title}</h4>
              <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{toast.message}</p>

              {toast.otpCode && (
                <div className="mt-3 p-2.5 rounded-lg bg-black/40 border border-amber-500/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-300/80">Maxfiy kod:</span>
                    <span className="font-mono text-base font-bold tracking-widest text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                      {toast.otpCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(toast.otpCode!);
                      }}
                      className="text-xs px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded flex items-center gap-1 transition-colors"
                      title="Nusxa olish"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Nusxa
                    </button>
                    {onUseOtp && (
                      <button
                        onClick={() => onUseOtp(toast.otpCode!)}
                        className="text-xs px-2.5 py-1 bg-amber-500 text-black font-semibold rounded hover:bg-amber-400 transition-colors"
                      >
                        Kiritish
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
              aria-label="Yopish"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
