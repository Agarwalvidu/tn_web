// Turns a YouTube link into an embeddable URL. Returns null for anything else.
export function toEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
      const m = u.pathname.match(/\/(embed|shorts)\/([\w-]{6,})/);
      if (m) return `https://www.youtube.com/embed/${m[2]}`;
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

export function formatDateTime(d) {
  if (!d) return '';
  return new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}
