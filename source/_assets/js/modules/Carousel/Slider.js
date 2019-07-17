import Carousel from "Modules/Carousel/Carousel";
import * as CONSTANTS from "Modules/Carousel/constants";

/**
 * Scroller - Description
 * @extends Carousel
 */
export default class Slider extends Carousel {
  /**
   *Creates an instance of Slider.
   * @param {*} element
   * @memberof Slider
   */
  constructor(element) {
    super(element);

    this.carouselScrollbar = this.carouselElem.querySelector(CONSTANTS.SEL_CAROUSEL_SCROLLBAR);

    if(this.carouselScrollbar) {
      this.setScrollbar(0);
    }
  }

  /**
   *
   *
   * @param {*} index
   * @memberof Slider
   */
  advanceCarousel(index) {
    this.setLayout();

    const INDEX_OF_TARGET_SLIDE = index;
    if (this.inTransition === false) {

      this.inTransition = true;
      this.slideContainer.style.transform = "translateX(" + (-100 * (this.slideWidth / this.slidesContainerWidth)) * INDEX_OF_TARGET_SLIDE + "%)";

      if (this.flexHeight) {
        this.updateHeight($slides.eq(INDEX_OF_TARGET_SLIDE).outerHeight());
      }

      this.currentSlide = this.slides.item(INDEX_OF_TARGET_SLIDE);
      this.setIndexToValue(INDEX_OF_TARGET_SLIDE);

      //console.log(this.carouselScrollbar);

      // Set scrollbar layout
      if(this.carouselScrollbar) {
        this.setScrollbar(INDEX_OF_TARGET_SLIDE);
      }

      window.setTimeout(() => {
        this.inTransition = false;
      }, this.transition);
    }
  }

  /**
   *
   *
   * @memberof Slider
   */
  setScrollbar(index) {
    const SCROLL_SEGMENTS = Math.ceil(this.numberOfSlides / (this.slidesContainerWidth / this.slideWidth));
    const BASE_BAR_UNIT = Math.round((100 / this.numberOfSlides) * 1000) / 1000;

    // set left padding
    const LEFT_PADDING = index * BASE_BAR_UNIT;
    this.carouselScrollbar.style.paddingLeft = LEFT_PADDING + '%';
    // set right padding
    var RIGHT_PADDING = (this.numberOfSlides - (Math.round(this.slidesContainerWidth / this.slideWidth) + index)) * BASE_BAR_UNIT;
    this.carouselScrollbar.style.paddingRight = RIGHT_PADDING + '%';
  }
}
