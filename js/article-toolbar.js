/* Theme + Language toolbar for article pages
   2024- Alejandro Rojo Gualix */

// Runs immediately to prevent flash of wrong theme
(function () {
    var theme = localStorage.getItem('article-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
})();

// Derive base path from this script's src (e.g. "../../js/article-toolbar.js" → "../../")
var _atb_basePath = document.currentScript.getAttribute('src').replace('js/article-toolbar.js', '');

// Toolbar creation after DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    var bp = _atb_basePath;
    var body = document.body;
    var year = body.getAttribute('data-year') || '';
    var month = body.getAttribute('data-month');
    var date = month ? year + '-' + (month.length < 2 ? '0' + month : month) : year;
    var license = body.getAttribute('data-license') || 'cc-by-nc';
    // Where the author's page lives. Absent means the old behaviour, a file
    // called aboutme.html beside the page; an empty attribute means there is no
    // such page here and the name is written without a link. An autonomous
    // project has nowhere honest to point: chinese-graphemes carries no aboutme.html,
    // and deployed at writing/chineseGraphemes/ the site has none there either,
    // because the site's lives at its root. So the link was dead standalone AND
    // dead deployed, on every page, and no checker saw it: it is concatenated
    // here at run time, and a reference built out of `+` is not a path any
    // scanner can follow.
    var about = body.getAttribute('data-about');
    var byline = function (prefix) {
        var name = 'Alejandro Rojo';
        var linked = (about === null) ? '<a href="' + bp + 'aboutme.html">' + name + '</a>'
                   : (about ? '<a href="' + about + '">' + name + '</a>' : name);
        return '<span>' + prefix + date + ' ' + linked + '</span>';
    };

    var toolbar = document.createElement('nav');
    toolbar.className = 'article-toolbar';

    // Left: return link
    var left = document.createElement('div');
    left.className = 'toolbar-left';
    left.innerHTML = '<a href="' + bp + 'index.html">\u2190 Inicio</a>';

    // Center: license + author
    var center = document.createElement('div');
    center.className = 'toolbar-center';
    if (license === 'copyright') {
        center.innerHTML = byline('\u00A9 ');
    } else if (license === 'mit') {
        // An application is software and takes the licence its LICENSE file
        // takes. There is no icon for MIT and none is invented: the wording is
        // the one tools/binarydivision/binarydivision.html already uses.
        center.innerHTML =
            '<a class="license-icons" href="https://opensource.org/licenses/MIT" title="MIT license">MIT</a>' +
            byline('');
    } else if (license === 'cc-by') {
        // The branch the house rule has been asking for since 2026-08-26:
        // attribution as the only condition, which is the same decision the MIT
        // of the code makes, written for creative work. The `-NC` below says
        // the opposite -- that the program may be sold and the text explaining
        // it may not -- and a project whose LICENSE is MIT must not stamp it.
        center.innerHTML =
            '<a class="license-icons" href="https://creativecommons.org/licenses/by/4.0/deed.en">' +
                '<img class="invert" src="' + bp + 'img/license_CC.png">' +
                '<img class="invert" src="' + bp + 'img/license_Attribution.png">' +
            '</a>' +
            byline('');
    } else {
        center.innerHTML =
            '<a class="license-icons" href="https://creativecommons.org/licenses/by-nc/4.0/deed.en">' +
                '<img class="invert" src="' + bp + 'img/license_CC.png">' +
                '<img class="invert" src="' + bp + 'img/license_Attribution.png">' +
                '<img class="invert" src="' + bp + 'img/license_NonCommercial.png">' +
            '</a>' +
            byline('');
    }

    // Right: theme toggle + language toggle
    var right = document.createElement('div');
    right.className = 'toolbar-right';

    // Theme button
    var themeBtn = document.createElement('button');
    themeBtn.id = 'theme-toggle';
    themeBtn.title = 'Cambiar tema';
    themeBtn.setAttribute('aria-label', 'Cambiar tema');
    themeBtn.innerHTML =
        '<svg class="icon-sun" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">' +
            '<circle cx="12" cy="12" r="5"/>' +
            '<line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>' +
            '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>' +
            '<line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>' +
            '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>' +
        '</svg>' +
        '<svg class="icon-moon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>' +
        '</svg>';

    // Language link, drawn only when there IS another language.
    //
    // The old rule deduced the counterpart from the filename and drew the link
    // unconditionally, so every page without a translation offered one anyway:
    // four of this project's six pages linked to a file that does not exist. A
    // page now names its counterpart outright with data-lang-alt, which is the
    // only claim nothing here can get wrong -- a script cannot check from the
    // client that a deduced filename resolves.
    //
    // The naming is X.html for English and X.es.html for Spanish, matching the
    // README.md / README.es.md pair the workshop uses. That is the reverse of
    // the site's older X.html / X_EN.html, still honoured below so an _EN page
    // can find its way back.
    var langLink = null;
    var path = window.location.pathname;
    var file = path.substring(path.lastIndexOf('/') + 1);
    var alt = body.getAttribute('data-lang-alt');
    if (!alt && file.endsWith('_EN.html')) alt = file.replace('_EN.html', '.html');
    if (alt) {
        var toEnglish = (document.documentElement.getAttribute('lang') || 'es').slice(0, 2) !== 'en';
        langLink = document.createElement('a');
        langLink.id = 'lang-toggle';
        langLink.href = alt;
        langLink.textContent = toEnglish ? 'EN' : 'ES';
        langLink.title = toEnglish ? 'English version' : 'Version en espanol';
    }

    // Sources link (only if data-sources is set)
    var sourcesUrl = body.getAttribute('data-sources');
    if (sourcesUrl) {
        var srcLink = document.createElement('a');
        srcLink.id = 'sources-link';
        srcLink.href = sourcesUrl;
        srcLink.title = 'Fuentes / Sources';
        srcLink.innerHTML =
            '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>' +
                '<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>' +
            '</svg>';
    }

    right.appendChild(themeBtn);
    if (srcLink) right.appendChild(srcLink);
    if (langLink) right.appendChild(langLink);

    toolbar.appendChild(left);
    toolbar.appendChild(center);
    toolbar.appendChild(right);
    body.prepend(toolbar);

    // Theme icon visibility
    function updateIcon() {
        var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        themeBtn.querySelector('.icon-sun').style.display = isDark ? 'none' : 'inline';
        themeBtn.querySelector('.icon-moon').style.display = isDark ? 'inline' : 'none';
    }
    updateIcon();

    themeBtn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('article-theme', next);
        updateIcon();
    });
});
