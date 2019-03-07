// Gallery Index class

/////////////
// Imports //
/////////////

import "intersection-observer";

import getIndexOfNode from 'Modules/Utilities/getIndexOfNode';
import GalleryIndex from 'Modules/GalleryIndex';

///////////////
// Constants //
///////////////

const SEL_GALLERY_SLIDE = "[data-gallery=slide]";
const SEL_GALLERY_INDEX = "[data-gallery=index]";

/////////////////////////
// Classes & Functions //
/////////////////////////

export default class SlideGallery {
  constructor(el) {
    this.slideGalleryNode = el;
    this.gallerySlideNodes = this.slideGalleryNode.querySelectorAll(SEL_GALLERY_SLIDE);
    this.galleryIndex = new GalleryIndex(this.slideGalleryNode.querySelector(SEL_GALLERY_INDEX));

    this.slideObserver = new IntersectionObserver((entries,observer) => {
      // Callback
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= 0.9) {
          // Get index of this slide and pass it as a parameter to the gallery index to update itself
          window.console.log('image in view');

          const indexOfSlide = getIndexOfNode(entry.target);
          this.updateIndex(indexOfSlide);
        }
      });
    }, 
    // Options
    {
      root: this.slideGalleryNode,
      rootMargin: "0px",
      threshold: 0.9 
    });   

    this.gallerySlideNodes.forEach((currentValue) => {
      this.slideObserver.observe(currentValue); 
    });
  }

  updateIndex(newIndex) {
    this.galleryIndex.position = newIndex
  }
}