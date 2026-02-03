class FormAsyncActions {
    constructor(formData) {

        this.sendFormDataToTheServer(formData)
    }

    filterFormData(formData) {
        const filterDataMap = [...formData].filter(([key, value]) => value);
        const filterDataObject = Object.fromEntries(filterDataMap);

        return filterDataObject;
    }

    sendFormDataToTheServer(formData) {
        fetch('http://localhost:3002/formData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.filterFormData(formData))
            //так неправильно!!! А чтобы было правильно в body нужно просто formData и headers: {'Content-Type': 'multipart/form-data'}
            //но так как у меня json-server (формат данных отличается от formData) правильно не получится, только headers: {'Content-Type': 'application/json',}, body: JSON.stringify(Object.fromEntries(formData))
        })
    }
}

export default FormAsyncActions;