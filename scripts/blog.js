const rootSelector = '[data-js-blog]';

function blog() {
    const rootElement = document.querySelector(rootSelector);

    const selectors = {
        list: '[data-js-list]',
        error: '[data-js-error]',
        blogBody: '[data-js-blog-body]',
        paginationLink: '[data-js-pagination-link]',
    }

    const queryParamsKeys = {
        page: '_page',
        limit: '_limit',
        id: '_id',
    }

    const stateDataAttributes = {
        error: 'data-js-error',
        item: 'data-js-item'
    }

    const stateClasses = {
        isActive: 'is-active',
        error: 'error',
        errorMessage: 'error__message',
        gradientText: 'gradient-text',
        blogItem: 'blog__item',
        blogArticle: 'blog__article',
        blogImage: 'blog__image',
        blogInfo: 'blog__info',
        blogSubtitle: 'blog__subtitle',
        tile: 'tile',
        blogTitle: 'blog__title',
        blogLink: 'blog__link',
        skeleton: 'skeleton'
    }

    const initialState = {
        limit: 9,
        page: 1
    }

    const listElement = rootElement.querySelector(selectors.list);
    const blogBodyElement = rootElement.querySelector(selectors.blogBody);
    const paginationLinkElements = rootElement.querySelectorAll(selectors.paginationLink);

    const skeleton = (status) => {
        if (status === true) {
            const skeletonArray = Array.from({ length: initialState.limit });

            const skeletonElements = skeletonArray.map(() => {
                const skeletonElement = document.createElement('li');
                skeletonElement.classList.add(stateClasses.skeleton);
                skeletonElement.classList.add(stateClasses.blogItem);
                return skeletonElement;
            });

            listElement.append(...skeletonElements);
        } else {
            listElement.innerHTML = '';
        }
    }

    const getPageNumberFromQueryParams = () => {
        const queryParams = new URLSearchParams(window.location.search);
        const page = queryParams.get(queryParamsKeys.page);

        if (page) {
            initialState.page = page;
        } else {
            window.history.replaceState(
                {},
                '',
                `?${queryParamsKeys.page}=${initialState.page}`
            )
        }
    }

    const togglePaginationLink = () => {
        const lastPaginationLinkElement = [...paginationLinkElements].find(paginationLinkElement => paginationLinkElement.classList.contains(stateClasses.isActive));
        const newActiveIndexPaginationLinkElement = initialState.page - 1;
        const newPaginationLinkElement = paginationLinkElements[newActiveIndexPaginationLinkElement];

        lastPaginationLinkElement.classList.remove(stateClasses.isActive);
        newPaginationLinkElement.classList.add(stateClasses.isActive);
    }

    const startReceivingData = () => {
        const errorElement = rootElement.querySelector(selectors.error);
        errorElement?.remove();

        listElement.innerHTML = '';

        skeleton(true);

        getPageNumberFromQueryParams();

        togglePaginationLink();
    }

    const errorReceivingData = (error) => {
        skeleton(false);

        const newErrorElement = document.createElement('div');
        newErrorElement.classList.add(stateClasses.error);
        newErrorElement.setAttribute(stateDataAttributes.error, '');

        const newErrorMessageElement = document.createElement('span');
        newErrorMessageElement.classList.add(stateClasses.errorMessage, stateClasses.gradientText)
        newErrorMessageElement.textContent = error.message;

        newErrorElement.append(newErrorMessageElement);

        blogBodyElement.append(newErrorElement);

        console.warn(error);
    }

    const getData = async () => {
        startReceivingData();

        const url = `http://localhost:3001/articles?${queryParamsKeys.page}=${initialState.page}&${queryParamsKeys.limit}=${initialState.limit}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Server Error');
            }

            const data = await response.json();

            if (data.length === 0) {
                throw new Error('Not Found');
            }

            return data;

        } catch (error) {
            errorReceivingData(error);
        }
    }

    const getArticles = async () => {

        const data = await getData();

        if (data) {
            skeleton(false);

            const dataElements = data.map(item => {
                const liElement = document.createElement('li');
                liElement.classList.add(stateClasses.blogItem);
                liElement.setAttribute(stateDataAttributes.item, '');

                const articleElement = document.createElement('article');
                articleElement.classList.add(stateClasses.blogArticle);
                liElement.append(articleElement);

                const imgElement = document.createElement('img');
                imgElement.classList.add(stateClasses.blogImage);
                imgElement.src = item.mainImageURL;
                imgElement.alt = item.title;
                articleElement.append(imgElement);

                const divElement = document.createElement('div');
                divElement.classList.add(stateClasses.blogInfo);
                articleElement.append(divElement);

                const pElement = document.createElement('p');
                pElement.classList.add(stateClasses.blogSubtitle, stateClasses.tile);
                pElement.textContent = item.subtitle;
                divElement.append(pElement);

                const h3Element = document.createElement('h3');
                h3Element.classList.add(stateClasses.blogTitle);
                h3Element.textContent = item.title;
                divElement.append(h3Element);

                const aElement = document.createElement('a');
                aElement.classList.add(stateClasses.blogLink);
                aElement.href = `detail-blog.html?${queryParamsKeys.id}=${item.id}`;
                divElement.append(aElement);

                const spanElement = document.createElement('span');
                spanElement.classList.add(stateClasses.gradientText);
                spanElement.textContent = 'READ MORE';
                aElement.append(spanElement);

                return liElement;
            });

            listElement.append(...dataElements);


            //сделать безопаснее от xss-атак!!!
            // const dataElements = data.map(item => {
            //     item.subtitle = `<img src='xss' onerror="document.querySelector('body').style.background='red'"/>`;//сработает, но может быть вредоносный скрипт!!!
            //     return `<li class="blog__item" data-js-item>
            //                 <article class="blog__article">
            //                     <img src="${item.mainImageURL}" alt="" class="blog__image">
            //                     <div class="blog__info">
            //                         <p class="blog__subtitle tile">${item.subtitle}</p>
            //                         <h3 class="blog__title">${item.title}</h3>
            //                         <a href="" class="blog__link"><span class="gradient-text">READ MORE</span></a>
            //                     </div>
            //                 </article>
            //             </li>`;
            // }).join('');

            // listElement.insertAdjacentHTML('beforeEnd', dataElements);
        }
    }

    getArticles();

    const onClickPaginationLinkElement = (event) => {
        event.preventDefault();

        const paginationLinkElement = event.target;
        const newPageNumber = [...paginationLinkElements].indexOf(paginationLinkElement) + 1;

        initialState.page = newPageNumber;

        window.history.pushState(
            { page: initialState.page },
            '',
            `?${queryParamsKeys.page}=${initialState.page}`
        )

        getArticles();
    }

    paginationLinkElements.forEach((paginationLinkElement, paginationLinkIndex) => {
        const pageNumber = paginationLinkIndex + 1;

        paginationLinkElement.href = window.location.pathname.concat(`?${queryParamsKeys.page}=${pageNumber}`);

        paginationLinkElement.addEventListener('click', (event) => onClickPaginationLinkElement(event))
    })

    window.addEventListener('popstate', () => getArticles());
}

export default blog;