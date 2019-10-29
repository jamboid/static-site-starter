
/////////////
// Imports //
/////////////

import "nodelist-foreach-polyfill";
import PubSub from "pubsub-js";
import { messages as MESSAGES, createCustomEvent, getIndexOfNodeInNodeList, createNodeFromHTML } from "@wearegood/good-utilities";

///////////////
// Constants //
///////////////

const SEL_SHOWHIDE_GRID_CONTENT = "[data-shgrid=content]";
const SEL_SHOWHIDE_GRID_CELL = "[data-shgrid=cell]";
const SEL_SHOWHIDE_GRID_CONTENT_INNER = '.cp_TeamMember__content';

const GRID_DETAIL_WINDOW_TEMPLATE =
`<li class="cp_TeamMember--content cp_TeamMember" data-shgrid="window">
  <div class="cp_TeamMember__content tx_Prose"></div>
</li>`;

const SEL_SHOWHIDE_GRID_WINDOW = '[data-shgrid=window]';
const TRANSITION_TIME = 200;
const SCROLL_TIME = 400;

const SEL_PAGE_HEADER = ".ob_PageSection--header";

const CLASS_IS_CURRENT = 'is_Current';
const CLASS_IS_ACTIVE = 'is_Active';

/////////////////////////
// Classes & Functions //
/////////////////////////

export default class ShowHideGrid {
  /**
   *Creates an instance of ShowHideGrid.
   * @param {*} element
   * @memberof ShowHideGrid
   */
  constructor(element) {
    this.grid = element;
    this.gridCells = this.grid.querySelectorAll(SEL_SHOWHIDE_GRID_CELL);
    this.currentCell = null;
    this.pageHeader = document.querySelector(SEL_PAGE_HEADER);
    this.infoWindow = null;

    // Call initial methods
    this.bindCustomMessageEvents();
    this.subscribeToEvents();
  }

  /**
   * Calculate the number of grid cells in a row
   *
   * @param {*} cell
   * @returns
   * @memberof ShowHideGrid
   */
  calculateCellsPerRow(cell) {
    const CONTAINER_WIDTH = parseFloat(getComputedStyle(this.grid, null).width.replace("px", ""));
    const CELL_WIDTH = parseFloat(getComputedStyle(this.gridCells.item(0), null).width.replace("px", ""));
    const CELLS_PER_ROW = Math.round(CONTAINER_WIDTH / CELL_WIDTH);

    return CELLS_PER_ROW;
  }

  /**
   * Get position to insert Details component based on current staff member's position and the page layout
   *
   * @param {*} cell
   * @returns
   * @memberof ShowHideGrid
   */
  getInsertPosition(cell) {
    const THIS_CELL = cell;
    const CELL_POSITION = getIndexOfNodeInNodeList(THIS_CELL, this.gridCells) + 1;

    const CELLS_PER_ROW = this.calculateCellsPerRow(THIS_CELL);
    const CELL_TO_INSERT_AFTER = (Math.ceil(CELL_POSITION / CELLS_PER_ROW)) * CELLS_PER_ROW;
    let INDEX_OF_CELL_TO_INSERT_AFTER = CELL_TO_INSERT_AFTER - 1;

    if(INDEX_OF_CELL_TO_INSERT_AFTER >= this.gridCells.length) {
      INDEX_OF_CELL_TO_INSERT_AFTER = this.gridCells.length - 1;
    }

    return INDEX_OF_CELL_TO_INSERT_AFTER;
  }

  /**
   * Takes URL with Anchor and returns anchor
   *
   * @param {*} anchorUrl
   * @returns
   * @memberof ShowHideGrid
   */
  getAnchorFromAnchorUrl(anchorUrl) {
    const THIS_URL = anchorUrl;
    const INDEX = THIS_URL.indexOf('#');
    let hash;
    let anchor;

    if (INDEX > 0) {
      hash = THIS_URL.substring(INDEX + 1);
      anchor = hash;
    } else {
      anchor = "";
    }
    return anchor;
  }

