'use strict';

// seamless.polyfill();

const scrollSmooth = id => {
    if (id.startsWith('#')) id = id.substring(1);
    const $anchor = document.getElementById(id);
    $anchor && seamless.elementScrollIntoView($anchor, {
        behavior: 'smooth',
        block:    'start',
        inline:   'center',
    });
};

document.body.addEventListener('click', event => {
    event.preventDefault();
    const t = event.target;

    const $a = t.closest('a');
    $a && $a.hash && scrollSmooth($a.hash);
});
