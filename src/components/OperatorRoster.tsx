/**
 * OperatorRoster — Like OrbitDesk AgentRoster but for security operators
 * Conflicts, skills 1-10, 44h/week, SLA/CSAT/QA/FRT/MTTR, mood, coaching
 */

'use client';

import { operators } from '../data/operators';

const statusConfig = {
  available: { color: 'bg-emerald-500', text: 'text-emerald-400', label: 'Available' },
  busy: { color: 'bg-amber-500', text: 'text-amber-400', label: 'Busy' },
  offline: { color: 'bg-zinc-500', text: 'text-zinc-500', label: 'Offline' },
  'on-call': { color: 'bg-violet-500', text: 'text-violet-400', label: 'On-call' },
};

const moodConfig = {
  neutral: '😐',
  frustrated: '😤',
  calm: '😌',
  happy: '😊',
  stressed: '😰',
};

export function OperatorRoster() {
  return (
    <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-zinc-800/60">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-semibold tracking-[0.02em] text-zinc-100 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Operator Roster
          </h2>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50">
            {operators.length} operators • 44h/week compliance
          </span>
        </div>
      </div>

      <div className="divide-y divide-zinc-800/40">
        {operators.map(op => {
          const s = statusConfig[op.status];
          const workloadPct = (op.workload / op.maxWorkload) * 100;
          const hoursPct = (op.hoursThisWeek / 44) * 100;

          return (
            <div key={op.id} className="p-3.5 hover:bg-zinc-800/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-[13px] font-medium text-zinc-300">
                    {op.avatar}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0a0a0a] ${s.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[13px] font-medium text-zinc-100">{op.displayName}</h3>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${s.text} bg-current/10 border-current/20`}>
                      {s.label}
                    </span>
                    <span className="text-[11px]">{moodConfig[op.mood]}</span>
                    {op.conflictWith && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Conflict</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-zinc-500 capitalize">{op.role}</span>
                    <span className="text-[10px] text-zinc-600">•</span>
                    <span className="text-[11px] text-zinc-400">{op.workload}/{op.maxWorkload} workload</span>
                    <div className="flex-1 max-w-[60px] h-1 rounded-full bg-zinc-800 overflow-hidden">
                      <div className={`h-full ${workloadPct > 80 ? 'bg-red-500' : workloadPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${workloadPct}%` }} />
                    </div>
                  </div>

                  {/* Skills — top 3 */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {Object.entries(op.skills).slice(0, 3).map(([skill, level]) => (
                      <div key={skill} className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700/50">
                        <span className="text-zinc-400">{skill}</span>
                        <span className={`font-medium ${level >= 9 ? 'text-emerald-400' : level >= 7 ? 'text-violet-400' : 'text-amber-400'}`}>{level}</span>
                      </div>
                    ))}
                  </div>

                  {/* Metrics — SLA/CSAT/QA/FRT/MTTR like OrbitDesk */}
                  <div className="grid grid-cols-5 gap-2 mt-2.5 p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                    <div className="text-center">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">SLA</p>
                      <p className={`text-[12px] font-medium ${op.slaCompliance >= 95 ? 'text-emerald-400' : op.slaCompliance >= 90 ? 'text-amber-400' : 'text-red-400'}`}>{op.slaCompliance}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">CSAT</p>
                      <p className="text-[12px] font-medium text-zinc-200">{op.csat}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">QA</p>
                      <p className={`text-[12px] font-medium ${op.qa >= 90 ? 'text-emerald-400' : op.qa >= 80 ? 'text-amber-400' : 'text-red-400'}`}>{op.qa}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">FRT</p>
                      <p className="text-[12px] font-medium text-zinc-200">{op.frt}m</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">MTTR</p>
                      <p className="text-[12px] font-medium text-zinc-200">{op.mttr}m</p>
                    </div>
                  </div>

                  {/* Conflict & Coaching like OrbitDesk */}
                  {op.conflictWith && (
                    <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-[11px] font-medium text-red-300">Conflict with {operators.find(o => o.id === op.conflictWith)?.displayName}:</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-[1.3]">{op.conflictReason}</p>
                    </div>
                  )}

                  {op.learningGap && (
                    <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-[11px] font-medium text-amber-300">Learning Gap:</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-[1.3]">{op.learningGap}</p>
                      {op.coachingNotes && (
                        <p className="text-[11px] text-zinc-500 mt-1 italic">Coaching: {op.coachingNotes}</p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mt-2">
                    {op.traits.slice(0, 3).map(trait => (
                      <span key={trait} className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700/30">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-zinc-500">{op.hoursThisWeek}h/44h</div>
                  <div className="w-12 h-1 rounded-full bg-zinc-800 mt-1 overflow-hidden">
                    <div className={`h-full ${hoursPct > 100 ? 'bg-red-500' : hoursPct > 90 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, hoursPct)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