  /**
   * If details pane is being displayed, reposition it in the correct position for the current grid layout
   *
   * @memberof ShowHideGrid
   */
  updateLayout() {
    const CURRENT_WINDOW = this.grid.querySelector(SEL_SHOWHIDE_GRID_WINDOW);

    if(CURRENT_WINDOW) {
      // Place info window in correct position based on current cell
      const NODE_TO_INSERT_AFTER = this.gridCells.item(this.getInsertPosition(this.currentCell));
      NODE_TO_INSERT_AFTER.parentNode.insertBefore(CURRENT_WINDOW, NODE_TO_INSERT_AFTER.nextSibling);
    }
  }

  /**
   * Use an animated scroll to position at the top of the cell passed in
   *
   * @memberof ShowHideGrid
   */
  repositionView(cell) {
    window.console.log(cell);

    const CELL_TOP_POSITION = cell.getBoundingClientRect().top;
    const SCROLL_TOP = window.pageYOffset || document.documentElement.scrollTop;
    const HEADER_HEIGHT = this.pageHeader.offsetHeight;
    const CALCULATED_POSITION = (CELL_TOP_POSITION - HEADER_HEIGHT) + SCROLL_TOP;


    window.scroll({
      top: CALCULATED_POSITION,
      left: 0,
      behavior: 'smooth'
    });
  }

  /**
   *
   *
   * @param {*} element
   * @memberof ShowHideGrid
   */
  expandElement(element) {
    element.style.height = '0px';
    // get the height of the element's inner content, regardless of its actual size
    const SECTION_HEIGHT = element.scrollHeight;

    // have the element transition to the height of its inner content
    element.style.height = SECTION_HEIGHT + 'px';

    // when the next css transition finishes (which should be the one we just triggered)
    element.addEventListener('transitionend', function expansionEnds() {
      // remove this event listener so it only gets triggered once
      element.removeEventListener("transitionend", expansionEnds);
      // remove "height" from the element's inline styles, so it can return to its initial value
      element.style.height = null;
    });
  }

  /**
   *
   *
   * @param {*} element
   * @memberof ShowHideGrid
   */
  collapseElement(element) {
    // get the height of the element's inner content, regardless of its actual size
    const SECTION_HEIGHT = element.scrollHeight;
    element.style.height = SECTION_HEIGHT + "px";

    // temporarily disable all css transitions
    const ELEMENT_TRANSITION = element.style.transition;
    element.style.transition = '';

    // on the next frame (as soon as the previous style change has taken effect),
    // explicitly set the element's height to its current pixel height, so we
    // aren't transitioning out of 'auto'
    window.requestAnimationFrame(() => {
      element.style.height = SECTION_HEIGHT + 'px';
      element.style.transition = ELEMENT_TRANSITION;

      // on the next frame (as soon as the previous style change has taken effect),
      // have the element transition to height: 0
      window.requestAnimationFrame(() => {
        element.style.height = 0 + "px";
      });

      element.addEventListener('transitionend', function expansionEnds() {
        // remove this event listener so it only gets triggered once
        element.removeEventListener("transitionend", expansionEnds);
        // remove "height" from the element's inline styles, so it can return to its initial value
        element.style.height = null;
        element.parentNode.removeChild(element);
      });
    });
  }

