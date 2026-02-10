class FormAsyncActions {
    selectors = {
        errorPopup: '[data-js-error-popup]',
        errorMessage: '[data-js-error-popup-message]',
        errorButton: '[data-js-error-popup-button]',
    }

    stateСlasses = {
        isActive: 'is-active'
    }

    constructor(formData) {
        this.errorPopupElement = document.querySelector(this.selectors.errorPopup);
        this.errorMessageElement = this.errorPopupElement.querySelector(this.selectors.errorMessage);
        this.errorButtonElement = this.errorPopupElement.querySelector(this.selectors.errorButton);

        this.sendFormDataToTheServer(formData);
        this.bindEvents();
    }

    filterFormData(formData) {
        const filterDataMap = [...formData].filter(([key, value]) => value);
        const filterDataObject = Object.fromEntries(filterDataMap);

        return filterDataObject;
    }

    showErrorPopup(message) {
        const isActive = !!message;
        this.errorMessageElement.textContent = message;
        this.errorPopupElement.classList.toggle(this.stateСlasses.isActive, isActive)
    }

    async sendFormDataToTheServer(formData) {
        try {
            const response = await fetch('http://localhost:3002/formData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.filterFormData(formData))
                //так неправильно!!! А чтобы было правильно в body нужно просто formData и headers: {'Content-Type': 'multipart/form-data'}
                //но так как у меня json-server (формат данных отличается от formData) правильно не получится, только headers: {'Content-Type': 'application/json',}, body: JSON.stringify(Object.fromEntries(formData))
            })

            if(!response.ok){
                throw new Error('Server Error');
            }  
            
        } catch (error) {
            this.showErrorPopup(error.message);
        }
    }

    bindEvents() {
        this.errorButtonElement.addEventListener('click', () => this.showErrorPopup())
    }
}

export default FormAsyncActions;