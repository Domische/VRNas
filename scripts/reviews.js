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
        isOnTheTopSide: 'is-on-the-top-side',
    }

    const stateProperty = {
        columnGap: '--column-gap',
        bodyWidth: '--body-width'
    }

    const initialState = {
        activeIndex: 0
    }

    const reviewsItemElements = rootElement.querySelectorAll(selectors.reviewsItem);
    const reviewsItemElementsArray = [...reviewsItemElements];

    const onReviewsItemClickOutside = () => {
        reviewsItemElementsArray[initialState.activeIndex].classList.remove(stateClasses.isActive);
    }

    const onReviewsAvatarClick = (reviewsItemElement) => {
        reviewsItemElement.classList.toggle(stateClasses.isActive);
    }

    const onReviewsClick = (event) => {
        fixReviewsItemPosition();
        const { target } = event;
        const reviewsBodyElement = target.closest(selectors.reviewsBody);
        const reviewsAvatarElement = target.closest(selectors.reviewsAvatar);
        const reviewsItemElement = target.closest(selectors.reviewsItem);        
        const reviewsItemIndex = reviewsItemElementsArray.indexOf(reviewsItemElement);        
        const isNewActiveIndex = reviewsItemIndex !== initialState.activeIndex;

        isNewActiveIndex && onReviewsItemClickOutside();
        !reviewsBodyElement && !reviewsAvatarElement && onReviewsItemClickOutside();
        reviewsItemElement && (initialState.activeIndex = reviewsItemIndex);        
        reviewsAvatarElement && onReviewsAvatarClick(reviewsItemElement);
    }

    const fixReviewsItemPosition = () => {
        const windowPositionX = document.documentElement.clientWidth; //clientWidth, а не window.innerWidth, потому что не нужно учитывать длину scrollbar

        reviewsItemElementsArray.forEach((reviewsItemElement) => {
            const reviewsBodyElement = reviewsItemElement.querySelector(selectors.reviewsBody);
            const reviewsAvatarElement = reviewsItemElement.querySelector(selectors.reviewsAvatar);

            const { left, right } = reviewsItemElement.getBoundingClientRect();
            const reviewsAvatarPosition = reviewsAvatarElement.getBoundingClientRect();

            // console.log(reviewsBodyElement, reviewsBodyElement.getBoundingClientRect().right);

            const isOnTheLeftSide = right>=windowPositionX;
            const isOnTheTopSide = isOnTheLeftSide && left - reviewsBodyElement.clientWidth <= 0;
            
            reviewsBodyElement.classList.toggle(stateClasses.isOnTheLeftSide, isOnTheLeftSide);
            reviewsBodyElement.classList.toggle(stateClasses.isOnTheTopSide, isOnTheTopSide);

            // const reviewsAvatarIsOnTheLeftSide = document.documentElement.clientWidth / 2 > (reviewsAvatarPosition.left + reviewsAvatarElement.clientWidth / 2);
            // const reviewsAvatarIsOnTheRightSide = document.documentElement.clientWidth / 2 < (reviewsAvatarPosition.left + reviewsAvatarElement.clientWidth / 2);
            
            // console.log(reviewsAvatarElement, 'left '+reviewsAvatarIsOnTheLeftSide);
            // console.log(reviewsAvatarElement, 'right '+reviewsAvatarIsOnTheRightSide);

            

            // isOnTheTopSide && reviewsAvatarIsOnTheLeftSide && (reviewsBodyElement.style.translate = `${0}px -123px`);

            // isOnTheTopSide && reviewsAvatarIsOnTheRightSide && (reviewsBodyElement.style.translate = `${0}px -123px`)
            
            
            //я сейчас на вестке fix-reviews-layout для исправления замедления анимации из-за нагрузки на layout
            

            // const reviewsItemElementColumnGap = +getComputedStyle(reviewsItemElement).getPropertyValue(stateProperty.columnGap).replace('px', '');
            // const reviewsBodyElementWidth = +getComputedStyle(reviewsItemElement).getPropertyValue(stateProperty.bodyWidth).replace('px', '');

            // const toTheLeftSide = right + reviewsBodyElementWidth + reviewsItemElementColumnGap > windowPositionX;
            // const toTheBottomSide = left - reviewsBodyElementWidth - reviewsItemElementColumnGap < 0 && toTheLeftSide;

            // reviewsBodyElement.classList.toggle(stateClasses.isOnTheLeftSide, toTheLeftSide);
            // reviewsBodyElement.classList.toggle(stateClasses.isOnTheBottomSide, toTheBottomSide);
        })
    }


    rootElement.addEventListener('pointerup', (event) => onReviewsClick(event));

    window.addEventListener('resize', fixReviewsItemPosition)
}

function reviewsCollection() {
    document.querySelectorAll(rootSelector).forEach(rootElement => {
        reviews(rootElement);
    })
}

export default reviewsCollection;