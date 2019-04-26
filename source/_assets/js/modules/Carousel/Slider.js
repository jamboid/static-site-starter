import Carousel from "Modules/Carousel/Carousel"; 

/**
 * Scroller - Description
 * @extends Carousel
 */
export default class Slider extends Carousel {
  constructor(element) {
    super(element);
  }

  advanceCarousel(index) { 
    const INDEX_OF_TARGET_SLIDE = index;
    if (this.inTransition === false) {

      this.inTransition = true;
      this.slideContainer.style.transform = "translateX(" + -100 * INDEX_OF_TARGET_SLIDE + "%)";

      if (this.flexHeight) {
        this.updateHeight($slides.eq(INDEX_OF_TARGET_SLIDE).outerHeight());
      }

      this.currentSlide = this.slides.item(INDEX_OF_TARGET_SLIDE);
      this.setIndexToValue(INDEX_OF_TARGET_SLIDE);

      window.setTimeout(() => {
        this.inTransition = false;
      }, this.transition);
    }
  }
}