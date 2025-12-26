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
      <div className="min-h-screen bg-surface-900 bg-hero-grid text-slate-100 flex items-center justify-center">
        <div className="text-lg text-slate-200">Loading articles…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-900 bg-hero-grid text-slate-100 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/30 text-red-100 px-4 py-3 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-hero-grid text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400 font-semibold">BeyondChats</p>
            <h1 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight mt-2">Articles & AI Enriched Versions</h1>
            <p className="text-slate-400 mt-2 max-w-2xl">
              Browse the original scraped articles and their AI-updated versions with cited references.
            </p>
          </div>
          <div className="bg-slate-900/70 border border-white/5 rounded-2xl px-4 py-3 shadow-glow min-w-[240px]">
            <div className="inline-flex items-center gap-2 text-xs text-slate-200 border border-white/10 rounded-full px-2 py-1 mb-2">
              <span className="w-2 h-2 rounded-full bg-mint-400 animate-pulse" />
              Live API
            </div>
            <p className="text-slate-300 text-sm">
              Connected to <span className="text-white font-semibold">{import.meta.env.VITE_API_URL}</span>
            </p>
            <p className="text-slate-400 text-sm mt-1">Originals: {originals.length} • Updates: {updates.length}</p>
          </div>
        </header>

        {originals.length === 0 ? (
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-10 text-center text-slate-300">
            <p className="text-lg font-semibold text-white mb-2">No articles found</p>
            <p className="text-sm text-slate-400">
              Once the scraper ingests BeyondChats posts you will see the originals and their updated versions here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            {originals.map((a) => (
              <article key={a.id} className="bg-slate-900/70 border border-white/5 rounded-2xl p-5 shadow-glow backdrop-blur space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 text-xs border border-white/10 rounded-full px-3 py-1 text-slate-100 bg-white/5">
                    <span className="w-2 h-2 rounded-full bg-accent-500" />
                    Original
                  </div>
                  <div className="text-slate-400 text-xs">ID #{a.id}</div>
                </div>

                <div className="space-y-1">
                  {a.source_url && (
                    <a href={a.source_url} target="_blank" rel="noreferrer" className="text-accent-400 text-sm hover:text-white clamp-2">
                      {a.source_url}
                    </a>
                  )}
                  <h2 className="text-xl font-semibold tracking-tight clamp-2">{a.title || 'Untitled article'}</h2>
                  {a.summary && <p className="text-slate-300 text-sm clamp-2">{a.summary}</p>}
                </div>

                <div className="content-preview rounded-xl overflow-hidden border border-white/5">
                  <div className="prose prose-invert prose-sm max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: a.content_html }} />
                </div>

                {updatesByOriginal.get(a.id)?.length > 0 ? (
                  <div className="mt-1 border-t border-white/5 pt-3 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-semibold">Updated Versions</h3>
                      <div className="inline-flex items-center gap-1 text-xs border border-white/10 rounded-full px-2 py-1 text-slate-100 bg-white/5">
                        {updatesByOriginal.get(a.id).length} versions
                      </div>
                    </div>
                    <div className="space-y-3">
                      {updatesByOriginal.get(a.id).map((u) => (
                        <Link
                          key={u.id}
                          to={`/updates/${u.id}`}
                          className="bg-slate-900/80 border border-white/5 rounded-xl p-3 shadow-inner space-y-2 text-left w-full hover:border-mint-400/60 transition block"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="inline-flex items-center gap-2 text-xs border border-mint-400/40 text-mint-400 rounded-full px-2.5 py-1 bg-mint-400/5">
                              <span className="w-2 h-2 rounded-full bg-mint-400" />
                              Updated
                            </div>
                            <span className="text-slate-400 text-xs">ID #{u.id}</span>
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-lg font-semibold clamp-2">{u.title || 'Updated article'}</h4>
                            {u.summary && <p className="text-slate-400 text-sm clamp-3">{u.summary}</p>}
                          </div>
                          <div className="content-preview rounded-lg overflow-hidden border border-white/5">
                            <div className="prose prose-invert prose-sm max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: u.content_html }} />
                          </div>
                          {Array.isArray(u.references) && u.references.length > 0 && (
                            <div className="mt-1">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <strong className="text-sm">References</strong>
                                <span className="text-slate-400 text-xs">{u.references.length} links</span>
                              </div>
                              <ul className="list-disc list-inside space-y-1 text-sm text-accent-400">
                                {u.references.map((r, idx) => (
                                  <li key={idx}>
                                    <a href={r} target="_blank" rel="noreferrer" className="hover:text-white transition">
                                      {r}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400 text-sm">No updated version yet.</div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}