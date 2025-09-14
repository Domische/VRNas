const selectors = {
    header: '[data-js-header]'
}

const stateClasses = {
    isScroll: 'is-scroll'
}

const headerElement = document.querySelector(selectors.header);

const scrollPage = ()=> {
    const changeBackground = window.scrollY >= headerElement.getBoundingClientRect().bottom / 3;
    
    headerElement.classList.toggle(stateClasses.isScroll, changeBackground);
}

window.addEventListener('scroll', scrollPage);

export default scrollPage;