  /**
   *
   *
   * @param {*} cell
   * @memberof ShowHideGrid
   */
  toggleItem (cell) {
    const CELL_TO_TOGGLE = cell;
    const CURRENT_WINDOW = this.grid.querySelector(SEL_SHOWHIDE_GRID_WINDOW);
    const NEW_CONTENT = CELL_TO_TOGGLE.querySelector(SEL_SHOWHIDE_GRID_CONTENT).cloneNode(true);
    const NEW_WINDOW = createNodeFromHTML(GRID_DETAIL_WINDOW_TEMPLATE).item(0);
    const CELLS_PER_ROW = this.calculateCellsPerRow(CELL_TO_TOGGLE);

    if(CELL_TO_TOGGLE.classList.contains(CLASS_IS_CURRENT)){
      // If the cell selected is currently open, close it and remove the content window...

      CELL_TO_TOGGLE.classList.remove(CLASS_IS_CURRENT);
      this.grid.classList.remove(CLASS_IS_ACTIVE);

      if(CURRENT_WINDOW) {
        this.collapseElement(CURRENT_WINDOW);
      }

      this.currentCell = null;
    } else {
      // If the cell selected is not open close the currently open cell and open this one...

      const OPEN_CELL = Array.prototype.filter.call(this.gridCells, (cell) => {
        return cell.classList.contains(CLASS_IS_CURRENT);
      });

      if(OPEN_CELL.length > 0) {
        OPEN_CELL[0].classList.remove(CLASS_IS_CURRENT);
      }

      CELL_TO_TOGGLE.classList.add(CLASS_IS_CURRENT);
      this.grid.classList.add(CLASS_IS_ACTIVE);
      this.currentCell = CELL_TO_TOGGLE;

      if(CURRENT_WINDOW) {
        CURRENT_WINDOW.parentNode.removeChild(CURRENT_WINDOW);
      }

      NEW_WINDOW.querySelector(SEL_SHOWHIDE_GRID_CONTENT_INNER).appendChild(NEW_CONTENT);

      const NODE_TO_INSERT_AFTER = this.gridCells.item(this.getInsertPosition(CELL_TO_TOGGLE));



      if(this.getInsertPosition(CELL_TO_TOGGLE) !== this.getInsertPosition(OPEN_CELL[0]) && CELLS_PER_ROW > 1) {
      // If the insert position of the new content window is not the same as the current one,
      // do a non-animated replacement
        NEW_WINDOW.style.height = '0px';
        NODE_TO_INSERT_AFTER.parentNode.insertBefore(NEW_WINDOW, NODE_TO_INSERT_AFTER.nextSibling);
        this.expandElement(NEW_WINDOW);
      } else {
        NODE_TO_INSERT_AFTER.parentNode.insertBefore(NEW_WINDOW, NODE_TO_INSERT_AFTER.nextSibling);
      }

      this.repositionView(CELL_TO_TOGGLE);
    }
  }

  /**
   *
   *
   * @param {*} e
   * @memberof ShowHideGrid
   */
  manageSetPositionEvent(e) {
    e.preventDefault();
    this.updateLayout();
  }

  /**
   *
   *
   * @param {*} e
   * @memberof ShowHideGrid
   */
  manageToggleEvent(e) {
    e.preventDefault();
    const EVENT_TARGET = e.target;
    let cellToToggle;


    if(EVENT_TARGET.dataset.shgrid === 'cell') {
      cellToToggle = EVENT_TARGET;
    } else {
      cellToToggle = EVENT_TARGET.closest(SEL_SHOWHIDE_GRID_CELL);
    }

    this.toggleItem(cellToToggle);
  }

  /**
   * Bind custom events for this class
   *
   * @memberof ShowHideGrid
   */
  bindCustomMessageEvents() {
    this.grid.addEventListener("toggle", this.manageToggleEvent.bind(this));
    this.grid.addEventListener("setposition", this.manageSetPositionEvent.bind(this));
  }

  subscribeToEvents() {
    PubSub.subscribe(MESSAGES.layoutChange, () => {
      this.grid.dispatchEvent(createCustomEvent("updatelayout"));
    });

    PubSub.subscribe(MESSAGES.load, () => {
      this.grid.dispatchEvent(createCustomEvent("setposition"));
    });

    PubSub.subscribe(MESSAGES.resize, () => {
      this.grid.dispatchEvent(createCustomEvent("setposition"));
    });
  };
}
