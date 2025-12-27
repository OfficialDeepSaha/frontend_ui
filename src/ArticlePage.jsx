import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const templateArticleHtml = (raw = '') => {
    if (!raw) return '';
    if (typeof document === 'undefined') return raw;

    const scratch = document.createElement('div');
    scratch.innerHTML = raw;

    // Remove unwanted elements
    scratch
        .querySelectorAll(
            'script, style, .top-bar, .top-bar-link, .category-arrow-2, .site-footer, .site-header, [data-widget], [role="banner"]'
        )
        .forEach((el) => el.remove());

    const blogPost = scratch.querySelector('.blog-post');
    const workingRoot = blogPost || scratch;

    // improved hero detection
    const heroCandidate =
        scratch.querySelector('[data-origin="beyondchats-original-image"]') ||
        workingRoot.querySelector('figure img') ||
        workingRoot.querySelector('.blog-post img') ||
        scratch.querySelector('img');

    const hero = heroCandidate ? heroCandidate.cloneNode(true) : null;
    if (heroCandidate) {
        heroCandidate.remove();
    }

    const heroMarkup = hero ? `<figure class="article-template__hero">${hero.outerHTML ?? ''}</figure>` : '';
    const contentMarkup = `<div class="article-template__content">${workingRoot.innerHTML}</div>`;

    return `<section class="article-template">
    <div class="article-template__card">
      ${heroMarkup}
      ${contentMarkup}
    </div>
  </section>`;
};

export default function ArticlePage() {
    const { updateId } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const api = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
        if (!api || !updateId) {
            setError('Missing API URL or update ID');
            setLoading(false);
            return;
        }
        setLoading(true);
        axios.get(`${api}/articles/${updateId}`)
            .then((res) => setArticle(res.data))
            .catch((e) => setError(e?.message || 'Failed to fetch article'))
            .finally(() => setLoading(false));
    }, [updateId]);

    const templatedHtml = useMemo(() => templateArticleHtml(article?.content_html || ''), [article?.content_html]);

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6 animate-fade-in">
                    <div className="w-12 h-12 rounded-full border-2 border-accent-500 border-t-transparent animate-spin" />
                    <div className="text-xl text-slate-400 font-display tracking-wide animate-pulse-slow">Loading article content...</div>
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-8 py-6 rounded-2xl backdrop-blur-md max-w-md w-full text-center shadow-lg">
                    <div className="text-2xl font-bold mb-2 font-display">Article Not Found</div>
                    <p className="opacity-80 font-body">{error || 'The requested article could not be retrieved.'}</p>
                    <Link to="/" className="inline-block mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-semibold transition">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-950 text-slate-100 font-body selection:bg-accent-500/30 overflow-x-hidden">
            {/* Dynamic Background */}
            <div className="fixed inset-0 bg-hero-gradient pointer-events-none opacity-60" />
            <div className="fixed top-20 right-0 w-[600px] h-[600px] bg-accent-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen animate-float" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-mint-500/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen animate-float" style={{ animationDelay: '-2s' }} />

            <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 py-12 lg:py-20 animate-fade-in">
                <div className="mb-10">
                    <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glass-100 border border-glass-200 text-sm font-semibold text-slate-300 hover:text-white hover:bg-glass-200 transition-all hover:-translate-x-1">
                        <span>←</span> Return to Articles
                    </Link>
                </div>

                <article className="bg-surface-900/60 border border-glass-200 rounded-[2rem] p-8 sm:p-12 shadow-2xl backdrop-blur-md">
                    <header className="space-y-6 mb-12 border-b border-glass-200 pb-10">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-mint-500/10 border border-mint-500/20 text-mint-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-mint-400 shadow-[0_0_8px_rgba(77,225,198,0.6)]" />
                                <span className="text-xs font-bold tracking-wider uppercase">AI Enhanced Version</span>
                            </div>
                            <div className="text-slate-500 text-xs font-mono tracking-widest uppercase">
                                ID #{article.id.toString().padStart(4, '0')}
                            </div>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight leading-[1.1] text-white text-glow">
                            {article.title || 'Untitled Article'}
                        </h1>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-slate-400">
                            {article.source_url && (
                                <a href={article.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-accent-400 hover:text-accent-300 transition-colors font-medium">
                                    <span>Source Link</span>
                                    <span className="text-lg">↗</span>
                                </a>
                            )}
                            {article.updated_at && (
                                <>
                                    <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-600" />
                                    <span>Updated {new Date(article.updated_at).toLocaleDateString()}</span>
                                </>
                            )}
                        </div>

                        {article.summary && (
                            <p className="text-xl text-slate-300 leading-relaxed font-light border-l-2 border-accent-500/30 pl-6 italic">
                                {article.summary}
                            </p>
                        )}
                    </header>

                    <div className="prose-lg max-w-none text-slate-300" dangerouslySetInnerHTML={{ __html: templatedHtml }} />

                    {Array.isArray(article.references) && article.references.length > 0 && (
                        <footer className="mt-16 pt-10 border-t border-glass-200">
                            <h2 className="text-xl font-bold font-display text-white mb-6 flex items-center gap-3">
                                <span className="text-accent-400">#</span>
                                References & Citations
                            </h2>
                            <ul className="grid grid-cols-1 gap-3">
                                {article.references.map((r, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm group">
                                        <span className="font-mono text-slate-600 pt-0.5">[{idx + 1}]</span>
                                        <a href={r} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-accent-400 transition-colors break-all leading-relaxed">
                                            {r}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </footer>
                    )}
                </article>
            </div>
        </div>
    );
}