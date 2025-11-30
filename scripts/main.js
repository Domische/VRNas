// import burgerButton from "./menuBurgerButton.js";
// import scrollPage from "./scrollPage.js";
// import SubMenuButtonCollection from "./SubmenuButton.js";
// import VideoPlayerCollection from "./VideoPlayer.js";
// import reviewsCollection from "./reviews.js";
// import ScrollbarCollection from "./Scrollbar.js";
// import sliderCollection from "./slider.js";
// import EmailValidationCollection from "./EmailValidation.js";

// //Со строчной буквы - функциональный подход, с заглавной - классовый подход;

// burgerButton();
// scrollPage();
// new SubMenuButtonCollection();
// new VideoPlayerCollection();
// reviewsCollection();
// new ScrollbarCollection();
// sliderCollection();
// new EmailValidationCollection();

//доделать оптимизацию и только после нее делать другие страницы сайта

// const {effectiveType} = navigator.connection;
// console.log(effectiveType); 

// navigator.connection.addEventListener('change', ()=> {
//     console.log(navigator.connection.effectiveType);
// })

document.addEventListener('DOMContentLoaded', async () => {

    const observerImage = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry=> {
                if(entry.isIntersecting){
                    entry.target.setAttribute('src', entry.target.dataset.src);
                    entry.target.removeAttribute('data-src');
                    observer.unobserve(entry.target);
                }
            })
        },
        {
            rootMargin: '0px 0px 300px 0px'
        }
    )

    document.querySelectorAll('img[data-src]').forEach(image=> {
        observerImage.observe(image);
    });


    const selectorsObserver = {
        headerBurgerButton: 'data-js-header-burger-button',
        reviews: 'data-js-reviews',
        slider: 'data-js-slider',
        scrollbar: 'data-js-scrollbar',
        emailForm: 'data-js-email-form',
        accordion: 'data-js-accordion-group',
        service: 'data-js-service-list'
    }
    
    const VideoPlayerCollection = await import('./VideoPlayer.js');
    const scrollPage = await import('./scrollPage.js');
    const SubMenuButtonCollection = await import('./SubmenuButton.js');

    new VideoPlayerCollection.default();
    scrollPage.default();
    new SubMenuButtonCollection.default();

    const observerJs = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    JsLoad(entry.target);
                    observer.unobserve(entry.target);
                }
            })
        },
        {}
    )

    

    for (const key in selectorsObserver) {
        observerJs.observe(document.querySelector(`[${selectorsObserver[key]}]`));
    }

    async function JsLoad(element) {

        if (element.getAttributeNames().includes(selectorsObserver.headerBurgerButton)) {
            const burgerButton = await import('./menuBurgerButton.js');
            burgerButton.default();
        }

        if (element.getAttributeNames().includes(selectorsObserver.reviews)) {
            const reviewsCollection = await import('./reviews.js');
            reviewsCollection.default();
        }

        if (element.getAttributeNames().includes(selectorsObserver.slider)) {
            const sliderCollection = await import('./slider.js');
            sliderCollection.default();
        }

        if (element.getAttributeNames().includes(selectorsObserver.scrollbar)) {
            const ScrollbarCollection = await import('./Scrollbar.js');
            new ScrollbarCollection.default();
        }

        if (element.getAttributeNames().includes(selectorsObserver.emailForm)) {
            const EmailValidationCollection = await import('./EmailValidation.js');
            new EmailValidationCollection.default();
        }

        if (element.getAttributeNames().includes(selectorsObserver.accordion)) {
            const accordionCollection = await import('./accordion.js');
            accordionCollection.default();
        }

        if (element.getAttributeNames().includes(selectorsObserver.service)) {
            const serviceCollection = await import('./service.js');
            serviceCollection.default();
        }

    }



    // const burgerButton = await import('./menuBurgerButton.js');
    // const scrollPage = await import('./scrollPage.js');
    // const SubMenuButtonCollection = await import('./SubmenuButton.js');
    // const VideoPlayerCollection = await import('./VideoPlayer.js');
    // const reviewsCollection = await import('./reviews.js');
    // const ScrollbarCollection = await import('./Scrollbar.js');
    // const sliderCollection = await import('./slider.js');
    // const EmailValidationCollection = await import('./EmailValidation.js');

    // burgerButton.default();
    // scrollPage.default();
    // new SubMenuButtonCollection.default();
    // new VideoPlayerCollection.default();
    // reviewsCollection.default();
    // new ScrollbarCollection.default();
    // sliderCollection.default();
    // new EmailValidationCollection.default();
});