import FormAsyncActions from "./FormAsyncActions.js";

const rootSelector = '[data-js-form]';

function formValidation(rootElement) {
    const selectors = {
        errors: '[data-js-form-errors]'
    }

    const stateClasses = {
        isActive: 'is-active'
    }

    const errorMessages = {
        valueMissing: () => 'Заполните это поле.',
        patternMismatch: ({ title }) => title || 'Не соответствует формату.',
        tooShort: ({ minLength }) => `Слишком короткое значение. Минимум символов - ${minLength}.`,
        tooLong: ({ maxLength }) => `Слишком длинное значение. Ограничение символов - ${maxLength}.`
    }

    const manageErrors = (controlElement, errorMessagesArray, isValid) => {
        const parentFormErrorsElement = controlElement.parentElement.parentElement;
        const formErrorsElement = parentFormErrorsElement.querySelector(selectors.errors);

        formErrorsElement.textContent = errorMessagesArray.join(' ');
        formErrorsElement.classList.toggle(stateClasses.isActive, !isValid);
    }

    const validateControl = (controlElement) => {
        const errors = controlElement.validity;

        const errorMessagesArray = [];

        Object.entries(errorMessages).forEach(([errorType, getErrorMessage]) => {
            errors[errorType] && errorMessagesArray.push(getErrorMessage(controlElement));
        })

        const isValid = errorMessagesArray.length === 0;

        manageErrors(controlElement, errorMessagesArray, isValid);

        controlElement.ariaInvalid = !isValid;

        return isValid;
    }


    const onBlur = (event) => {
        const { target } = event;
        const isRequired = target.required;

        if (isRequired) {
            validateControl(target);
        }
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const requiredControlElements = [...rootElement.elements].filter(element => element.required);

        let firstInvalidControlElement = null;

        requiredControlElements.forEach(requiredControlElement => {
            const isValid = validateControl(requiredControlElement);

            if (!isValid && !firstInvalidControlElement) {
                firstInvalidControlElement = requiredControlElement;
            }
        });

        if (firstInvalidControlElement) {
            // event.preventDefault();//!!!возможно убрать отсюда и добавить на каждое событие submit, так как будут ajax запросы без перезагрузки страницы
            firstInvalidControlElement.focus();
        } else {
            const formData = new FormData(rootElement);
            new FormAsyncActions(formData);
        }

    }

    rootElement.addEventListener('blur', (event) => {
        onBlur(event);
    }, { capture: true })

    rootElement.addEventListener('submit', (event) => {
        onSubmit(event);
    })
}

function formValidationCollection() {
    document.querySelectorAll(rootSelector).forEach(rootElement => {
        formValidation(rootElement);
    })
}

export default formValidationCollection;