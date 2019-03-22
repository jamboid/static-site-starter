// Base Carousel module

/////////////
// Imports //
/////////////

import "swiped-events";
import { messages as MESSAGES } from "@wearegood/good-utilities";
import * as CONSTANTS from "Modules/Carousel/constants";

///////////////
// Constants //
///////////////

/////////////////////////
// Classes & Functions //
/////////////////////////

/**
 *
 *
 * @export
 * @class Carousel
 */
export default class Carousel {

  /**
   *Creates an instance of Carousel.
   * @param {*} element
   * @memberof Carousel
   */
  constructor(element) {
    this.carouselElem = element;
    this.carouselID = this.carouselElem.getAttribute('id') || "unidentified";
    this.slideContainer = this.carouselElem.querySelector(CONSTANTS.SEL_CAROUSEL_SLIDE_CONTAINER);    
    this.slides = this.carouselElem.querySelectorAll(CONSTANTS.SEL_CAROUSEL_SLIDE); 
    this.numberOfSlides = this.slides.length;
    this.tabs;
    this.config = JSON.parse(this.carouselElem.dataset.carouselConfig);
    this.interval = this.config.interval || 5000;
    this.mode = this.config.mode || "slider";
    this.transition = this.config.transition || 1000;
    this.autoplay = this.config.autoplay || false;
    this.needToBuildTabs = this.config.buildTabs || false;
    this.flexibleHeight = this.config.flexHeight || true;
    this.inGroup = this.config.inGroup || false;
    this.tellCurrent = this.config.tellCurrent || false;
    this.currentSlide;
    this.nextSlide;
    this.firstSlide;
    this.lastSlide;
    this.currentHeight;
    this.cycleTimeout;
    this.slideToLoad;
    this.carouselTabs = this.carouselElem.querySelector(CONSTANTS.SEL_CAROUSEL_TABS_CONTAINER);
    this.inTransition = false;
    this.animate = true;
    this.maxScroll = this.config.maxScroll || 4;
    this.controlsActive = true;
    this.carouselWidth;
    this.slideWidth;
    this.slidesToScroll;
    this.moveWidth;

    this.subscribeToEvents();
  }

  handleToggleCycleEvent(e) {
    e.preventDefault();

    if (this.autoplay) {
      this.stopCycle();
    } else {
      this.startCycle();
    }
  }

  /**
   *
   *
   * @memberof Carousel
   */
  setCycle() {
    if (this.autoplay) {
      this.cycleTimeout = setTimeout(function () {
        advanceCarousel("n");
      }, this.interval);
    }
  }

  /**
   *
   *
   * @memberof Carousel
   */
  stopCycle() {
    this.autoplay = false;
    window.clearTimeout(cycleTimeout);
  }
  
  /**
   *
   *
   * @param {*} e
   * @memberof Carousel
   */
  handleControlInteractionEvent(e) {
    e.preventDefault();
  }

    /**
   *
   *
   * @param {*} e
   * @memberof Carousel
   */
  handleIndexInteractionEvent(e) {
    e.preventDefault();
  }

  /**
   *
   *
   * @memberof Carousel
   */
  handleLeftSwipeEvent(e) {
    e.preventDefault();
  }

  /**
   *
   *
   * @memberof Carousel
   */
  handleRightSwipeEvent(e) {
    e.preventDefault();
  }

  /**
   *
   *
   * @param {*} e
   * @memberof Carousel
   */
  handleLayoutUpdateEvent(e) {
    e.preventDefault();
    this.setLayout();
  }

  /**
   *
   *
   * @memberof Carousel
   */
  completeTransition() {
    this.inTransition = false;
    this.setCycle();
  }

  /**
   *
   *
   * @param {*} height
   * @memberof Carousel
   */
  updateHeight(height) {
    this.slideContainer.style.height = height;
  }

  /**
   *
   *
   * @memberof Carousel
   */
  setLayout() {

  }

  /**
   *
   *
   * @param {*} direction
   * @memberof Carousel
   */
  advanceCarousel(direction) {

  }

  /**
   * 
   *
   * @memberof Carousel
   */
  bindCustomMessageEvents() {
    this.carouselElem.addEventListener('toggleCycle', this.handleToggleCycleEvent.bind(this));
    this.carouselElem.addEventListener('controlInteraction', this.handleControlInteractionEvent.bind(this));
    this.carouselElem.addEventListener('indexInteraction', this.handleIndexInteractionEvent.bind(this));
    this.carouselElem.addEventListener('swiped-left', this.handleLeftSwipeEvent.bind(this));
    this.carouselElem.addEventListener('swiped-right', this.handleRightSwipeEvent.bind(this));
    this.carouselElem.addEventListener('updateLayout', this.handleLayoutUpdateEvent.bind(this));
  } 

  /**
   *
   *
   * @memberof Carousel
   */
  subscribeToEvents() {
    PubSub.subscribe(MESSAGES.resize, () => {
      this.carouselElem.dispatchEvent(createCustomEvent("updateLayout"));
    });

    PubSub.subscribe(MESSAGES.load, () => {
      this.carouselElem.dispatchEvent(createCustomEvent("updateLayout"));
    });

    PubSub.subscribe(MESSAGES.layoutChange, () => {
      this.carouselElem.dispatchEvent(createCustomEvent("updateLayout"));
    });

    PubSub.subscribe(MESSAGES.contentChange, () => {
      this.carouselElem.dispatchEvent(createCustomEvent("updateLayout"));
    });
  }
}





