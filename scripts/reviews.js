const rootSelector = '[data-js-reviews]';

function reviews(rootElement) {
    const selectors = {
        reviewsAvatar: '[data-js-reviews-avatar]',
        reviewsItem: '[data-js-reviews-item]',
        reviewsBody: '[data-js-reviews-body]',
    }

    const stateClasses = {
        isActive: 'is-active',
        isOnTheLeftSide: 'is-on-the-left-side',
        isOnTheBottomSide: 'is-on-the-bottom-side',
    }

    const initialState = {
        activeIndex: 0
    }

    const reviewsItemElements = rootElement.querySelectorAll(selectors.reviewsItem);
    const reviewsItemElementsArray = [...reviewsItemElements];

    const onReviewsItemClickOutside = () => {
        reviewsItemElementsArray.forEach(element => {
            element.classList.remove(stateClasses.isActive);
        })
    }

    const onReviewsAvatarClick = (reviewsItemElement) => {
        reviewsItemElement.classList.toggle(stateClasses.isActive);
    }

    const onReviewsClick = (event) => {
        fixReviewsItemPosition();
        const { target } = event;
        const reviewsAvatarElement = target.closest(selectors.reviewsAvatar);
        const reviewsItemElement = target.closest(selectors.reviewsItem);
        const reviewsItemIndex = reviewsItemElementsArray.indexOf(reviewsItemElement);

        if (reviewsItemIndex !== initialState.activeIndex) {
            initialState.activeIndex = reviewsItemIndex;
            onReviewsItemClickOutside();
        }

        reviewsAvatarElement && onReviewsAvatarClick(reviewsItemElement);
    }

    const fixReviewsItemPosition = () => {
        const windowPositionX = document.documentElement.clientWidth; //clientWidth, а не window.innerWidth, потому что не нужно учитывать scrollbar

        reviewsItemElementsArray.forEach((reviewsItemElement) => {
            const reviewsBodyElement = reviewsItemElement.querySelector(selectors.reviewsBody);

            const { left, right } = reviewsItemElement.getBoundingClientRect();

            const reviewsItemElementColumnGap = +getComputedStyle(reviewsItemElement).getPropertyValue('--column-gap').replace('px', '');
            const reviewsBodyElementWidth = +getComputedStyle(reviewsItemElement).getPropertyValue('--body-width').replace('px', '');

            const isOnTheLeftSide = right + reviewsBodyElementWidth + reviewsItemElementColumnGap > windowPositionX;
            const isOnTheBottomSide = left - reviewsBodyElementWidth - reviewsItemElementColumnGap < 0 && isOnTheLeftSide;

            reviewsBodyElement.classList.toggle(stateClasses.isOnTheLeftSide, isOnTheLeftSide);
            reviewsBodyElement.classList.toggle(stateClasses.isOnTheBottomSide, isOnTheBottomSide);
        })
    }

    document.addEventListener('click', (event) => onReviewsClick(event))

    window.addEventListener('resize', fixReviewsItemPosition)
}

function reviewsCollection() {
    document.querySelectorAll(rootSelector).forEach(rootElement => {
        reviews(rootElement);
    })
}

export default reviewsCollection;