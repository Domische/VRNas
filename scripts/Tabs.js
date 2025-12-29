const rootSelector = '[data-js-tablist]';

class Tabs {

    selectors = {
        tablink: '[data-js-tablink]',
        tabcontent: '[data-js-tabcontent]',
        tabbuttonPrevious: '[data-js-tabbutton-previous]',
        tabbuttonNext: '[data-js-tabbutton-next]',
        circle: '[data-js-circle]',
    }

    stateClasses = {
        isActive: 'is-active'
    }

    stateAttributes = {
        ariaSelected: 'aria-selected',
        tablinkValue: 'data-js-tablink-value',
        tabindex: 'tabindex',
    }

    stateProperty = {
        rotate: '--rotate'
    }

    initialState = {
        activeIndex: 0,
    }

    constructor(rootElement) {
        this.rootElement = rootElement;
        this.tablinkElements = document.querySelectorAll(this.selectors.tablink);
        this.tabcontentElements = document.querySelectorAll(this.selectors.tabcontent);
        this.tabbuttonPreviousElement = document.querySelector(this.selectors.tabbuttonPrevious);
        this.tabbuttonNextElement = document.querySelector(this.selectors.tabbuttonNext);
        this.circleElement = document.querySelector(this.selectors.circle);
        this.parseQueryParams();
        this.changePositionCircle();
        this.bindEvents();
    }

    selectTablink() {
        const tablinkElement = [...this.tablinkElements][this.initialState.activeIndex];

        if (tablinkElement) {
            tablinkElement.classList.add(this.stateClasses.isActive);
            tablinkElement.setAttribute(this.stateAttributes.ariaSelected, 'true');
            tablinkElement.setAttribute(this.stateAttributes.tabindex, '0');
            this.tabcontentElements[this.initialState.activeIndex].classList.add(this.stateClasses.isActive);

            const newId = tablinkElement.getAttribute(this.stateAttributes.tablinkValue);
            window.history.replaceState(
                {},
                '',
                `./detail-service.html?id=${newId}`
            )
        }
    }

    deselectTablink() {
        const tablinkElement = [...this.tablinkElements][this.initialState.activeIndex];

        if (tablinkElement) {
            tablinkElement.classList.remove(this.stateClasses.isActive);
            tablinkElement.setAttribute(this.stateAttributes.ariaSelected, 'false');
            tablinkElement.setAttribute(this.stateAttributes.tabindex, '-1');
            this.tabcontentElements[this.initialState.activeIndex].classList.remove(this.stateClasses.isActive);
        }
    }

    onPointerUpTablink({ target }) {
        if (target.closest(this.selectors.tablink)) {
            this.deselectTablink();
            const newActiveIndex = [...this.tablinkElements].indexOf(target);
            this.initialState.activeIndex = newActiveIndex;
            this.selectTablink();
        }
    }

    toTheNextTab = () => { // стрелочная функция, потому что при вызове action() теряется контекст this, а стрелочная фукция как раз берет тот контекст в котором она находится, то есть контекст DetailService
        if (this.initialState.activeIndex < this.tablinkElements.length - 1) {
            this.deselectTablink();
            this.initialState.activeIndex++;
            this.selectTablink();
        }
    }

    toThePreviousTab = () => { // стрелочная функция, потому что при вызове action() теряется контекст this, а стрелочная фукция как раз берет тот контекст в котором она находится, то есть контекст DetailService
        if (this.initialState.activeIndex > 0) {
            this.deselectTablink();
            this.initialState.activeIndex--;
            this.selectTablink();
        }
    }

    onKeyDown(event) {
        const { code } = event;

        const action = {
            ArrowRight: this.toTheNextTab,
            ArrowLeft: this.toThePreviousTab
        }[code];

        if (action) {
            event.preventDefault();
            action();
        }

    }

    onPointerUpTabbuttonNext() {
        this.toTheNextTab();
        this.changePositionCircle();
    }

    onPointerUpTabbuttonPrevious() {
        this.toThePreviousTab();
        this.changePositionCircle();
    }

    selectTablinkBasedOnQueryParams(id) {
        const tablinkIndex = [...this.tablinkElements].findIndex(item => item.getAttribute(this.stateAttributes.tablinkValue) === id);
        this.initialState.activeIndex = tablinkIndex;
        this.selectTablink();
    }

    parseQueryParams() {
        const queryParams = new URLSearchParams(document.location.search);
        const id = queryParams.get('id');
        id ? this.selectTablinkBasedOnQueryParams(id) : this.selectTablink();
    }

    changePositionCircle() {
        if(window.matchMedia('(max-width: 1024.98px)').matches){
            switch (this.initialState.activeIndex) {
                case 0:
                    this.circleElement.style.setProperty(this.stateProperty.rotate, '87.5deg')
                    break;
                case 1:
                    this.circleElement.style.setProperty(this.stateProperty.rotate, '62.5deg')
                    break;
                case 2:
                    this.circleElement.style.setProperty(this.stateProperty.rotate, '32.5deg')
                    break;
                case 3:
                    this.circleElement.style.setProperty(this.stateProperty.rotate, '0deg')
                    break;
                case 4:
                    this.circleElement.style.setProperty(this.stateProperty.rotate, '-32.5deg')
                    break;
                case 5:
                    this.circleElement.style.setProperty(this.stateProperty.rotate, '-62.5deg')
                    break;
                case 6:
                    this.circleElement.style.setProperty(this.stateProperty.rotate, '-87.5deg')
                    break;
                default:
                    break;
            }
        }
    }

    bindEvents() {
        this.rootElement.addEventListener('pointerup', (event) => this.onPointerUpTablink(event));
        this.rootElement.addEventListener('keydown', (event) => this.onKeyDown(event));
        this.tabbuttonNextElement.addEventListener('pointerup', () => this.onPointerUpTabbuttonNext());
        this.tabbuttonPreviousElement.addEventListener('pointerup', () => this.onPointerUpTabbuttonPrevious());
    }

}

class TabsCollection {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll(rootSelector).forEach(rootElement => {
            new Tabs(rootElement);
        });
    }
}

export default TabsCollection;