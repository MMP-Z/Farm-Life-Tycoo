import React, { useCallback, useEffect, useState } from 'react';
import { GameTab } from './NavigationTabs';

interface Step {
  tab: GameTab;
  selector?: string;
  title: string;
  text: string;
}

// FIX (P1-2): FTUE — trước đây người chơi mới bị ném thẳng vào 8 khu vực
// không một bước hướng dẫn. Tour 6 bước này dẫn qua vòng lặp cốt lõi:
// cuốc → gieo → tưới → tua nhanh → thu hoạch → bán.
const STEPS: Step[] = [
  {
    tab: 'hub',
    title: 'Chào mừng đến Nông Trại Vui Vẻ! 🚜',
    text: 'Bạn là chủ một nông trại nhỏ. Cùng mình đi qua 6 bước để bắt đầu kiếm vàng nhé!',
  },
  {
    tab: 'field',
    selector: '[data-tutorial="plots-grid"]',
    title: '1. Cuốc đất',
    text: 'Bấm vào một ô đất trống để cuốc tơi xốp, chuẩn bị gieo hạt.',
  },
  {
    tab: 'field',
    selector: '[data-tutorial="plots-grid"]',
    title: '2. Gieo hạt',
    text: 'Bấm vào ô đất vừa cuốc để gieo hạt Lúa mì — cây dễ trồng nhất cho người mới.',
  },
  {
    tab: 'field',
    selector: '[data-tutorial="water-all"]',
    title: '3. Tưới nước',
    text: 'Cây cần nước để lớn nhanh. Bấm nút Tưới mỗi khi thấy ô đất khô.',
  },
  {
    tab: 'field',
    selector: '[data-tutorial="ff-button"]',
    title: '4. Tua nhanh thời gian',
    text: 'Cây cần thời gian để chín. Bấm nút Tua Nhanh trên thanh công cụ để sang ngày mới.',
  },
  {
    tab: 'hub',
    selector: '[data-tutorial="market-region"]',
    title: '5. Thu hoạch & bán',
    text: 'Bấm vào ô lúa chín để thu hoạch, rồi mở khóa Chợ Làng (50 vàng) để bán nông sản lấy vàng. Chúc bạn làm giàu! 🌾',
  },
];

interface Props {
  onSelectTab: (tab: GameTab) => void;
  onDone: () => void;
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const TutorialOverlay: React.FC<Props> = ({ onSelectTab, onDone }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const updateSpotlight = useCallback((selector?: string) => {
    if (!selector) {
      setRect(null);
      return;
    }
    const el = document.querySelector(selector);
    if (!el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect({ left: r.left, top: r.top, width: r.width, height: r.height });
  }, []);

  // Chuyển tab theo bước, đợi render xong mới đo vị trí spotlight
  useEffect(() => {
    onSelectTab(step.tab);
    setRect(null);
    const t = window.setTimeout(() => updateSpotlight(step.selector), 450);
    return () => window.clearTimeout(t);
  }, [stepIndex, step.tab, step.selector, onSelectTab, updateSpotlight]);

  // Đo lại khi xoay màn hình / resize
  useEffect(() => {
    const onResize = () => updateSpotlight(step.selector);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [step.selector, updateSpotlight]);

  // Khóa scroll nền khi tutorial đang chạy
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[70] pointer-events-none">
      {/* Vòng spotlight quanh mục tiêu (không chặn thao tác — người chơi vừa đọc vừa thử được) */}
      {rect && (
        <div
          className="absolute rounded-2xl border-4 border-amber-400 animate-pulse-gentle"
          style={{
            left: Math.max(4, rect.left - 8),
            top: Math.max(4, rect.top - 8),
            width: rect.width + 16,
            height: rect.height + 16,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.55)',
          }}
        />
      )}
      {!rect && <div className="absolute inset-0 bg-black/55" />}

      {/* Thẻ hướng dẫn */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md pointer-events-auto">
        <div className="bg-white rounded-3xl p-5 shadow-2xl border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === stepIndex ? 'w-6 bg-amber-500' : i < stepIndex ? 'w-2 bg-amber-300' : 'w-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={onDone}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1"
            >
              Bỏ qua
            </button>
          </div>
          <h3 className="font-display font-extrabold text-base text-slate-900 mb-1.5">
            {step.title}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">{step.text}</p>
          <button
            onClick={() => (isLast ? onDone() : setStepIndex((i) => i + 1))}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-white font-extrabold text-sm shadow-md transition-all active:scale-95"
          >
            {isLast ? 'Bắt đầu chơi! 🚜' : 'Tiếp theo →'}
          </button>
        </div>
      </div>
    </div>
  );
};
