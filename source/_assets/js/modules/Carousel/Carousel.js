// Base Carousel module
"use strict";


import PubSub from "pubsub-js";
import Events from "Modules/Events/Events";

const selComponent = "[data-carousel=component]";

/**
 * Carousel - Base class for different carousel types, each of which extend this.
 */
class Carousel {
  constructor(element) {
    this.compDOMElement = element;
  }

  bindCustomMessageEvents() {
    this.compDOMElement.addEventListener('toggleShowHide', this.toggleControl.bind(this));
  }
}





