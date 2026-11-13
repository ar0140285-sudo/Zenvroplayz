import React from 'react';
import { Clapperboard, Package, MessageSquare, Radio } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface MobileBottomNavProps {
  activeTab: 'videos' | 'mods' | 'community' | 'updates';
  setActiveTab: (tab: 'videos' | 'mods' | 'community' | 'updates') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab
}) => {
  const tabs: { id: 'videos' | 'mods' | 'community' | 'updates'; label: string; icon: React.ElementType }[] = [
    { id: 'videos', label: 'Videos', icon: Clapperboard },
    { id: 'mods', label: 'Mods', icon: Package },
    { id: 'community', label: 'Community', icon: MessageSquare },
    { id: 'updates', label: 'Updates', icon: Radio },
  ];

  const handleTabClick = (tabId: 'videos' | 'mods' | 'community' | 'updates') => {
    soundManager.playClick();
    setActiveTab(tabId);
  };

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0e15]/95 backdrop-blur-lg border-t border-emerald-900/50 md:hidden pb-safe"
    >
      <div className="grid grid-cols-4 items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors relative cursor-pointer ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : ''}`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-full">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0.5 inset-x-4 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
