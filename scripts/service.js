const rootSelector = '[data-js-service-list]';

function service(rootElement) {
    const selectors = {
        serviceItem: '[data-js-service-item]',
    }

    const stateClasses = {
        isActive: 'is-active'
    }

    const initialState = {
        lastActiveIndex: 0
    }

    const serviceItemElements = document.querySelectorAll(selectors.serviceItem);

    const closeLastActiveElement = () => {
        const lastActiveElement = serviceItemElements[initialState.lastActiveIndex];
        lastActiveElement.classList.remove(stateClasses.isActive);
    }

    const onClickServiceItem = (event) => {
        const serviceItem = event.target.closest(selectors.serviceItem);

        if (serviceItem) {
            const newActiveIndex = [...serviceItemElements].indexOf(serviceItem);

            if (initialState.lastActiveIndex !== newActiveIndex) {
                closeLastActiveElement();
                initialState.lastActiveIndex = newActiveIndex;
            }

            serviceItem.classList.toggle(stateClasses.isActive);
        } 
    }

    rootElement.addEventListener('pointerup', (event) => onClickServiceItem(event))
}

function serviceCollection() {
    document.querySelectorAll(rootSelector).forEach(rootElement => {
        service(rootElement);
    })
}

export default serviceCollection;