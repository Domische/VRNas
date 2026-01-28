const rootSelector = '[data-js-list]';

function addIsActive(rootElement) {
    const selectors = {
        item: '[data-js-item]',
    }

    const stateClasses = {
        isActive: 'is-active'
    }

    const initialState = {
        lastActiveIndex: 0
    }

    // // NodeList
    // console.log(rootElement.childNodes);//живая коллекция элементов
    // console.log(document.getElementsByName('item'));//живая коллекция элементов (только по атрибуту name="item", а не просто по атрибуту data-js-item и от document). Спорный метод - работает по разному в разных браузерах и версиях браузеров.
    // console.log(rootElement.querySelectorAll(selectors.item));//статическая коллекция элементов

    // // HTMLCollection
    // console.log(rootElement.getElementsByTagName('li'));//живая коллекция элементов
    // console.log(rootElement.getElementsByClassName('blog__item'));//живая коллекция элементов
    // console.log(rootElement.children);//живая коллекция элементов

    // NodeList хранит любые типы узлов, например, текстовые узлы и комментарии, а HTMLCollection — только узлы HTML-элементов.
    // HTMLCollection позволяет обращаться к элементам не только по индексу, но и по имени, с помощью метода namedItem.
    // NodeList может быть не только «живой» коллекцией, но и статической. Такая коллекция не обновляется при появлении на странице новых элементов.

    const itemElements = rootElement.children;//children, потому что нужна живая коллекция элементов для страницы блога (itemElements грузятся с сервера), на поведение на других страницах не влияет.

    const closeLastActiveElement = () => {
        const lastActiveElement = itemElements[initialState.lastActiveIndex];
        lastActiveElement.classList.remove(stateClasses.isActive);
    }

    const onClickItem = (event) => {
        const item = event.target.closest(selectors.item);

        if (item) {
            const newActiveIndex = [...itemElements].indexOf(item);

            if (initialState.lastActiveIndex !== newActiveIndex) {
                closeLastActiveElement();
                initialState.lastActiveIndex = newActiveIndex;
            }

            item.classList.toggle(stateClasses.isActive);
        }
    }

    rootElement.addEventListener('pointerup', (event) => onClickItem(event));
}

function addIsActiveCollection() {
    document.querySelectorAll(rootSelector).forEach(rootElement => {
        addIsActive(rootElement);
    })
}

export default addIsActiveCollection;