/**
 * RequestQueue — Real-time endless high-impact requests that need 4-eyes approval
 * Like OrbitDesk TicketQueue but for security operations
 * Clean bento design, Linear dark-first violet, not basic AI
 */

'use client';

import { useEffect, useState } from 'react';
import { requestEngine, type LiveRequest } from '../data/requestEngine';

interface Props {
  onSelectRequest: (req: LiveRequest) => void;
  selectedId?: string;
}

const priorityConfig = {
  P1: { label: 'P1', color: 'bg-red-500', text: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  P2: { label: 'P2', color: 'bg-orange-500', text: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  P3: { label: 'P3', color: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  P4: { label: 'P4', color: 'bg-zinc-500', text: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20' },
};

const riskConfig = {
  Critical: { color: 'text-red-400', bg: 'bg-red-500/10', dot: 'bg-red-500' },
  High: { color: 'text-orange-400', bg: 'bg-orange-500/10', dot: 'bg-orange-500' },
  Medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', dot: 'bg-amber-500' },
  Low: { color: 'text-zinc-400', bg: 'bg-zinc-500/10', dot: 'bg-zinc-500' },
};

const tenantConfig: Record<string, { color: string; bg: string; dot: string }> = {
  novatech: { color: 'text-violet-400', bg: 'bg-violet-500/10', dot: 'bg-violet-500' },
  bloom: { color: 'text-pink-400', bg: 'bg-pink-500/10', dot: 'bg-pink-500' },
  apex: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' },
};

function formatTimeLeft(ms: number): string {
  if (ms <= 0) return 'Expired';
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

export function RequestQueue({ onSelectRequest, selectedId }: Props) {
  const [requests, setRequests] = useState<LiveRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'P1' | 'Critical'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    requestEngine.start();
    const unsub = requestEngine.subscribe(setRequests);
    return () => {
      unsub();
      requestEngine.stop();
    };
  }, []);

  const filtered = requests.filter(r => {
    if (filter === 'pending' && r.status !== 'pending') return false;
    if (filter === 'P1' && r.priority !== 'P1') return false;
    if (filter === 'Critical' && r.risk !== 'Critical') return false;
    if (search && !`${r.title} ${r.code} ${r.requestedByName} ${r.tenantName}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const p1Count = requests.filter(r => r.priority === 'P1' && r.status === 'pending').length;
  const criticalCount = requests.filter(r => r.risk === 'Critical' && r.status === 'pending').length;

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 shadow-sm overflow-hidden">
      {/* Header — quiet chrome like OrbitDesk */}
      <div className="p-4 border-b border-zinc-800/60 bg-zinc-900/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-[13px] font-semibold tracking-[0.02em] text-zinc-100">Live Requests</h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50">
              {requests.length} total • {pendingCount} pending
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-medium tracking-widest text-zinc-500 uppercase">Live • Endless</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search requests, codes, requesters, tenants..."
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-[13px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
          />
          <svg className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filters — bento pills */}
        <div className="flex items-center gap-1.5">
          {[
            { id: 'all', label: 'All', count: requests.length },
            { id: 'pending', label: 'Pending', count: pendingCount },
            { id: 'P1', label: 'P1', count: p1Count },
            { id: 'Critical', label: 'Critical', count: criticalCount },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`h-6 px-2.5 rounded-full text-[11px] font-medium border transition-all ${
                filter === f.id
                  ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
                  : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/50 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              {f.label} {f.count > 0 && <span className="ml-1 opacity-60">• {f.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <div className="h-8 w-8 mx-auto mb-3 rounded-full bg-zinc-800 flex items-center justify-center">
              <span className="text-zinc-500 text-sm">◍</span>
            </div>
            <p className="text-[13px] text-zinc-500">No requests match filter</p>
            <p className="text-[11px] text-zinc-600 mt-1">Real-time engine will generate new ones</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/40">
            {filtered.map(req => {
              const p = priorityConfig[req.priority];
              const r = riskConfig[req.risk as keyof typeof riskConfig];
              const t = tenantConfig[req.tenantId] || tenantConfig.novatech;
              const isSelected = selectedId === req.id;
              const isExpiring = req.timeLeftMs < 2 * 60_000 && req.status === 'pending';

              return (
                <button
                  key={req.id}
                  onClick={() => onSelectRequest(req)}
                  className={`w-full text-left p-3.5 hover:bg-zinc-800/40 transition-colors group ${
                    isSelected ? 'bg-violet-500/10 border-l-2 border-l-violet-500' : 'border-l-2 border-l-transparent'
                  } ${isExpiring ? 'bg-red-500/[0.04]' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`h-5 px-1.5 rounded text-[10px] font-bold flex items-center ${p.bg} ${p.text} border ${p.border}`}>
                          {p.label}
                        </span>
                        <span className={`h-5 w-5 rounded-full flex items-center justify-center ${r.bg}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${r.dot}`} />
                        </span>
                        <span className="text-[11px] font-medium text-zinc-300 truncate">{req.code}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${t.bg} ${t.color} border border-current/20`}>
                          {req.tenantName.split(' ')[0]}
                        </span>
                        {req.isRecurring && (
                          <span className="text-[10px] px-1 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Recurring</span>
                        )}
                      </div>
                      
                      <h3 className="text-[13px] font-medium text-zinc-100 leading-[1.3] line-clamp-2 group-hover:text-white">
                        {req.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[11px] text-zinc-500">{req.requestedByName}</span>
                        <span className="text-[10px] text-zinc-600">•</span>
                        <span className={`text-[11px] font-medium ${req.status === 'pending' ? 'text-amber-400' : req.status === 'approved' ? 'text-emerald-400' : req.status === 'expired' ? 'text-red-400' : 'text-zinc-400'}`}>
                          {req.status}
                        </span>
                        {req.status === 'pending' && (
                          <>
                            <span className="text-[10px] text-zinc-600">•</span>
                            <span className={`text-[11px] font-mono ${isExpiring ? 'text-red-400 font-bold' : 'text-zinc-400'}`}>
                              {formatTimeLeft(req.timeLeftMs)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${r.bg} ${r.color} border-current/20`}>
                        {req.risk}
                      </span>
                      {req.assignedTo && (
                        <span className="text-[10px] text-zinc-500">{req.assignedTo}</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer stats — quiet chrome */}
      <div className="p-3 border-t border-zinc-800/60 bg-zinc-900/30 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-emerald-500" />
            {pendingCount} pending approval
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-red-500" />
            {p1Count} P1 critical
          </span>
        </div>
        <span className="text-[10px] text-zinc-600 font-mono">Real-time • HMAC-signed • Hash-chained</span>
      </div>
    </div>
  );
}
