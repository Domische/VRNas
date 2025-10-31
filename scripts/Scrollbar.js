const rootSelector = '[data-js-feed]';

class Scrollbar {
    selectors = {
        list: '[data-js-list]',
        scrollbar: '[data-js-scrollbar]',
        thumb: '[data-js-thumb]'
    }

    stateClasses = {
        isActive: 'is-active'
    }

    initialState = {
        thumbInitialPositionY: null,
    }

    constructor(rootElement) {
        this.rootElement = rootElement;
        this.listElement = rootElement.querySelector(this.selectors.list);
        this.scrollbarElement = rootElement.querySelector(this.selectors.scrollbar);
        this.thumbElement = this.scrollbarElement.querySelector(this.selectors.thumb);

        this.bindEvents();
    }

    scroll = () => {
        const scrollbarElementHeight = this.scrollbarElement.clientHeight;

        const listElementHeight = this.listElement.clientHeight;
        const listElementScrolledHeight = this.listElement.scrollTop;
        const listElementFullHeight = this.listElement.scrollHeight - listElementHeight;

        const thumbElementHeight = this.thumbElement.clientHeight;

        const thumbElementPositionTop = listElementScrolledHeight * (100 - (thumbElementHeight * 100 / scrollbarElementHeight)) / listElementFullHeight;

        this.thumbElement.style.top = `${thumbElementPositionTop}%`;
    }

    pointerDownThumb = (event) => {
        this.thumbElement.classList.add(this.stateClasses.isActive);

        const clickPositionY = event.clientY;

        const thumbPositionY = event.target.getBoundingClientRect().y;

        const thumbClickPositionY = clickPositionY - thumbPositionY;

        this.initialState.thumbInitialPositionY = thumbClickPositionY;
    }

    pointerUpThumb = () => {
        this.thumbElement.classList.remove(this.stateClasses.isActive);
    }

    pointerMouveThumb(event) {
        const movePositionY = event.clientY;

        const { y, height } = this.scrollbarElement.getBoundingClientRect();

        const thumbMovePositionY = (movePositionY - y - this.initialState.thumbInitialPositionY);
        
        const thumbPositionYPercent = thumbMovePositionY * 100 / (height - this.thumbElement.clientHeight);

        const listPositionYPercent = (this.listElement.scrollHeight - this.listElement.clientHeight) * thumbPositionYPercent / 100;

        const isMove = this.thumbElement.classList.contains(this.stateClasses.isActive) && thumbMovePositionY > 0 && thumbMovePositionY < height - this.thumbElement.clientHeight;

        if (isMove) {
            this.thumbElement.style.top = `${thumbMovePositionY}px`;
            this.listElement.scrollTop = listPositionYPercent;
        }
    }

    bindEvents() {
        this.listElement.addEventListener('scroll', () => this.scroll());
        this.thumbElement.addEventListener('pointerdown', (event) => this.pointerDownThumb(event));
        this.thumbElement.addEventListener('pointerup', (event) => this.pointerUpThumb(event));
        this.thumbElement.addEventListener('pointerleave', () => this.pointerUpThumb());
        this.scrollbarElement.addEventListener('pointermove', (event) => this.pointerMouveThumb(event));
    }
}

class ScrollbarCollection {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll(rootSelector).forEach(rootElement => {
            new Scrollbar(rootElement);
        })
    }
}

export default ScrollbarCollection;