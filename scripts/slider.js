const rootSelector = '[data-js-slider]';

const selectors = {
    sliderList: '[data-js-slider-list]',
    sliderDot: '[data-js-slider-dot]'
}

const stateClasses = {
    isActive: 'is-active'
}

const initialState = {
    sliderDotIndex: 0,
    startPositionXRelativeSliderList: 0,
    movePositionXRelativeSliderList: 0,
    movePositionXRelativeSliderWindow: 0,
    translateXRelativeSliderList: 0,
    translateXRelativeSliderWindow: 0,
}

function slider(rootElement) {
    const sliderListElement = rootElement.querySelector(selectors.sliderList);
    const sliderDotElements = rootElement.querySelectorAll(selectors.sliderDot);

    const moveSlider = () => {
        sliderListElement.style.translate = `${-sliderListElement.clientWidth * initialState.sliderDotIndex}px`;
    }

    const activeDot = () => {
        sliderDotElements.forEach(sliderDotElement => {
            sliderDotElement.classList.remove(stateClasses.isActive);
        });

        const activeDotElement = [...sliderDotElements].find((item, index) => index === initialState.sliderDotIndex);

        activeDotElement.classList.add(stateClasses.isActive);
    }

    const onClickDot = ({ target }) => {
        if (target.closest(selectors.sliderDot)) {
            initialState.sliderDotIndex = [...sliderDotElements].indexOf(target);
            
            activeDot();
            moveSlider();
        };
    }

    const translateXSlider = () => {
        initialState.translateXRelativeSliderList = initialState.movePositionXRelativeSliderWindow - initialState.startPositionXRelativeSliderList;
        initialState.translateXRelativeSliderWindow = initialState.movePositionXRelativeSliderList - initialState.startPositionXRelativeSliderList;

        sliderListElement.style.translate = `${initialState.translateXRelativeSliderList}px`;
    }

    const touchstartSlider = (event)=> {
        initialState.startPositionXRelativeSliderList = event.touches[0].clientX + sliderListElement.clientWidth * initialState.sliderDotIndex;
    }

    const touchmoveSlider = (event) => {
        initialState.movePositionXRelativeSliderWindow = event.touches[0].clientX;
        initialState.movePositionXRelativeSliderList = event.touches[0].clientX + sliderListElement.clientWidth * initialState.sliderDotIndex;

        translateXSlider();
    }

    const touchendSlider = ()=> {
        const minScrollWidth = sliderListElement.clientWidth / 3;   
        
        const next = initialState.sliderDotIndex < sliderDotElements.length-1 && initialState.translateXRelativeSliderWindow < 0 && Math.abs(initialState.translateXRelativeSliderWindow) > minScrollWidth;
        const prev = initialState.sliderDotIndex > 0 && initialState.translateXRelativeSliderWindow > 0 && initialState.translateXRelativeSliderWindow > minScrollWidth;
        
        next && initialState.sliderDotIndex++;
        prev && initialState.sliderDotIndex--;

        (next || prev) && activeDot();

        moveSlider();

        initialState.translateXRelativeSliderWindow = 0;
    }
    
    rootElement.addEventListener('click', (event) => onClickDot(event));
    window.addEventListener('resize', () => moveSlider());
    sliderListElement.addEventListener('touchstart', (event) => touchstartSlider(event));
    sliderListElement.addEventListener('touchmove', (event) => touchmoveSlider(event));
    sliderListElement.addEventListener('touchend', () => touchendSlider());
}

function sliderCollection() {
    document.querySelectorAll(rootSelector).forEach(rootElement => {
        slider(rootElement);
    })
}

export default sliderCollection;