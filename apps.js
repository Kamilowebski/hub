// Wspólna lista stron + przycisk "kwadracików" (hub)
// Plik leży w katalogu głównym kamilowebski.github.io i jest ładowany na każdej stronie.
(function () {
  const BASE = 'https://kamilowebski.github.io/';

  // Lista stron – tu dodajesz nowe (ikona = zawartość inline SVG outline 24x24)
  const APPS = [
    {
      id: 'rejestr',
      name: 'Rejestr maszyn',
      desc: 'Hosty, IP, lokalizacje i zależności',
      path: 'rejestr/',
      icon: '<rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/><path d="M7 7h.01M7 17h.01"/>',
    },
    {
      id: 'diary',
      name: 'Dziennik pracy',
      desc: 'Codzienne czynności i baza rozwiązań',
      path: 'diary/',
      icon: '<path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
    },
    {
      id: 'todo',
      name: 'Lista TODO',
      desc: 'Zadania do pracy',
      path: 'todo/',
      icon: '<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9"/>',
    },
  ];

  const HOME = {
    id: 'hub',
    name: 'Hub',
    path: '',
    icon: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  };

  // Udostępnienie listy dla strony głównej (index.html)
  window.HUB_APPS = APPS.map((a) => ({ ...a, url: BASE + a.path }));

  // Tworzenie elementu SVG z ikoną (treść ikon jest stała, nie pochodzi od użytkownika)
  function iconSvg(inner, cls) {
    return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }

  // Czy dana pozycja to aktualna strona
  function isCurrent(app) {
    const p = location.pathname;
    if (app.path === '') return p === '/' || p === '/index.html';
    return p.indexOf('/' + app.path) === 0;
  }

  function init() {
    // Miejsce na przycisk: <div id="hub-apps"></div> w nagłówku; bez niego przycisk jest w rogu ekranu
    let mount = document.getElementById('hub-apps');
    if (!mount) {
      mount = document.createElement('div');
      mount.className = 'fixed top-3 right-3 z-40';
      document.body.appendChild(mount);
    }
    mount.classList.add('relative', 'inline-block');

    // Przycisk z siatką 3x3 kropek
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Moje strony');
    btn.setAttribute('aria-expanded', 'false');
    btn.className = 'inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600';
    let dots = '';
    [5, 12, 19].forEach((y) => [5, 12, 19].forEach((x) => { dots += '<circle cx="' + x + '" cy="' + y + '" r="1.8"/>'; }));
    btn.innerHTML = '<svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + dots + '</svg>';

    // Okienko z kafelkami
    const panel = document.createElement('div');
    panel.className = 'hidden absolute right-0 mt-2 w-72 max-w-[calc(100vw-1.5rem)] rounded-xl border border-slate-200 bg-white p-3 shadow-lg z-50';
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-3 gap-1';

    [HOME].concat(APPS).forEach((app) => {
      const a = document.createElement('a');
      a.href = BASE + app.path;
      const current = isCurrent(app);
      a.className = 'flex flex-col items-center gap-1 rounded-lg p-3 text-center text-xs ' +
        (current ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100');
      if (current) a.setAttribute('aria-current', 'page');
      a.innerHTML = iconSvg(app.icon, 'h-7 w-7');
      const label = document.createElement('span');
      label.textContent = app.name; // bezpieczne wstawianie tekstu
      a.appendChild(label);
      grid.appendChild(a);
    });
    panel.appendChild(grid);

    function setOpen(open) {
      panel.classList.toggle('hidden', !open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(panel.classList.contains('hidden'));
    });
    document.addEventListener('click', (e) => {
      if (!mount.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });

    mount.appendChild(btn);
    mount.appendChild(panel);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
