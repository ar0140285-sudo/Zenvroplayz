import React, { useState } from 'react';
import { Radio, Calendar, Server, Shield, Check, Copy, Bell } from 'lucide-react';
import { UpdateItem, ChannelProfile } from '../types';
import { soundManager } from '../utils/sound';

interface UpdatesSectionProps {
  channel: ChannelProfile;
  updates: UpdateItem[];
}

export const UpdatesSection: React.FC<UpdatesSectionProps> = ({
  channel,
  updates
}) => {
  const [copiedIp, setCopiedIp] = useState(false);
  const [subscribedNotice, setSubscribedNotice] = useState(false);

  const handleCopyIp = () => {
    navigator.clipboard.writeText(channel.serverIp);
    soundManager.playXpChime();
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2500);
  };

  const handleNotifyMe = () => {
    soundManager.playXpChime();
    setSubscribedNotice(true);
    setTimeout(() => setSubscribedNotice(false), 3000);
  };

  return (
    <section id="updates" className="py-12 border-b border-slate-800/80 bg-[#0d121a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Broadcast Bulletin</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Server Patches & Video Roadmap
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Stay ahead with official server changelogs, upcoming YouTube video schedules, and community events.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleNotifyMe}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>{subscribedNotice ? "Notifications Enabled!" : "Get Update Alerts"}</span>
            </button>
          </div>
        </div>

        {/* Server Status Showcase Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Viewer SMP Server · Java & Bedrock
              </span>
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-white">
              Join The Official {channel.name} Realm
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Play with fellow viewers, trade in the player bazaar, explore custom trial dungeons, and participate in weekly YouTube events.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-3">
              <Server className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <span className="text-[10px] text-slate-500 block">Server Address</span>
                <code className="text-xs font-mono font-bold text-white">{channel.serverIp}</code>
              </div>
            </div>

            <button
              onClick={handleCopyIp}
              className="mc-block-btn flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow transition-all cursor-pointer whitespace-nowrap"
            >
              {copiedIp ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedIp ? "IP Copied!" : "Copy Server IP"}</span>
            </button>
          </div>
        </div>

        {/* Updates Feed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {updates.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 hover:border-emerald-500/30 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {item.versionTag || item.type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </span>
                </div>

                <h4 className="font-display font-bold text-base text-white">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.summary}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Highlights:
                  </span>
                  <ul className="space-y-1">
                    {item.details.map((detail, dIdx) => (
                      <li key={dIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">·</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified by {channel.name}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
