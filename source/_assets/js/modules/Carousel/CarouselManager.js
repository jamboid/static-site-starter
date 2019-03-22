// Image Components module
"use strict";

/////////////
// Imports //
/////////////

import { createDelegatedEventListener } from "@wearegood/good-utilities";

import Slider from "Modules/Carousel/Slider";
import Fader from "Modules/Carousel/Fader";
import * as CONSTANTS from "Modules/Carousel/constants";

///////////////
// Constants //
///////////////

const SEL_CAROUSEL = "[data-carousel=component]";

/////////////////////////
// Classes & Functions //
/////////////////////////

/**
 *
 *  Instantiate objects to manage smart image components
 */
function initialiseCarousels() {
  const CAROUSELS = document.querySelectorAll(SEL_CAROUSEL);

  CAROUSELS.forEach(element => {
    const CAROUSEL_TYPE = JSON.parse(element.dataset.carouselConfig).mode;

    if (CAROUSEL_TYPE === "slider") {
      let slider = new Slider(element);
    } else if (CAROUSEL_TYPE === "fader") {
      let fader = new Fader(element);
    }  
  });
}

function delegateEvents() {
  createDelegatedEventListener("click", CONSTANTS.EVENT_SEL_CAROUSEL_CONTROL, "controlInteraction");
  
}

/**
 * initModule - Initialise this module and the components contained in it
 *
 * @returns {type} Description
 */
export default function initCarousels() {
  // Find and initialise Show/Hide components using the ShowHide class
  initialiseCarousels();
}
