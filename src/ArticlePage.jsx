import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const templateArticleHtml = (raw = '') => {
  if (!raw) return '';
  if (typeof document === 'undefined') return raw;

  const scratch = document.createElement('div');
  scratch.innerHTML = raw;

  scratch
    .querySelectorAll(
      'script, style, .top-bar, .top-bar-link, .category-arrow-2, .site-footer, .site-header, [data-widget], [role="banner"]'
    )
    .forEach((el) => el.remove());

  const blogPost = scratch.querySelector('.blog-post');
  const workingRoot = blogPost || scratch;

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
      <div className="min-h-screen bg-slate-950 bg-hero-grid text-slate-100 flex items-center justify-center">
        <div className="text-lg text-slate-200">Loading article…</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-slate-950 bg-hero-grid text-slate-100 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/30 text-red-100 px-4 py-3 rounded-xl">
          {error || 'Article not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-hero-grid text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
            <span className="text-lg">←</span> Back to Articles
          </Link>
        </div>

        <article className="bg-slate-900/70 border border-white/5 rounded-2xl p-6 sm:p-8 shadow-glow backdrop-blur space-y-6">
          <header className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 text-xs border border-mint-400/40 text-mint-400 rounded-full px-2.5 py-1 bg-mint-400/5">
                <span className="w-2 h-2 rounded-full bg-mint-400" />
                Updated Version
              </div>
              <div className="text-slate-400 text-xs">ID #{article.id}</div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight">{article.title || 'Untitled article'}</h1>

            {article.source_url && (
              <a href={article.source_url} target="_blank" rel="noreferrer" className="text-accent-400 text-sm hover:text-white block">
                {article.source_url}
              </a>
            )}

            {article.summary && (
              <p className="text-lg text-slate-300 leading-relaxed">{article.summary}</p>
            )}
          </header>

          <div className="prose prose-invert prose-lg max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: templatedHtml }} />

          {Array.isArray(article.references) && article.references.length > 0 && (
            <footer className="border-t border-white/5 pt-6">
              <h2 className="text-xl font-semibold mb-4">References</h2>
              <ul className="space-y-2">
                {article.references.map((r, idx) => (
                  <li key={idx} className="text-sm">
                    <a href={r} target="_blank" rel="noreferrer" className="text-accent-400 hover:text-white transition">
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
