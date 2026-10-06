import React from 'react';
import { Tractor, Sprout, Building2, Truck, Coins } from 'lucide-react';
import { GameIcon } from './GameIcon';

interface Props {
  onLogin: () => void;
  onPlayGuest: () => void;
}

export const LoginScreen: React.FC<Props> = ({ onLogin, onPlayGuest }) => {
  return (
    <div className="min-h-screen bg-[#F3EFE0] flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-amber-200">
      <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-[#DFD9C3]">
        
        {/* Left Section: Info & Instructions */}
        <div className="flex-1 bg-gradient-to-br from-[#2E4A35] to-[#1A2E20] p-8 md:p-12 text-[#F3EFE0] flex flex-col justify-center">
          <div className="inline-flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-full mb-6 border border-white/20 shadow-inner">
            <Tractor size={20} className="text-amber-400" />
            <span className="font-bold text-sm tracking-wide uppercase text-amber-50">Farm Life Tycoon</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black mb-4 font-display leading-tight text-white shadow-sm">
            Xây dựng<br/>
            <span className="text-amber-400">Đế chế Nông nghiệp</span><br/>
            của riêng bạn.
          </h1>
          
          <p className="text-emerald-100/80 mb-10 text-sm md:text-base leading-relaxed max-w-md">
            Quản lý từ một mảnh đất hoang sơ, trồng trọt, chăn nuôi, chế biến và giao thương để trở thành tỷ phú nông dân. Mọi quyết định tài chính và chiến lược đều nằm trong tay bạn.
          </p>

          <div className="space-y-5">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Sprout size={20} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Trồng trọt & Chăn nuôi</h3>
                <p className="text-sm text-emerald-100/70 leading-relaxed">Gieo hạt, tưới nước, phòng trừ sâu bệnh. Chăm sóc gia súc gia cầm để thu hoạch nông sản chất lượng cao.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/30">
                <Building2 size={20} className="text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Sản xuất & Chế biến</h3>
                <p className="text-sm text-emerald-100/70 leading-relaxed">Xây dựng nhà máy, nhà bếp, xưởng mộc... Nâng tầm giá trị nông sản thô thành các mặt hàng đắt giá.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                <Truck size={20} className="text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Vận tải & Giao thương</h3>
                <p className="text-sm text-emerald-100/70 leading-relaxed">Nhận đơn hàng siêu thị, đóng gói hàng lên xe tải hoặc tàu thủy để xuất khẩu và thu về lợi nhuận lớn.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center shrink-0 border border-rose-500/30">
                <Coins size={20} className="text-rose-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Quản lý Tài chính</h3>
                <p className="text-sm text-emerald-100/70 leading-relaxed">Kiểm soát dòng tiền, đóng thuế, và xây dựng điểm uy tín để vay vốn mở rộng kinh doanh từ Hợp Tác Xã.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Login */}
        <div className="w-full md:w-[400px] p-8 md:p-12 flex flex-col items-center justify-center bg-[#FCFBF7]">
          <div className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner border-2 border-white rotate-3">
            <span className="text-5xl"><GameIcon e="👨‍🌾" /></span>
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 font-display mb-3 text-center">
            Bắt đầu chơi ngay!
          </h2>
          <p className="text-sm text-slate-500 mb-10 font-medium text-center px-4">
            Đăng nhập tài khoản để tự động lưu tiến trình và đồng bộ dữ liệu trên mọi thiết bị.
          </p>

          <button
            onClick={onLogin}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 px-6 rounded-2xl border-2 border-[#E8E2D2] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-sm mb-3"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-6 h-6"
            />
            Đăng nhập với Google
          </button>

          <button
            onClick={onPlayGuest}
            className="w-full bg-[#2E4A35] hover:bg-[#1A2E20] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-sm mb-6"
          >
            Chơi ngay (Khách)
          </button>

          <p className="text-xs text-slate-400 font-medium text-center">
            Bằng việc đăng nhập, bạn đã sẵn sàng trở thành<br/>một tỷ phú nông dân thực thụ.
          </p>
        </div>

      </div>
    </div>
  );
};
