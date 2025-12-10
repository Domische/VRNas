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

    const itemElements = document.querySelectorAll(selectors.item);

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