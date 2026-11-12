import React, { useState } from 'react';
import { Download, Star, CheckCircle, FileText, Sparkles, Terminal, X } from 'lucide-react';
import { ModItem } from '../types';
import { soundManager } from '../utils/sound';

interface ModVaultSectionProps {
  mods: ModItem[];
  onDownloadMod: (modId: string) => void;
}

export const ModVaultSection: React.FC<ModVaultSectionProps> = ({
  mods,
  onDownloadMod
}) => {
  const [activeChangelogMod, setActiveChangelogMod] = useState<ModItem | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessMap, setDownloadSuccessMap] = useState<Record<string, boolean>>({});

  const handleTriggerDownload = (mod: ModItem) => {
    soundManager.playDownloadSuccess();
    setDownloadingId(mod.id);

    // Call state updater
    onDownloadMod(mod.id);

    // Create a real downloadable bundle blob for the user
    const readmeContent = `# ${mod.name} (${mod.version})
Compatible with: Minecraft ${mod.mcVersion} (${mod.loader})
Author: Zenvroplayz YouTube Community

## Description
${mod.description}

## Key Features
${mod.features.map(f => `- ${f}`).join('\n')}

## Installation Guide
${mod.installGuide}

Support & Feedback:
Join our Discord or comment on the Community Lounge tab!
`;

    const blob = new Blob([readmeContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mod.name.replace(/[^a-zA-Z0-9]/g, '_')}_${mod.version}_README_INSTALL.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloadingId(null);
      setDownloadSuccessMap(prev => ({ ...prev, [mod.id]: true }));
      setTimeout(() => {
        setDownloadSuccessMap(prev => ({ ...prev, [mod.id]: false }));
      }, 4000);
    }, 800);
  };

  return (
    <section id="mods" className="py-10 sm:py-12 border-b border-slate-800/80 bg-[#0c1118]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Free Community Downloads</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Custom Mods & Shaders Vault
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Download the custom mods, datapacks, and shader configs used in our YouTube episodes. 100% free, virus-scanned, and optimized.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 self-start md:self-auto">
            <span className="text-emerald-400 font-bold">Tested on:</span>
            <span>Minecraft 1.20 - 1.21.1</span>
          </div>
        </div>

        {/* Mod Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {mods.map((mod) => (
            <div
              key={mod.id}
              className="flex flex-col bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500/40 transition-all shadow-lg hover:shadow-2xl justify-between"
            >
              <div>
                {/* Mod Image Banner */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={mod.imageUrl}
                    alt={mod.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  
                  {/* Mod Loader Tag */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-slate-950/85 backdrop-blur-sm text-emerald-400 text-[11px] sm:text-xs font-bold rounded border border-emerald-500/30">
                    {mod.loader} · {mod.mcVersion}
                  </div>

                  {/* Rating Tag */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 sm:py-1 bg-black/80 backdrop-blur-sm text-amber-400 text-[11px] sm:text-xs font-bold rounded">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{mod.rating}</span>
                  </div>

                  {/* File Size */}
                  <div className="absolute bottom-2 right-2.5 text-[11px] font-mono text-slate-300 bg-slate-950/85 px-2 py-0.5 rounded">
                    {mod.fileSize}
                  </div>
                </div>

                {/* Mod Info & Description */}
                <div className="p-4 sm:p-5 space-y-3.5 sm:space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
                        {mod.name}
                      </h3>
                      <span className="text-xs font-mono text-emerald-400 font-semibold shrink-0">
                        {mod.version}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {mod.tagline}
                    </p>
                  </div>

                  {/* Features Bullet List */}
                  <div className="space-y-1 pt-2 border-t border-slate-800">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Key Highlights:
                    </span>
                    <ul className="space-y-1">
                      {mod.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 sm:gap-2 text-xs text-slate-300">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quick Install Guide Box */}
                  <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>How to install:</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      {mod.installGuide}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer (Touch Optimized) */}
              <div className="p-4 sm:p-5 pt-0 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-1.5">
                  <span>Downloads: <strong className="text-white tabular-nums">{mod.downloads.toLocaleString()}</strong></span>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveChangelogMod(mod);
                    }}
                    className="text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer py-1"
                  >
                    Changelog
                  </button>
                </div>

                <button
                  onClick={() => handleTriggerDownload(mod)}
                  disabled={downloadingId === mod.id}
                  className="mc-block-btn w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 min-h-[46px]"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span className="truncate">
                    {downloadingId === mod.id
                      ? "Generating..."
                      : downloadSuccessMap[mod.id]
                      ? "Downloaded! Check Files"
                      : `Download ${mod.version} (${mod.fileSize})`}
                  </span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Changelog Modal */}
      {activeChangelogMod && (
        <div 
          onClick={() => setActiveChangelogMod(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-emerald-500/50 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[85vh] flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                <h3 className="font-display font-bold text-base sm:text-lg text-white truncate">
                  {activeChangelogMod.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveChangelogMod(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {activeChangelogMod.changelog.map((entry, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400">{entry.version}</span>
                    <span className="text-slate-500">{entry.date}</span>
                  </div>
                  <ul className="space-y-1">
                    {entry.changes.map((change, cIdx) => (
                      <li key={cIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">·</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveChangelogMod(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer min-h-[44px]"
              >
                Close Changelog
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
