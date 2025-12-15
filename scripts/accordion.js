const rootSelector = '[data-js-accordion-group]';

function accordion(rootElement) {
    const selectors = {
        button: '[data-js-accordion-button]'
    }

    const stateClasses = {
        isActive: 'is-active'
    }

    const stateAttributes = {
        ariaExpanded: 'aria-expanded'
    }

    const initialState = {
        previousActiveButtonIndex: 0
    }

    const buttonElements = rootElement.querySelectorAll(selectors.button);

    const onClickButton = (event) => {      
        const element = event.target.closest(selectors.button);
        const buttonElementsArray = [...buttonElements];
        const newActiveButtonIndex = buttonElementsArray.indexOf(element);
        const previousActiveButtonIndex = initialState.previousActiveButtonIndex;
        const wasExpanded = element.getAttribute(stateAttributes.ariaExpanded) === 'true';

        element.setAttribute(stateAttributes.ariaExpanded, !wasExpanded);
        console.log(previousActiveButtonIndex);
        console.log(newActiveButtonIndex);
        

        if (previousActiveButtonIndex !== newActiveButtonIndex) {
            const previousActiveButton = buttonElementsArray[previousActiveButtonIndex];            
            // const isTheSafariBrowser = navigator.userAgent.toLowerCase().includes('safari') && !navigator.userAgent.toLowerCase().includes('chrome');
            previousActiveButton.classList.remove(stateClasses.isActive);
            previousActiveButton.setAttribute(stateAttributes.ariaExpanded, false);

            //чтобы в safari не дергалась анимация
            // if (isTheSafariBrowser) {
            //     setTimeout(() => {
            //         element.classList.add(stateClasses.isActive);
            //     }, 150) //это лучше в safari
            //     //или
            //     // requestAnimationFrame(()=> {
            //     //     element.classList.add(stateClasses.isActive);
            //     // })
            // } else {
                element.classList.add(stateClasses.isActive);
            // }
        } else {
            element.classList.toggle(stateClasses.isActive);
        }

        initialState.previousActiveButtonIndex = newActiveButtonIndex;
    }

    buttonElements.forEach(buttonElement => {
        buttonElement.addEventListener('pointerup', (event) => onClickButton(event));
    })

}

function accordionCollection() {
    document.querySelectorAll(rootSelector).forEach(rootElement => {
        accordion(rootElement);
    })
}

export default accordionCollection;