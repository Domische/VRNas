const rootSelector = '[data-js-tabs]';

class Tabs {
    selectors = {
        item: '[data-js-tabs-item]',
        content: '[data-js-tabs-content]',
    }

    stateAttributes = {
        tabindex: 'tabindex',
        ariaSelected: 'aria-selected',
        tabsValue: 'data-js-tabs-value',
    }

    stateClasses = {
        isActive: 'is-active'
    }

    initialState = {
        activeIndex: 0
    }

    constructor(rootElement) {
        this.rootElement = rootElement;
        this.itemElements = this.rootElement.querySelectorAll(this.selectors.item);
        this.contentElements = this.rootElement.querySelectorAll(this.selectors.content);

        this.parseQueryParams();
        this.bindEvents();
    }

    deselectTab() {
        const lastActiveItemElement = this.itemElements[this.initialState.activeIndex];
        const lastActiveContentElement = this.contentElements[this.initialState.activeIndex];

        lastActiveItemElement.classList.remove(this.stateClasses.isActive);
        lastActiveContentElement.classList.remove(this.stateClasses.isActive);

        lastActiveItemElement.setAttribute(this.stateAttributes.tabindex, '-1');
        lastActiveItemElement.setAttribute(this.stateAttributes.ariaSelected, false);
    }

    selectTab() {
        const newActiveItemElement = this.itemElements[this.initialState.activeIndex];
        const newActiveContentElement = this.contentElements[this.initialState.activeIndex];

        newActiveItemElement.classList.add(this.stateClasses.isActive);
        newActiveContentElement.classList.add(this.stateClasses.isActive);

        newActiveItemElement.setAttribute(this.stateAttributes.tabindex, '0');
        newActiveItemElement.setAttribute(this.stateAttributes.ariaSelected, true);

        const newId = newActiveItemElement.getAttribute(this.stateAttributes.tabsValue);

        window.history.replaceState(
            {},
            '',
            `?id=${newId}`
        )
    }

    selectTabBasedOnQueryParams(id){
        const itemIndex = [...this.itemElements].findIndex(item => item.getAttribute(this.stateAttributes.tabsValue)===id);

        itemIndex!==-1 && (this.initialState.activeIndex = itemIndex);

        this.selectTab();
    }

    parseQueryParams() {
        const queryParams = new URLSearchParams(document.location.search);
        const id = queryParams.get('id');
        id ? this.selectTabBasedOnQueryParams(id) : this.selectTab();
    }

    onClickTabs({ target }) {
        if (target.closest(this.selectors.item)) {
            this.deselectTab();

            const newActiveIndex = [...this.itemElements].indexOf(target);
            this.initialState.activeIndex = newActiveIndex;

            this.selectTab();
        }
    }

    toTheNextTab = () => { // стрелочная функция, потому что при вызове action() теряется контекст this, а стрелочная фукция как раз берет тот контекст в котором она находится
        if(this.initialState.activeIndex < [...this.itemElements].length - 1){
            this.deselectTab();
            this.initialState.activeIndex++;
            this.selectTab();
        } 
    }

    toThePreviousTab = () => { // стрелочная функция, потому что при вызове action() теряется контекст this, а стрелочная фукция как раз берет тот контекст в котором она находится
        if(this.initialState.activeIndex > 0){
            this.deselectTab();
            this.initialState.activeIndex--;
            this.selectTab();
        } 
    }

    onKeyDown(event){
        const {code} = event;

        const action = {
            ArrowRight: this.toTheNextTab,
            ArrowLeft: this.toThePreviousTab,
        }[code];        

        if(action){
            event.preventDefault();
            action();
        }
    }

    bindEvents() {
        this.rootElement.addEventListener('click', (event) => this.onClickTabs(event));
        this.rootElement.addEventListener('keydown', (event) => this.onKeyDown(event));
    }
}

class TabsCollection {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll(rootSelector).forEach(rootElement => {
            new Tabs(rootElement);
        })
    }
}

export {Tabs};

export default TabsCollection;