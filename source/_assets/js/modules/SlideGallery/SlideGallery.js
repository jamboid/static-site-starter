// Gallery Index class

/////////////
// Imports //
/////////////

import "nodelist-foreach-polyfill";
import "intersection-observer";
import { getIndexOfNode } from '@wearegood/good-utilities';

import GalleryIndex from 'Modules/GalleryIndex';

///////////////
// Constants //
///////////////

const SEL_GALLERY_SLIDE = "[data-gallery=slide]";
const SEL_GALLERY_INDEX = "[data-gallery=index]";

/////////////////////////
// Classes & Functions //
/////////////////////////

/**
 *
 *
 * @export
 * @class SlideGallery
 */
export default class SlideGallery {
  /**
   *Creates an instance of SlideGallery.
   * @param {*} el
   * @memberof SlideGallery
   */
  constructor(el) {
    this.slideGalleryNode = el;
    this.gallerySlideNodes = this.slideGalleryNode.querySelectorAll(SEL_GALLERY_SLIDE);
    this.galleryIndex = new GalleryIndex(this.slideGalleryNode.querySelector(SEL_GALLERY_INDEX));

    this.slideObserver = new IntersectionObserver(this.handleSlideIntersections.bind(this),
      // Options
      {
        root: this.slideGalleryNode,
        rootMargin: "0px",
        threshold: 0.9
      }
    );

    this.gallerySlideNodes.forEach((currentValue) => {
      this.slideObserver.observe(currentValue);
    });
  }

  /**
   *
   *
   * @param {*} entries
   * @memberof SlideGallery
   */
  handleSlideIntersections(entries) {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= 0.9) {
        // Get index of this slide and pass it as a parameter to the gallery index to update itself
        const indexOfSlide = getIndexOfNode(entry.target);
        this.updateIndex(indexOfSlide);
      }
    });
  }

  /**
   *
   *
   * @param {*} newIndex
   * @memberof SlideGallery
   */
  updateIndex(newIndex) {
    this.galleryIndex.position = newIndex
  }
}