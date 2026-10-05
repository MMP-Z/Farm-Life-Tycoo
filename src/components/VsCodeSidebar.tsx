import React from 'react';
import { Code, FileCode, Folder, Terminal, Play, Settings } from 'lucide-react';

export const VsCodeSidebar: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col w-[480px] xl:w-[540px] bg-[#1E1E1E] text-[#D4D4D4] rounded-3xl border border-[#333333] shadow-2xl overflow-hidden font-mono text-xs select-none my-6">
      
      {/* VS Code Title Bar */}
      <div className="bg-[#323233] px-4 py-2 flex items-center justify-between text-[#CCCCCC] text-[11px] border-b border-[#252526]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>
          <span className="font-semibold text-slate-300 ml-2">livestock_screen.dart — Green Valley Farm (Flutter)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Play size={12} className="text-emerald-400" />
          <span>Flutter: Run & Debug</span>
        </div>
      </div>

      {/* Editor Tabs */}
      <div className="bg-[#252526] flex items-center border-b border-[#1E1E1E] overflow-x-auto">
        <div className="bg-[#1E1E1E] text-white px-3.5 py-1.5 border-t-2 border-[#007ACC] flex items-center gap-2 text-[11px]">
          <FileCode size={13} className="text-[#519ABA]" />
          <span>livestock_screen.dart</span>
        </div>
        <div className="text-slate-400 px-3.5 py-1.5 flex items-center gap-2 text-[11px] hover:bg-[#2A2D2E] transition-colors cursor-pointer">
          <FileCode size={13} className="text-[#519ABA]" />
          <span>my_farm_screen.dart</span>
        </div>
        <div className="text-slate-400 px-3.5 py-1.5 flex items-center gap-2 text-[11px] hover:bg-[#2A2D2E] transition-colors cursor-pointer">
          <FileCode size={13} className="text-[#519ABA]" />
          <span>farm_map_widget.dart</span>
        </div>
      </div>

      {/* Code Area */}
      <div className="p-4 flex-1 overflow-y-auto leading-relaxed text-[11.5px] bg-[#1E1E1E]">
        <pre className="text-slate-300">
          <code>
{`// DailyFlutterUI — Smooth Farm Management App
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:green_valley/models/livestock.dart';
import 'package:green_valley/widgets/feeding_timeline.dart';

class LivestockScreen extends StatefulWidget {
  final FarmZone farmZone;
  const LivestockScreen({super.key, required this.farmZone});

  @override
  State<LivestockScreen> createState() => _LivestockScreenState();
}

class _LivestockScreenState extends State<LivestockScreen> {
  int totalAnimals = 48;
  double herdHealth = 0.96; // 96% Health
  String nextFeedTime = "6 PM";
  bool eveningFeedDone = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6F4EE),
      appBar: FarmAppBar(
        title: "Livestock",
        subtitle: "Green Valley Farm",
        leading: BackButton(onPressed: () => Navigator.pop(context)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            HerdSummaryCard(
              animalsCount: totalAnimals,
              healthPercent: herdHealth,
              feedStockDays: 12,
            ).animate().fadeIn().slideY(begin: 0.1),
            const SizedBox(height: 16),
            FeedingScheduleCard(
              completedCount: eveningFeedDone ? 3 : 2,
              totalCount: 3,
              onFeedEvening: () => setState(() => eveningFeedDone = true),
            ),
            const SizedBox(height: 16),
            AnimalCategoriesGrid(
              categories: [
                AnimalGroup("Cows", count: 18),
                AnimalGroup("Chickens", count: 20),
                AnimalGroup("Sheep", count: 6),
                AnimalGroup("Goats", count: 4),
              ],
            ),
          ],
        ),
      ),
    );
  }
}`}
          </code>
        </pre>
      </div>

      {/* VS Code Mini Terminal Bar */}
      <div className="bg-[#181818] px-4 py-2 border-t border-[#2A2A2A] flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-emerald-400" />
          <span className="text-emerald-300 font-bold">flutter run -d "iPhone 17 Pro Max"</span>
          <span className="text-slate-500">· Hot Reload [r] active</span>
        </div>
        <span className="text-slate-400 font-mono">Dart 3.5.2</span>
      </div>

    </div>
  );
};
