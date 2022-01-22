'use strict';

// seamless.polyfill();

const cardContent = {
    'Графитовый': {
        name:   'Graphite',
        memory: '128',
        price:  90000,
        image:  'iPhone-graphite.webp'
    },
    'Серебристый': {
        name:   'Silver',
        memory: '256',
        price:  110000,
        image:  'iPhone-silver.webp'
    },
    'Небесно-голубой': {
        name:   'Sierra Blue',
        memory: '512',
        price:  130000,
        image:  'iPhone-sierra_blue.webp'
    },
};

/**
 *
 * @param {string} id
 */
const changeContent = id => {
    const $cardTitle = document.querySelector('.card-details__title');
    const $cardPrice = document.querySelector('.card-details__price');
    const $cardImage = document.querySelector('.card__image_item');
    const title = `Смартфон Apple iPhone 13 Pro ${cardContent[id].memory}GB ${cardContent[id].name}`;

    $cardTitle.innerText = title;
    document.title = title;
    $cardPrice.innerText = cardContent[id].price + '₽';
    $cardImage.src = `img/${cardContent[id].image}`;
};

/**
 *
 * @param {string} id
 */
const scrollSmooth = selector => {
    /**
     * @type {HTMLElement}
     */
    let $view;
    if (selector.startsWith('#')) {
        $view = document.getElementById(selector.substring(1));
    } else {
        $view = document.querySelector(selector);
    }

    $view && seamless.elementScrollIntoView($view, {
        behavior: 'smooth',
        block:    'start',
        inline:   'center',
    });
};

/**
 *
 * @param {HTMLButtonElement} $button
 */
const changeActiveTabs = $button => {
    $button ??= document.querySelector('.card-detail__change');
    const $parent = $button.closest('.card-detail__buttons');
    $parent.querySelector('.card-detail__change.active').classList.remove('active');
    $button.classList.add('active');
    changeContent($button.innerText);
};

document.body.addEventListener('click', event => {
    event.preventDefault();
    const t = event.target;

    /**
     * @type {HTMLAnchorElement}
     */
    const $a = t.closest('a');
    $a && $a.hash && scrollSmooth($a.hash);

    /**
     * @type {HTMLButtonElement}
     */
    const $button = t.closest('button.card-detail__change');
    $button && changeActiveTabs($button);
});

changeActiveTabs();
