import React from 'react';
import { Tractor } from 'lucide-react';

interface Props {
  onLogin: () => void;
}

export const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-[#F3EFE0] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full border border-[#DFD9C3] text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Tractor size={40} className="text-emerald-700" />
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 font-display mb-2">
          Nông Trại Vui Vẻ
        </h1>
        <p className="text-sm text-slate-500 mb-8 font-medium">
          Đăng nhập để tự động lưu tiến trình và chơi trên nhiều thiết bị
        </p>

        <button
          onClick={onLogin}
          className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-2xl border-2 border-[#E8E2D2] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-sm"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-5 h-5"
          />
          Đăng nhập với Google
        </button>
      </div>
    </div>
  );
};
