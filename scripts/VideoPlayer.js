const rootSelector = '[data-js-video-player]';

class VideoPlayer {
    selectors = {
        video: '[data-js-video-player-video]',
        button: '[data-js-video-player-button]'
    }

    stateClasses = {
        isActive: 'is-active'
    }

    constructor(rootElement){
        this.rootElement = rootElement;
        this.videoElement = this.rootElement.querySelector(this.selectors.video);
        this.buttonElement = this.rootElement.querySelector(this.selectors.button);
        
        this.bindEvents();
    }

    videoPause = ()=> {
        this.buttonElement.classList.remove(this.stateClasses.isActive);
    }

    onButtonClick = ()=> {
        this.videoElement.play();
        this.buttonElement.classList.add(this.stateClasses.isActive);
    }

    onVideoClick = ()=> {
        this.videoElement.pause();
        this.videoPause();
    }

    bindEvents(){
        this.buttonElement.addEventListener('click', this.onButtonClick);
        this.videoElement.addEventListener('click', this.onVideoClick);
        this.videoElement.addEventListener('ended', this.videoPause)
    }
}

class VideoPlayerCollection {
    constructor(){
        this.init();
    }

    init(){
        document.querySelectorAll(rootSelector).forEach(rootElement=> {
            new VideoPlayer(rootElement);
        })
    }
}

export default VideoPlayerCollection;