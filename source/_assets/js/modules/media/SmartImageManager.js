// Image Components module
"use strict";

////////////////////
// Module Imports //
//////////////////// 

import "intersection-observer";

import { createDelegatedEventListener as delegate } from "Modules/events/createDelegatedEventListener";
import { SmartImage } from "Modules/media/SmartImage";

//////////////////////
// Module Constants //
//////////////////////

// Selectors
const SEL_SMART_IMAGE = "[data-image-load]";
const SEL_CLICK_TO_LOAD_SMART_IMAGE = "[data-image-load=click] img.placeholder";

// Image Observer
const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: "0px",
  threshold: 0
};

let imageObserver;

////////////////////////////////
// Module Classes & Functions //
////////////////////////////////

/**
 * delegateEvents - Create delegated event listeners for the components managed within this module
 *
 * @returns {type} Description
 */
function delegateEvents() {
  delegate("click", SEL_CLICK_TO_LOAD_SMART_IMAGE, "siClickLoad");
}

/**
 *
 *  Instantiate objects to manage smart image components
 */
function initialiseSmartImages() {
  const SMART_IMAGES = document.querySelectorAll(SEL_SMART_IMAGE);

  SMART_IMAGES.forEach(element => {
    let smartImage = new SmartImage(element, imageObserver);
  });
}

/**
 * Handle observed intersections for smart image components
 *
 * @param {*} entries
 * @param {*} observer
 */
function handleSmartImageIntersection(entries, observer) {
  entries.forEach(function (entry) {
    if (entry.intersectionRatio > 0) {
      entry.target.dispatchEvent(Events.createCustomEvent("imageInView"));
    }
  });
}

/**
 * Instantiate an IntersectionObserver object for the smart image components
 *
 */
function initialiseSmartImageObserver() {
  if (typeof (window.IntersectionObserver) !== 'undefined') {
    imageObserver = new IntersectionObserver(handleSmartImageIntersection, OBSERVER_OPTIONS);
  }
}

/**
 * initModule - Initialise this module and the components contained in it
 *
 * @returns {type} Description
 */
export function initModule() {
  // Create delegated event listeners for the components within this module
  delegateEvents();

  // Initialise an observer object to detect when smart image elements are in view
  initialiseSmartImageObserver();

  // Find and initialise Show/Hide components using the ShowHide class
  initialiseSmartImages();

}

export default { initModule: initModule };
