import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

export default function App() {
  const [originals, setOriginals] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const api = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
    if (!api) {
      setError('VITE_API_URL is not configured');
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      axios.get(`${api}/articles`, { params: { updated: false } }),
      axios.get(`${api}/articles`, { params: { updated: true } }),
    ])
      .then(([o, u]) => {
        setOriginals(o.data.data || []);
        setUpdates(u.data.data || []);
      })
      .catch((e) => setError(e?.message || 'Failed to fetch'))
      .finally(() => setLoading(false));
  }, []);

  const updatesByOriginal = useMemo(() => {
    const map = new Map();
    for (const up of updates) {
      const key = up.original_id || up.id;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(up);
    }
    return map;
  }, [updates]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          <div className="w-12 h-12 rounded-full border-2 border-accent-500 border-t-transparent animate-spin" />
          <div className="text-xl text-slate-400 font-display tracking-wide animate-pulse-slow">Initializing content stream...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-8 py-6 rounded-2xl backdrop-blur-md max-w-md w-full text-center shadow-lg transform transition-all hover:scale-105">
          <div className="text-2xl font-bold mb-2 font-display">Connection Error</div>
          <p className="opacity-80 font-body">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 text-slate-100 font-body selection:bg-accent-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-hero-gradient pointer-events-none opacity-60" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-accent-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen animate-float" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-mint-500/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen animate-float" style={{ animationDelay: '-3s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24">

        {/* Hero Section */}
        <header className="flex flex-col md:flex-row gap-12 items-end justify-between mb-24 animate-slide-up">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-glass-100 border border-glass-200 backdrop-blur-md mb-8 transition hover:bg-glass-200 cursor-default">
              <span className="w-2 h-2 rounded-full bg-mint-400 animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase text-mint-400">System Online</span>
            </div>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold font-display tracking-tight text-white mb-8 leading-[0.9]">
              Content <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-accent-300 to-mint-400 text-glow">Intelligence.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl border-l-2 border-accent-500/30 pl-6">
              Access the complete archive of scraped articles and their AI-enhanced versions, powered by our advanced context-aware pipeline.
            </p>
          </div>

          <div className="w-full md:w-auto">
            <div className="bg-glass-100 border border-glass-200 backdrop-blur-xl rounded-3xl p-8 shadow-2xl transition hover:transform hover:-translate-y-1 duration-500">
              <div className="flex gap-12">
                <div className="text-center">
                  <div className="text-4xl font-bold font-display text-white mb-1">{originals.length}</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Originals</div>
                </div>
                <div className="w-px bg-glass-200" />
                <div className="text-center">
                  <div className="text-4xl font-bold font-display text-accent-400 mb-1">{updates.length}</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Enhanced</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Feed */}
        {originals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in delay-200 bg-glass-100 rounded-3xl border border-glass-200 border-dashed">
            <div className="w-20 h-20 rounded-full bg-surface-800 border-2 border-surface-700 flex items-center justify-center mb-8">
              <span className="text-3xl opacity-30">⚡</span>
            </div>
            <p className="text-2xl font-bold text-white mb-2 font-display">No articles indexed</p>
            <p className="text-slate-500 max-w-md">The system is waiting for the scraper. Run the backend services to ingest content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {originals.map((article, idx) => {
              const articleUpdates = updatesByOriginal.get(article.id) || [];
              return (
                <div
                  key={article.id}
                  className="group relative bg-surface-900/60 border border-glass-200 rounded-[2rem] p-8 sm:p-12 transition-all duration-500 hover:bg-surface-800/80 hover:border-accent-500/30 hover:shadow-glow-hover backdrop-blur-sm animate-slide-up"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="flex flex-col xl:flex-row gap-12 xl:gap-16">
                    {/* Source Article */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="px-3 py-1 rounded-full bg-glass-200 text-xs font-mono text-slate-400 border border-glass-300">
                          #{article.id.toString().padStart(3, '0')}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Original Source</span>
                      </div>

                      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-display group-hover:text-accent-300 transition-colors leading-tight">
                        {article.title || 'Untitled Article'}
                      </h2>

                      {article.summary && (
                        <p className="text-slate-400 text-lg leading-relaxed mb-8 border-l-2 border-surface-700 pl-4 group-hover:border-accent-500/50 transition-colors duration-500">
                          {article.summary}
                        </p>
                      )}

                      <div className="mt-auto pt-8 flex items-center gap-4">
                        {article.source_url && (
                          <a
                            href={article.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
                          >
                            <span>SOURCE LINK</span>
                            <span className="text-lg">↗</span>
                          </a>
                        )}
                        <span className="h-4 w-px bg-glass-200" />
                        <span className="text-sm text-slate-600">
                          {article.content_text ? `${Math.ceil(article.content_text.length / 500)} min read` : 'Unknown read time'}
                        </span>
                      </div>
                    </div>

                    {/* Versions Column */}
                    <div className="xl:w-[420px] flex-shrink-0 flex flex-col gap-6 pt-8 xl:pt-0 xl:border-l xl:border-glass-200 xl:pl-16 relative">
                      {/* Decorative connecting line for desktop */}
                      <div className="hidden xl:block absolute top-12 -left-[65px] w-[65px] h-[2px] bg-gradient-to-r from-transparent to-glass-300" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
                          </span>
                          <span className="text-xs font-bold uppercase tracking-widest text-accent-300">
                            AI Enhancements
                          </span>
                        </div>
                        {articleUpdates.length > 0 && (
                          <div className="px-2 py-0.5 rounded bg-glass-200 border border-glass-300 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                            {articleUpdates.length} Generated
                          </div>
                        )}
                      </div>

                      {articleUpdates.length > 0 ? (
                        <div className="space-y-6">
                          {articleUpdates.map(u => (
                            <Link
                              key={u.id}
                              to={`/updates/${u.id}`}
                              className="block bg-gradient-to-br from-glass-100 to-glass-100/50 border border-glass-200 p-1 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-glow group/card relative overflow-hidden hover:border-accent-500/30"
                            >
                              {/* Inner Card Content */}
                              <div className="bg-surface-900/80 rounded-xl p-5 h-full relative z-10">

                                {/* Header */}
                                <div className="flex items-center justify-between mb-4 border-b border-glass-200 pb-3">
                                  <div className="inline-flex items-center gap-2 bg-mint-500/10 border border-mint-500/20 px-2 py-1 rounded-lg">
                                    <span className="text-xs font-bold text-mint-400">V.{u.id}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                                    <span>Ready to Read</span>
                                    <span className="text-accent-400 opacity-0 group-hover/card:opacity-100 transition-opacity -mr-2 group-hover/card:mr-0">→</span>
                                  </div>
                                </div>

                                {/* Title */}
                                <h3 className="font-display font-semibold text-slate-100 text-lg leading-snug mb-4 group-hover/card:text-accent-200 transition-colors">
                                  {u.title || 'Enhanced Article Version'}
                                </h3>

                                {/* AI Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                  {['SEO Optimized', 'Structured', '+ References'].map((tag, i) => (
                                    <span key={i} className="text-[10px] font-medium px-2 py-1 rounded bg-surface-800 border border-glass-200 text-slate-400 group-hover/card:border-accent-500/20 group-hover/card:text-accent-100/70 transition-colors">
                                      {tag}
                                    </span>
                                  ))}
                                </div>

                                {/* Action Button */}
                                <div className="w-full py-2.5 rounded-lg bg-accent-600/10 border border-accent-600/20 text-center text-sm font-semibold text-accent-200 group-hover/card:bg-accent-600 group-hover/card:text-white group-hover/card:border-accent-500 transition-all">
                                  View Enhanced Version
                                </div>
                              </div>

                              {/* Hover Glow Effect */}
                              <div className="absolute inset-0 bg-gradient-to-tr from-accent-600/20 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full min-h-[220px] flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-glass-200 bg-glass-100/30 text-center relative overflow-hidden group">
                          <div className="absolute inset-0 bg-hero-gradient opacity-20 group-hover:opacity-40 transition-opacity" />

                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 mb-4 rounded-full bg-surface-800 border border-glass-200 flex items-center justify-center relative">
                              <div className="absolute inset-0 rounded-full border border-accent-500/30 animate-ping opacity-20" />
                              <span className="text-2xl animate-pulse grayscale group-hover:grayscale-0 transition-all">🔮</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-400 mb-1 group-hover:text-accent-300 transition-colors">Awaiting Analysis</p>
                            <p className="text-xs text-slate-600 max-w-[200px] leading-relaxed">
                              Our AI agents are standing by to process this content.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}