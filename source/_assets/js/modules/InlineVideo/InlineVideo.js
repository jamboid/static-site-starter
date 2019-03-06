
/////////////
// Imports //
/////////////

import MESSAGES from "Modules/Events/messages";

///////////////
// Constants //
///////////////

const SEL_INLINE_VIDEO_PLAYER = "[data-inline-video=player]";
const CLASS_IS_PLAYING = "is_Playing";

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
  }

  /**
   *
   *
   * @memberof InlineVideo
   */
  loadVideo(e) {
    e.preventDefault();

    if (!this.isLoaded) {
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
    this.videoContainer.classList.add(CLASS_IS_PLAYING);
  }

  /**
   *
   *
   * @memberof InlineVideo
   */
  pauseVideo(e) {
    e.preventDefault();

    this.isPlaying = false;
    this.videoContainer.classList.remove(CLASS_IS_PLAYING);
  }

  /**
   *
   *
   * @memberof InlineVideo
   */
  togglePlayback(e) {
    e.preventDefault();

    if (this.isPlaying) {
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
    
  }
}