function burgerButton() {
    const selectors = {
        root: '[data-js-header]',
        overlay: '[data-js-header-overlay]',
        button: '[data-js-header-burger-button]',
        link: '[data-js-header-link]'
    }

    const stateClasses = {
        isActive: 'is-active',
        isLock: 'is-lock',
    }

    const rootElement = document.querySelector(selectors.root);
    const overlayElement = rootElement.querySelector(selectors.overlay);
    const buttonElement = rootElement.querySelector(selectors.button);
    const linkElement = rootElement.querySelector(selectors.link);

    const onButtonClick = ()=> {
        buttonElement.classList.toggle(stateClasses.isActive);
        overlayElement.classList.toggle(stateClasses.isActive);
        document.documentElement.classList.toggle(stateClasses.isLock);
        
        buttonElement.setAttribute('disabled', '');
        setTimeout(() => {
            buttonElement.removeAttribute('disabled');
            linkElement.focus();
        }, 500)
    };

    buttonElement.addEventListener('click', onButtonClick);
}

export default burgerButton;