import { Tabs } from "./Tabs.js";

const rootSelector = '[data-js-tabs-alt]';

class TabsAlt extends Tabs {

    stateProperty = {
        rotate: '--rotate'
    }

    constructor(rootElement) {
        super(rootElement);

        this.selectors = {
            ...this.selectors,
            tabbuttonPrevious: '[data-js-tabs-button-previous]',
            tabbuttonNext: '[data-js-tabs-button-next]',
            circle: '[data-js-circle]',
        }

        this.tabbuttonPreviousElement = this.rootElement.querySelector(this.selectors.tabbuttonPrevious);
        this.tabbuttonNextElement = this.rootElement.querySelector(this.selectors.tabbuttonNext);
        this.circleElement = this.rootElement.querySelector(this.selectors.circle);

        this.changePositionCircle();
        this.bindChildEvents();
    }

    onPointerUpTabbuttonNext() {
        this.toTheNextTab();
        this.changePositionCircle();
    }

    onPointerUpTabbuttonPrevious() {
        this.toThePreviousTab();
        this.changePositionCircle();
    }

    changePositionCircle() {
        if (window.matchMedia('(max-width: 1024.98px)').matches) {
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

    bindChildEvents() {
        this.tabbuttonNextElement?.addEventListener('pointerup', () => this.onPointerUpTabbuttonNext());
        this.tabbuttonPreviousElement?.addEventListener('pointerup', () => this.onPointerUpTabbuttonPrevious());
    }

}

class TabsAltCollection {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll(rootSelector).forEach(rootElement => {
            new TabsAlt(rootElement);
        });
    }
}

export default TabsAltCollection;