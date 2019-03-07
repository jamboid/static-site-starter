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
  constructor(el) {
    this.galleryIndexNode = el;
    this.indexNodes = this.galleryIndexNode.querySelectorAll(SEL_INDEX_NODE);
    this.currentPosition = 0;
    this.currentIndexNode = this.indexNodes.item(0);
  }  

  // Get current position
  get position() {
    return this.currentPosition;
  }

  // Set current position
  set position(newPos) {
    if(typeof newPos === "number") {
      this.currentPosition = newPos;
      this.updateCurrentIndexNode();
    }
  }

  // Update current node
  updateCurrentIndexNode() {  
    // Remove "current" class from previous "current" node
    this.currentIndexNode.classList.remove(CLASS_CURRENT_INDEX_NODE)
    // Set current index node class prop to new current node and add "current" class
    this.currentIndexNode = this.indexNodes.item(this.currentPosition);
    this.currentIndexNode.classList.add(CLASS_CURRENT_INDEX_NODE);
  }
}