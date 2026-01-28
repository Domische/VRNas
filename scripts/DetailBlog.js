const rootSelector = '[data-js-detail-blog]';

class DetailBlog {

    selectors = {
        breadcrumb: '[data-js-breadcrumb]',
        currentPage: '[data-js-current-page]',
        article: '[data-js-article]',
        body: '[data-js-article-body]',
        subtitle: '[data-js-article-subtitle]',
        title: '[data-js-article-title]',
        author: '[data-js-article-author]',
        date: '[data-js-article-date]',
        mainImage: '[data-js-article-main-image]',
        paragraphsBeforeSecondaryImages: '[data-js-article-paragraphs-before-secondary-images]',
        paragraphsAfterSecondaryImages: '[data-js-article-paragraphs-after-secondary-images]',
        secondaryImages: '[data-js-article-secondary-images]',
        postTags: '[data-js-article-post-tags]',
        sidebar: '[data-js-article-sidebar]',
        loading: '[data-js-loading]',
    }

    stateClasses = {
        visuallyHidden: 'visually-hidden',
        articleParagraph: 'article__paragraph',
        articleSecondaryImage: 'article__secondary-image',
        postTagsItem: 'post-tags__item',
        loading: 'loading',
        loadingCircle: 'loading__circle',
        error: 'error',
        errorMessage: 'error__message',
        gradientText: 'gradient-text',
    }

    stateDataAttributes = {
        error: 'data-js-error',
        loading: 'data-js-loading'
    }

    queryParamsKeys = {
        id: '_id'
    }

    initialState = {
        numberOfParagraphsBeforeSecondaryImages: 5,
        id: 0
    }

    constructor() {
        this.rootElement = document.querySelector(rootSelector);
        this.breadcrumbElement = this.rootElement.querySelector(this.selectors.breadcrumb);
        this.currentPageElement = this.rootElement.querySelector(this.selectors.currentPage);
        this.articleElement = this.rootElement.querySelector(this.selectors.article);
        this.bodyElement = this.articleElement.querySelector(this.selectors.body);
        this.subtitleElement = this.bodyElement.querySelector(this.selectors.subtitle);
        this.titleElement = this.bodyElement.querySelector(this.selectors.title);
        this.authorElement = this.bodyElement.querySelector(this.selectors.author);
        this.dateElement = this.bodyElement.querySelector(this.selectors.date);
        this.mainImageElement = this.bodyElement.querySelector(this.selectors.mainImage);
        this.paragraphsBeforeSecondaryImagesElement = this.bodyElement.querySelector(this.selectors.paragraphsBeforeSecondaryImages);
        this.paragraphsAfterSecondaryImagesElement = this.bodyElement.querySelector(this.selectors.paragraphsAfterSecondaryImages);
        this.secondaryImagesElement = this.bodyElement.querySelector(this.selectors.secondaryImages);
        this.postTagsElement = this.bodyElement.querySelector(this.selectors.postTags);
        this.sidebarElement = this.articleElement.querySelector(this.selectors.sidebar);

        this.getArticle();
    }

    loading(status) {
        if (status === true) {
            const loadingElement = document.createElement('div');
            loadingElement.classList.add(this.stateClasses.loading);
            loadingElement.setAttribute(this.stateDataAttributes.loading, '');

            const loadingCircleElement = document.createElement('div');
            loadingCircleElement.classList.add(this.stateClasses.loadingCircle);

            loadingElement.append(loadingCircleElement);

            this.rootElement.prepend(loadingElement);
        } else {
            this.rootElement.querySelector(this.selectors.loading).remove();
        }
    }

    startReceivingData() {
        this.loading(true);

        const queryParams = new URLSearchParams(window.location.search);
        const id = queryParams.get(this.queryParamsKeys.id);

        this.initialState.id = id;
    }

    errorReceivingData(error) {
        this.loading(false);

        const newErrorElement = document.createElement('div');
        newErrorElement.classList.add(this.stateClasses.error);
        newErrorElement.setAttribute(this.stateDataAttributes.error, '');

        const newErrorMessageElement = document.createElement('span');
        newErrorMessageElement.classList.add(this.stateClasses.errorMessage, this.stateClasses.gradientText);
        newErrorMessageElement.textContent = error.message;

        newErrorElement.append(newErrorMessageElement);

        this.rootElement.prepend(newErrorElement);

        console.warn(error.message);
    }

    finishReceivingData() {
        this.loading(false);
        this.breadcrumbElement.classList.remove(this.stateClasses.visuallyHidden);
        this.bodyElement.classList.remove(this.stateClasses.visuallyHidden);
        this.sidebarElement.classList.remove(this.stateClasses.visuallyHidden);
    }

    async getData() {
        this.startReceivingData();

        try {
            const response = await fetch(`http://localhost:3001/articles/${this.initialState.id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Server Error')
            }

            const data = await response.json();

            if (data.length === 0) {
                throw new Error('Not Found')
            }

            return data

        } catch (error) {
            this.errorReceivingData(error);
        }
    }

    async getArticle() {

        const data = await this.getData();

        if (data) {
            this.currentPageElement.textContent = data.title;
            this.subtitleElement.textContent = data.subtitle;
            this.titleElement.textContent = data.title;
            this.authorElement.textContent = data.author;
            this.dateElement.textContent = data.date;
            this.dateElement.setAttribute('datetime', data.datetime);
            this.mainImageElement.src = data.mainImageURL;

            for (let i = 0; i < this.initialState.numberOfParagraphsBeforeSecondaryImages; i++) {
                const paragraphElement = document.createElement('p');
                paragraphElement.classList.add(this.stateClasses.articleParagraph);
                paragraphElement.textContent = data.paragraphs[i];
                this.paragraphsBeforeSecondaryImagesElement.append(paragraphElement);
            }

            data.secondaryImagesURL.forEach(item => {
                const secondaryImageElement = document.createElement('img');
                secondaryImageElement.classList.add(this.stateClasses.articleSecondaryImage)
                secondaryImageElement.src = item;
                this.secondaryImagesElement.append(secondaryImageElement);
            })

            for (let i = this.initialState.numberOfParagraphsBeforeSecondaryImages; i < data.paragraphs.length; i++) {
                const paragraphElement = document.createElement('p');
                paragraphElement.classList.add(this.stateClasses.articleParagraph);
                paragraphElement.textContent = data.paragraphs[i];
                this.paragraphsAfterSecondaryImagesElement.append(paragraphElement);
            }

            data.postTags.forEach(item => {
                const postTagElement = document.createElement('li');
                postTagElement.classList.add(this.stateClasses.postTagsItem);
                postTagElement.textContent = item;
                this.postTagsElement.append(postTagElement);
            })

            this.finishReceivingData();
        }
    }
}

export default DetailBlog;