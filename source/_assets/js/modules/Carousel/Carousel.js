// Base Carousel module

/////////////
// Imports //
/////////////

import "swiped-events";
import { createNodeFromHTML, createCustomEvent, messages as MESSAGES } from "@wearegood/good-utilities";
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
    this.slidesHolder = this.carouselElem.querySelector(CONSTANTS.SEL_CAROUSEL_SLIDES_HOLDER);    
    this.slideContainer = this.carouselElem.querySelector(CONSTANTS.SEL_CAROUSEL_SLIDE_CONTAINER);    
    this.slides = this.carouselElem.querySelectorAll(CONSTANTS.SEL_CAROUSEL_SLIDE); 
    this.numberOfSlides = this.slides.length;
    this.carouselIndex = this.carouselElem.querySelector(CONSTANTS.SEL_CAROUSEL_INDEX); 
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
    this.currentSlide = this.slides.item(0);
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
    this.bindCustomMessageEvents(); 

    this.buildIndex();
    this.slideContainer.style.transitionDuration = this.transition + 'ms';
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
   * @memberof Carousel
   */
  buildIndex() {
    if(this.carouselIndex) {
      console.log('build index...');

      this.slides.forEach((currentValue, currentIndex, listObj) => {
        const INDEX_ITEM_TEMPLATE = `<a href="#" data-carousel="indexItem" data-index="${currentIndex}">${currentIndex}</a>`;
        const INDEX_ITEM_HTML = createNodeFromHTML(INDEX_ITEM_TEMPLATE).item(0);
        this.carouselIndex.appendChild(INDEX_ITEM_HTML);  
      }); 
    }
  }

  /**
   *
   *
   * @memberof Carousel
   */
  setIndexToValue() {
    
  }

  /**
   *
   *
   * @param {*} direction
   * @returns
   * @memberof Carousel
   */
  getIndexOfTargetSlide(direction) {
    const THIS_DIRECTION = direction;
    let currentPos = Array.prototype.indexOf.call(this.slides, this.currentSlide);
    let targetIndex;

    // Set next slide based on direction
    if (THIS_DIRECTION === "n") {
      if (currentPos + 1 < this.numberOfSlides) {
        targetIndex = currentPos + 1;
      } else {
        targetIndex = 0;
      }
    } else if (THIS_DIRECTION === "p") {
      if (currentPos > 0) {
        targetIndex = currentPos - 1;
      } else {
        targetIndex = this.slides.length -1;
      }
    }

    return targetIndex;
  }

  /**
   *
   *
   * @param {*} e
   * @memberof Carousel
   */
  handleControlInteractionEvent(e) {
    e.preventDefault();    
    const TARGET_INDEX = this.getIndexOfTargetSlide(e.target.dataset.action);
    this.advanceCarousel(TARGET_INDEX);
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





