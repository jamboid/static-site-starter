// Gallery Index class

/////////////
// Imports //
/////////////

///////////////
// Constants //
///////////////

const SEL_INDEX_NODE = "[data-index-node]";
const CLASS_CURRENT_INDEX_NODE = "is_Current";

/////////////////////////
// Classes & Functions //
/////////////////////////

export default class GalleryIndex {

  /**
   *Creates an instance of GalleryIndex.
   * @param {*} el
   * @memberof GalleryIndex
   */
  constructor(elem) {
    this.galleryIndexNode = elem;
    this.indexNodes = this.galleryIndexNode.querySelectorAll(SEL_INDEX_NODE);
    this.currentPosition = 0;
    this.currentIndexNode = this.indexNodes.item(0);
  }  

  /**
   * Get the currentPosition property
   *
   * @memberof GalleryIndex
   */
  get position() {
    return this.currentPosition;
  }

  
  /**
   * Set the currentPosition property
   *
   * @memberof GalleryIndex
   */
  set position(newPos) {
    if(typeof newPos === "number") {
      this.currentPosition = newPos;
      this.updateCurrentIndexNode();
    }
  }

  /**
   * Update the current node in the index
   *
   * @memberof GalleryIndex
   */
  updateCurrentIndexNode() {  
    // Remove "current" class from previous "current" node
    this.currentIndexNode.classList.remove(CLASS_CURRENT_INDEX_NODE)
    // Set current index node class prop to new current node and add "current" class
    this.currentIndexNode = this.indexNodes.item(this.currentPosition);
    this.currentIndexNode.classList.add(CLASS_CURRENT_INDEX_NODE);
  }
}