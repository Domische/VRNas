const rootSelector = '[data-js-header-menu-item]';

class SubMenuButton {
    selectors = {
        button: '[data-js-header-menu-button]',
        submenu: '[data-js-header-submenu-list]',
        link: '[data-js-header-submenu-link]',
        contactUsLink: '[data-js-header-contact-us-link]',
    }

    stateClasses = {
        isActive: 'is-active',
        openToTheLeftSide: 'open-to-the-left-side',
        openToTheRightSide: 'open-to-the-right-side',
    }

    stateAttributes = {
        ariaExpanded: 'aria-expanded',
    }

    initialState = {
        isExpanded: false,
    }

    constructor(rootElement) {
        this.rootElement = rootElement;
        this.buttonElement = this.rootElement.querySelector(this.selectors.button);
        this.submenuElement = this.rootElement.querySelector(this.selectors.submenu);
        this.linkElements = this.submenuElement.querySelectorAll(this.selectors.link);
        this.lastLinkElement = this.linkElements[this.linkElements.length - 1];

        this.contactUsLinkElement = document.querySelector(this.selectors.contactUsLink);

        this.bindEvents();

        this.fixSubmenuPosition();
    }

    updateUI(event) {
        const { isExpanded } = this.initialState;

        this.buttonElement.setAttribute(this.stateAttributes.ariaExpanded, isExpanded);

        this.rootElement.classList.toggle(this.stateClasses.isActive, isExpanded);
        this.buttonElement.classList.toggle(this.stateClasses.isActive, isExpanded);
        this.submenuElement.classList.toggle(this.stateClasses.isActive, isExpanded);

        //Poka-yoke
        this.buttonElement.setAttribute('disabled', '');

        setTimeout(() => {
            this.buttonElement.removeAttribute('disabled');
            if (event?.type === 'click') {
                this.buttonElement.focus();
            }
        }, 600)

    }

    expand(event) {
        this.initialState.isExpanded = true;
        this.updateUI(event);
    }

    collapse(event) {
        this.initialState.isExpanded = false;
        this.updateUI(event);
    }

    fixSubmenuPosition = () => {
        const { right } = this.buttonElement.getBoundingClientRect();
        const { left } = this.contactUsLinkElement.getBoundingClientRect();

        //используем offsetWidth, а не clientWidth, так как учитываем border
        const submenuWidth = this.submenuElement.offsetWidth;

        const openToTheLeftSide = right + submenuWidth > left;

        this.submenuElement.classList.toggle(this.stateClasses.openToTheLeftSide, openToTheLeftSide);
        this.submenuElement.classList.toggle(this.stateClasses.openToTheRightSide, !openToTheLeftSide);

        if (window.matchMedia('(max-width: 768px)').matches) {
            this.submenuElement.classList.remove(this.stateClasses.openToTheLeftSide);
            this.submenuElement.classList.remove(this.stateClasses.openToTheRightSide);
        }
    }

    onButtonClick = (event) => {
        const { isExpanded } = this.initialState;

        isExpanded ? this.collapse(event) : this.expand(event);
    }

    onButtonClickOutside = (event) => {
        if (!event.target.closest(rootSelector)) {
            this.collapse();
        }
    }

    onButtonEnter = () => {
        if (window.matchMedia('(min-width: 768px)').matches) {
            this.expand();
        }
    }

    onButtonLeave = () => {
        if (window.matchMedia('(min-width: 768px)').matches) {
            this.collapse();
        }
    }

    bindEvents() {
        this.buttonElement.addEventListener('click', this.onButtonClick);
        this.buttonElement.addEventListener('mouseenter', this.onButtonEnter);
        this.rootElement.addEventListener('mouseleave', this.onButtonLeave);
        window.addEventListener('click', this.onButtonClickOutside);
        this.lastLinkElement.addEventListener('blur', () => this.collapse());
        window.addEventListener('resize', this.fixSubmenuPosition);
    }
}

class SubMenuButtonCollection {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll(rootSelector).forEach(rootElement => {
            new SubMenuButton(rootElement);
        })
    }
}

export default SubMenuButtonCollection;