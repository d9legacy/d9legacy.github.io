(() => {
  const start = () => {
    if (document.getElementById('d9-menu-button')) return;
    const chapter = document.querySelector('header.site');
    const source = chapter?.querySelector('nav.main') || document.querySelector('nav');
    if (!source) return;
    const isChapter = Boolean(chapter);
    const isRoot = document.body.dataset.d9root === '1';
    document.body.classList.add('d9-has-menu');
    source.classList.add('d9-original-nav');
    const button = document.createElement('button');
    button.id = 'd9-menu-button';
    button.type = 'button';
    button.setAttribute('aria-label', 'Open menu');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'd9-site-menu');
    button.innerHTML = '<span>MENU</span><span class="d9-bars" aria-hidden="true"><i></i><i></i><i></i></span>';
    const dialog = document.createElement('dialog');
    dialog.id = 'd9-site-menu';
    dialog.setAttribute('aria-label', 'Site menu');
    const top = document.createElement('div');
    top.className = 'd9-menu-top';
    const title = document.createElement('strong');
    title.textContent = isChapter ? chapter.querySelector('h1').textContent : 'D9Legacy';
    const close = document.createElement('button');
    close.type = 'button'; close.textContent = 'Close ×'; close.setAttribute('aria-label', 'Close menu');
    top.append(title, close);
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Main menu');
    const login = document.createElement('a');
    login.href = (isChapter && !isRoot) ? 'login.html' : '/#/login';
    login.className = 'd9-login-link'; login.textContent = 'Login';
    nav.append(login);
    if (isChapter && !isRoot) {
      const directory = document.createElement('a');
      directory.href = 'directory.html'; directory.textContent = 'Chapter Directory';
      nav.append(directory);
    }
    source.querySelectorAll('a').forEach(link => {
      if (/log\s*in|^Hi,/i.test(link.textContent)) return;
      const copy = link.cloneNode(true); copy.removeAttribute('id'); copy.removeAttribute('class');
      if (!isChapter) {
        const url = new URL(copy.href);
        if (url.origin === location.origin && !url.hash && url.pathname !== '/') copy.href = '/#' + url.pathname;
      }
      nav.append(copy);
    });
    const features = [
      ['Chapter Locator','/locator.html'],['Nine Spotlights','/spotlights.html'],['D9 History','/history.html'],
      ['Founders Timeline','/timeline.html'],['Compare Orgs','/compare.html'],['Greek Alphabet','/greek-alphabet.html'],
      ['Achievements','/achievements.html'],['Awards','/awards.html'],['Collab Wall','/collab-wall.html'],
      ['Guestbook','/guestbook.html'],['Newsletter','/newsletter.html'],['Certificates','/certificates.html'],
      ['Contact Leadership','/leadership.html'],['FAQ','/faq.html'],['Owner Dashboard','/dashboard.html']
    ];
    const divider = document.createElement('p');
    divider.className = 'd9-menu-note';
    divider.style.marginTop = '14px';
    divider.textContent = 'D9Legacy features';
    nav.append(divider);
    features.forEach(([label, href]) => {
      const a = document.createElement('a');
      a.href = href; a.textContent = label;
      nav.append(a);
    });
    const note = document.createElement('p');
    note.className = 'd9-menu-note'; note.textContent = 'D9Legacy · Fan-made, not an official organization website.';
    dialog.append(top, nav, note); document.body.append(button, dialog);
    let previousOverflow = '';
    button.addEventListener('click', () => { previousOverflow = document.body.style.overflow; dialog.showModal(); document.body.style.overflow = 'hidden'; button.setAttribute('aria-expanded', 'true'); close.focus(); });
    const dismiss = () => dialog.close();
    close.addEventListener('click', dismiss);
    dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right) dismiss(); } });
    nav.addEventListener('click', event => { if (event.target.closest('a')) dismiss(); });
    dialog.addEventListener('close', () => { document.body.style.overflow = previousOverflow; button.setAttribute('aria-expanded', 'false'); button.focus(); });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  if (!document.querySelector('nav')) { const observer = new MutationObserver(() => { if (document.querySelector('nav')) { start(); observer.disconnect(); } }); observer.observe(document.body, {childList:true,subtree:true}); }
})();
