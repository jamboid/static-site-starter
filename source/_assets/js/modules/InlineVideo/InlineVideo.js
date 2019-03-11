
/////////////
// Imports //
/////////////

import PubSub from "pubsub-js";

import MESSAGES from "Modules/Events/messages";
import createCustomEvent from "Modules/Events/createCustomEvent";

///////////////
// Constants //
///////////////

const SEL_INLINE_VIDEO_PLAYER = "[data-inline-video=player]";
const CLASS_IS_PLAYING = "is_Playing";
const CLASS_IS_PAUSED = "is_Paused"; 

/////////////////////////
// Classes & Functions //
/////////////////////////

/**
 *
 *
 * @class InlineVideo
 */
export default class InlineVideo {
  /**
   *Creates an instance of InlineVideo.
   * @param {node} element
   * @memberof InlineVideo
   */
  constructor(element, videoObserver) {
    this.videoContainer = element;
    this.videoPlayer = this.videoContainer.querySelector(SEL_INLINE_VIDEO_PLAYER);
    this.videoSources = this.videoPlayer.querySelectorAll('source');
    this.videoObserver = videoObserver;

    this.isLoaded = false;
    this.isPlaying = false;
    this.isReached = false;
    this.isLoaded = false;
    this.userPause = false;

    this.videoObserver.observe(this.videoContainer);

    // Call initial methods
    this.bindCustomMessageEvents();
    this.subscribeToEvents();

    this.videoContainer.classList.add(CLASS_IS_PAUSED);
  }

  /**
   *
   *
   * @memberof InlineVideo
   */
  loadVideo(e) {
    e.preventDefault();

    if (!this.isLoaded) {
      // Set src for each source
      this.videoSources.forEach(currentValue => {
        const videoURL = currentValue.dataset.src;
        currentValue.setAttribute("src", videoURL);
      });

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
    this.videoPlayer.play();
    this.isPlaying = true;
    this.videoContainer.classList.add(CLASS_IS_PLAYING);
    this.videoContainer.classList.remove(CLASS_IS_PAUSED);
  }

  /**
   *
   *
   * @memberof InlineVideo
   */
  pauseVideo(e) {
    e.preventDefault();
    this.videoPlayer.pause();
    this.isPlaying = false;
    this.videoContainer.classList.remove(CLASS_IS_PLAYING);
    this.videoContainer.classList.add(CLASS_IS_PAUSED);
  }

  /**
   *
   *
   * @memberof InlineVideo
   */
  togglePlayback(e) {
    e.preventDefault();

    if (this.isPlaying) {
      this.pauseVideo(e);
    } else {
      this.playVideo(e);
    }
  }

  /**
   * bindCustomMessageEvents - Binds custom event listeners to the Smart Image DOM Element
   *
   */
  bindCustomMessageEvents() {
    // EventListener for custom event from Video IntersectionObserver
    this.videoContainer.addEventListener("videoObservedInView", this.loadVideo.bind(this));
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
    PubSub.subscribe(MESSAGES.stopMedia, () => {
      this.videoContainer.dispatchEvent(createCustomEvent("pause"));
    });
  }
}