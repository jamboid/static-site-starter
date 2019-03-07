// Video JS Module

/////////////
// Imports //
/////////////

import PubSub from "pubsub-js";

import createDelegate from "Modules/Events/createDelegatedEventListener";
//import createGlobal from "Modules/Events/createGlobalMessenger";
import InlineVideo from "Modules/InlineVideo/InlineVideo";

///////////////
// Constants //
///////////////

const SEL_INLINE_VIDEO = "[data-inline-video=container]";

const SEL_INLINE_VIDEO_TOGGLE = "[data-inline-video=toggle]";

const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: "0px",
  threshold: 0
};

let videoObserver; 

/////////////////////////
// Classes & Functions //
/////////////////////////
  

/**
 * delegateEvents - Create delegated event listeners for the components managed within this module
 *
 * @returns {type} Description
 */
function delegateEvents() {
  createDelegate("click", SEL_INLINE_VIDEO_TOGGLE, "playbackToggled");
}

/**
 *
 *
 */
function initialiseVideoPlayers() {
  const inlineVideos = document.querySelectorAll(SEL_INLINE_VIDEO);
  inlineVideos.forEach(element => {
    const newInlineVideo = new InlineVideo(element);
  });
}

/**
 *
 *
 * @param {*} entries
 * @param {*} observer
 */
function handleIntersection(entries, observer) {
  entries.forEach(function (entry) {
    if (entry.intersectionRatio > 0) {
      entry.target.dispatchEvent(Events.createCustomEvent("videoObservedInView"));
    }
  });
}

/**
 *
 *
 */
function initialiseVideoObserver() {
  if (typeof (window.IntersectionObserver) !== 'undefined') {
    videoObserver = new IntersectionObserver(handleIntersection, OBSERVER_OPTIONS);
  }
}


/**
 * initModule - Initialise this module and the components contained in it
 *
 * @returns {type} Description
 */
export default function initialiseInlineVideos() {
  // Create delegated event listeners for the components within this module
  delegateEvents();

  // Initialise an observer object to detect when smart image elements are in view
  initialiseVideoObserver();

  // Find and initialise Show/Hide components using the ShowHide class
  initialiseVideoPlayers();
}