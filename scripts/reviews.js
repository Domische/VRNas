const rootSelector = '[data-js-reviews]';

function reviews(rootElement) {
    const selectors = {
        reviewsAvatar: '[data-js-reviews-avatar]',
        reviewsInfo: '[data-js-reviews-info]',
    }

    const stateClasses = {
        isActive: 'is-active'
    }

    const reviewsInfoElements = rootElement.querySelectorAll(selectors.reviewsInfo);

    const onReviewsInfoClickOutside = () => {
        reviewsInfoElements.forEach(reviewsInfoElement => {
            reviewsInfoElement.classList.remove(stateClasses.isActive);
        })
    }

    const onReviewsAvatarClick = (reviewsInfoElement) => {
        onReviewsInfoClickOutside();

        reviewsInfoElement.classList.toggle(stateClasses.isActive);
    }

    document.addEventListener('click', (event) => {
        const reviewsAvatarElement = event.target.closest(selectors.reviewsAvatar);
        const reviewsInfoElement = event.target.closest(selectors.reviewsInfo);

        reviewsAvatarElement && onReviewsAvatarClick(reviewsInfoElement);
        !reviewsInfoElement && onReviewsInfoClickOutside();
    })
}

function reviewsCollection() {
    document.querySelectorAll(rootSelector).forEach(rootElement => {
        reviews(rootElement);
    })
}

export default reviewsCollection;