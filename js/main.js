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


const list = document.querySelector('.cross-sell__list');

const render = data => {
    data.forEach(item => {
        list.insertAdjacentHTML('beforeend', `
            <li>
                <article class="cross-sell__item">
                    <img class="cross-sell__image" src="${item.photo}" alt="${item.id}">
                    <h3 class="cross-sell__title">${item.name}</h3>
                    <p class="cross-sell__price">${item.price}₽</p>
                    <button type="button" class="button button_buy cross-sell__button">Купить</button>
                </article>
            </li>
        `);
    });
};




const getData = () => {
    return fetch('./cross-sell-dbase/dbase.json')
        .then(response => response.json())
        .catch(error => console.error(error));
};


const stack = 4;
let begin = 0;

// const sliceArray = (data) => data.slice(position, stack);

const changeData = () => {
    getData().then(data => {
        const end = begin + stack;
        render(data.slice(begin, end));

        if (data.length > end) {
            begin += stack;
        } else {
            document.querySelector('.cross-sell__add').style.display = 'none';
        }
    });
};


const $modal = document.querySelector('.modal');
const $form = $modal.querySelector('form');

const modalOpen = () => {
    const title = document.querySelector('.card-details__title').textContent;
    $modal.querySelector('.modal__title').textContent = title;
    $modal.style.display = 'flex';
};
const modalClose = () => {
    $modal.style.display = '';
};

const sendForm = () => {
    const formData = {};
    const labels = $form.querySelectorAll('.modal__label');
    labels.forEach(label => {
        const span = label.querySelector('span');
        const input = label.querySelector('input');
        formData[span.textContent] = input.value;
    });

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method:  'POST',
        body:    JSON.stringify(formData),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            $form.reset();
            modalClose();
        });
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

    /**
     * @type {HTMLElement}
     */
    const $chItem = t.closest('.characteristics__item');
    /**
     * @type {HTMLElement}
     */
    const $chParent = t.closest('.characteristics__list');

    if ($chParent && $chItem) {
        const $title = $chItem.querySelector('.characteristics__title');
        const $description = $chItem.querySelector('.characteristics__description');

        const $active = $chParent.querySelector('.characteristics__title.active');
        const $open = $chParent.querySelector('.characteristics__description.open');

        $active && $active !== $title && $active.classList.remove('active');

        if ($open && $open !== $description) {
            $open.classList.remove('open');
            $open.style.height = '0px';
        }

        $title.classList.toggle('active');
        $description.classList.toggle('open');
        $description.style.height = $description.classList.contains('open')
            ? $description.scrollHeight + 'px' : '0px';
    }

    /**
     * @type {HTMLElement}
     */
    const $btnAdd = t.closest('.cross-sell__add');
    $btnAdd && changeData();



    /**
     * @type {HTMLElement}
     */
    const $btnOpenModal = t.closest('.card-details__button_delivery');
    $btnOpenModal && modalOpen();

    /**
     * @type {HTMLElement}
     */
    const $modalClose = t.closest('.modal__close');
    $modalClose && modalClose();

    /**
     * @type {HTMLElement}
     */
    const $submit = t.closest('[type=submit]');
    $submit && sendForm();
});


changeActiveTabs();
changeData();
