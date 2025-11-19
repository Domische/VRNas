const rootSelector = '[data-js-video-player]';

class VideoPlayer {
    selectors = {
        video: '[data-js-video-player-video]',
        button: '[data-js-video-player-button]',
        info: '[data-js-video-player-info]',
        timelineLine: '[data-js-timeline-line]',
        timelineButton: '[data-js-timeline-button]',
        timelineButtonVerticalLine: 'timeline__button-vertical-line',
    }

    stateClasses = {
        isActive: 'is-active'
    }

    stateProperty = {
        progressWidth: '--progress-width',
        transition: '--transition'
    }

    initialState = {
        isPlay: false
    }

    constructor(rootElement) {
        this.rootElement = rootElement;
        this.videoElement = this.rootElement.querySelector(this.selectors.video);
        this.infoElement = this.rootElement.querySelector(this.selectors.info);
        this.buttonElement = this.rootElement.querySelector(this.selectors.button);
        this.timelineLineElement = this.rootElement.querySelector(this.selectors.timelineLine);
        this.timelineButtonElement = this.rootElement.querySelector(this.selectors.timelineButton);

        this.bindEvents();
    }

    customControls = (event) => {
        event.preventDefault();
        
        this.initialState.isPlay = !this.initialState.isPlay;

        this.initialState.isPlay ? this.videoElement.play() : this.videoElement.pause();

        this.buttonElement.classList.toggle(this.stateClasses.isActive, this.initialState.isPlay);
        this.infoElement?.classList.toggle(this.stateClasses.isActive, this.initialState.isPlay);
        
        //смена кнопки play на кнопку pause и наоборот
        if (this.timelineLineElement && this.initialState.isPlay) {

            this.timelineButtonElement.innerHTML = '';

            for (let i = 0; i < 2; i++) {
                const buttonUI = document.createElement('span');
                buttonUI.classList.add(this.selectors.timelineButtonVerticalLine);
                this.timelineButtonElement.append(buttonUI);
            }

            this.videoElement.addEventListener('timeupdate', (event) => {
                this.timelineLineElement.style.setProperty(this.stateProperty.progressWidth, `${100 * event.target.currentTime / this.videoElement.duration}%`)
            })

        } else if (this.timelineLineElement && !this.initialState.isPlay) {
            this.timelineButtonElement.innerHTML =
                `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.19995 2.86327C2.19995 1.61155 3.57248 0.844595 4.63851 1.50061L12.9856 6.63731C14.0009 7.26209 14.0009 8.73784 12.9856 9.36262L4.63851 14.4993C3.57247 15.1553 2.19995 14.3884 2.19995 13.1367V2.86327Z" fill="white" />
            </svg>`;
        }
    }

    onTimelineLineClick = (event) => {
        const clickPositionPercentX = (event.clientX - this.timelineLineElement.getBoundingClientRect().x) * 100 / this.timelineLineElement.offsetWidth;
        const newCurrentTime = clickPositionPercentX * this.videoElement.duration / 100;

        this.timelineLineElement.style.setProperty(this.stateProperty.transition, 'width .1s ease-out');

        setTimeout(() => {
            this.timelineLineElement.style.setProperty(this.stateProperty.transition, 'width .5s ease-out');
        }, 100);

        this.timelineLineElement.style.setProperty(this.stateProperty.progressWidth, `${clickPositionPercentX}%`);

        this.videoElement.currentTime = newCurrentTime;
    }

    bindEvents() {
        this.buttonElement.addEventListener('click', (event)=>this.customControls(event));
        this.timelineButtonElement?.addEventListener('click', (event)=>this.customControls(event));
        this.videoElement.addEventListener('click', (event)=>this.customControls(event));
        this.videoElement.addEventListener('ended', (event)=>this.customControls(event));
        this.timelineLineElement?.addEventListener('click', this.onTimelineLineClick);
    }
}

class VideoPlayerCollection {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll(rootSelector).forEach(rootElement => {
            new VideoPlayer(rootElement);
        })
    }
}

export default VideoPlayerCollection;