// Video JS Module

////////////////////
// Module Imports //
////////////////////

import PubSub from "pubsub-js";

import Events from "Modules/Events";
import { isElementInView as inView } from "Modules/Utils";

//////////////////////
// Module Constants //
//////////////////////

const SEL_INLINE_VIDEO = "[data-inline-video=container]";
const SEL_INLINE_VIDEO_PLAYER = "[data-inline-video=player]";
const SEL_INLINE_VIDEO_TOGGLE = "[data-inline-video=toggle]";

const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: "0px",
  threshold: 0
};

let videoObserver; 

////////////////////////////////
// Module Classes & Functions //
////////////////////////////////

/**
 *
 *
 * @class InlineVideo
 */
class InlineVideo {
  /**
   *Creates an instance of InlineVideo.
   * @param {node} element
   * @memberof InlineVideo
   */
  constructor(element) {
    this.videoContainer = element;
    this.videoPlayer = this.videoContainer.querySelector(SEL_INLINE_VIDEO_PLAYER);
    this.videoSource = this.videoPlayer.querySelector('source');
    this.videoURL = this.videoSource.dataset.src;

    this.isLoaded = false;
    this.isPlaying = false;
    this.isReached = false;
    this.isLoaded = false;
    this.userPause = false;

    if (typeof (window.IntersectionObserver) !== 'undefined') {
      videoObserver.observe(this.videoContainer);
    }

    // Call initial methods
    this.bindCustomMessageEvents();
    this.subscribeToEvents();

    //this.loadVideo();
  }

  /**
   *
   *
   * @memberof InlineVideo
   */
  loadVideo (e) {
    e.preventDefault();

    if(!this.isLoaded){
      this.videoPlayer.setAttribute("src", this.videoURL);
      this.videoPlayer.load();
      this.isLoaded = true;
    }
  }

  /**
   *
   *
   * @memberof InlineVideo
   */
  playVideo(e) {
    e.preventDefault();

    this.isPlaying = true;
    this.videoContainer.classList.add('is_Playing');
  }

  /**
   *
   *
   * @memberof InlineVideo
   */
  pauseVideo(e) {
    e.preventDefault();

    this.isPlaying = false;
    this.videoContainer.classList.remove("is_Playing");
  }

  /**
   *
   *
   * @memberof InlineVideo
   */
  togglePlayback(e) { 
    e.preventDefault();

    if(this.isPlaying) {
      this.videoPlayer.pause();
    } else {
      this.videoPlayer.play();
    }
  } 

  /**
   * bindCustomMessageEvents - Binds custom event listeners to the Smart Image DOM Element
   *
   */
  bindCustomMessageEvents() {
    // EventListener for custom event from Video IntersectionObserver
    this.videoContainer.addEventListener("videoInView", this.loadVideo.bind(this));
    this.videoContainer.addEventListener("loadVideo", this.loadVideo.bind(this));

    this.videoPlayer.addEventListener("play", this.playVideo.bind(this));
    this.videoPlayer.addEventListener("pause", this.pauseVideo.bind(this));

    this.videoContainer.addEventListener("playbackToggled", this.togglePlayback.bind(this));
  }

  /**
   * subscribeToEvents - Subscribes the component to global messages and sets the component's responses via internal custom events
   *
   */
  subscribeToEvents() {   
    // Fallback to scroll event detection if browser doesn't support IntersectionObserver
    if (typeof (window.IntersectionObserver) === 'undefined') {
      PubSub.subscribe(Events.messages.scroll, () => {
        if (inView(this.videoContainer) && !this.isLoaded){
          this.videoContainer.dispatchEvent(Events.createCustomEvent("videoInView"));
        }
      });
    }
  }
}

/**
 * delegateEvents - Create delegated event listeners for the components managed within this module
 *
 * @returns {type} Description
 */
function delegateEvents() {
  Events.delegate("click", SEL_INLINE_VIDEO_TOGGLE, "playbackToggled");
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
      entry.target.dispatchEvent(Events.createCustomEvent("videoInView"));
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
export function initModule() {
  // Create delegated event listeners for the components within this module
  delegateEvents();

  // Initialise an observer object to detect when smart image elements are in view
  initialiseVideoObserver();

  // Find and initialise Show/Hide components using the ShowHide class
  initialiseVideoPlayers();

}

export default { initModule: initModule };