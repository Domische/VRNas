const rootSelector = '[data-js-email-form]';

class EmailValidation {
    selectors = {
        input: '[data-js-email-input]',
        message: '[data-js-email-message]',
    }

    regexp = {
        validationRFC5322: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    }

    stateClasses = {
        isActive: 'is-active',
        isInvalid: 'is-invalid'
    }

    stateProperty = {
        messageWidth: '--message-width',
        animationDuration: '--animation-duration'
    }

    constructor(rootElement) {
        this.rootElement = rootElement;
        this.inputElement = document.querySelector(this.selectors.input);
        this.messageElement = document.querySelector(this.selectors.message);

        this.bindEvents();
    }

    animateMessage = (value)=> {
        this.messageElement.textContent = value;
        this.messageElement.style.setProperty(this.stateProperty.messageWidth, `${this.messageElement.clientWidth / 1.5}px`)
        this.messageElement.classList.add(this.stateClasses.isActive);

        const animationDuration = +getComputedStyle(this.messageElement).getPropertyValue(this.stateProperty.animationDuration) - 100;        
        
        setTimeout(() => {
            this.messageElement.textContent = '';
            this.messageElement.classList.remove(this.stateClasses.isActive);
        }, animationDuration)
    }

    onChangeInput = ({ target }) => {
        const isValid = this.regexp.validationRFC5322.test(target.value);
        const isEmpty = target.value === '';

        this.rootElement.classList.toggle(this.stateClasses.isInvalid, !isValid && !isEmpty);
    }

    onSubmitInput = (event) => {
        event.preventDefault();

        const {value} = event.target[0];

        const isValid = this.regexp.validationRFC5322.test(value);

        this.rootElement.classList.toggle(this.stateClasses.isInvalid, !isValid);
        
        isValid && this.animateMessage(value);

        event.target[0].value = '';
    }

    bindEvents() {
        this.inputElement.addEventListener('change', (event) => this.onChangeInput(event));
        this.rootElement.addEventListener('submit', (event) => this.onSubmitInput(event));
    }
}

class EmailValidationCollection {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll(rootSelector).forEach(rootElement => {
            new EmailValidation(rootElement);
        })
    }
}

export default EmailValidationCollection;