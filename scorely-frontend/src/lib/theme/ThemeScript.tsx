/**
 * Inline script injected into <head> to set the data-theme attribute
 * BEFORE React hydrates. Prevents flash of wrong theme on initial load.
 *
 * Reads the scorely-theme cookie if set; otherwise defaults to dark.
 */
export function ThemeScript() {
  const code = `
(function() {
  try {
    var match = document.cookie.match(/(?:^|; )scorely-theme=([^;]+)/);
    var pref = match ? match[1] : 'dark';
    var resolved;
    if (pref === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else if (pref === 'light' || pref === 'dark') {
      resolved = pref;
    } else {
      resolved = 'dark';
    }
    document.documentElement.dataset.theme = resolved;
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
  }
})();
  `.trim();

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
