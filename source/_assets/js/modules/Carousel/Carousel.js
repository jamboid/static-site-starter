// Base Carousel module
"use strict";


const selComponent = "[data-carousel=component]";

/**
 * Carousel - Base class for different carousel types, each of which extend this.
 */
export default class Carousel {
  constructor(element) {
    this.compDOMElement = element;
  }

  bindCustomMessageEvents() {
    this.compDOMElement.addEventListener('toggleShowHide', this.toggleControl.bind(this));
  }
}





