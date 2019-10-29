

/////////////
// Imports //
/////////////

import "nodelist-foreach-polyfill";
import "intersection-observer";
import { createDelegatedEventListener, createCustomEvent } from "@wearegood/good-utilities";

import ShowHideGrid from "Modules/Grid/ShowHideGrid";

///////////////
// Constants //
///////////////

const SEL_SHOWHIDE_GRID_COMPONENT = "[data-shgrid=component]";
const SEL_SHOWHIDE_GRID_HEADLINE = "[data-shgrid=headline]";
const SEL_SHOWHIDE_GRID_CLOSE_BUTTON = "[data-shgrid=close]";


/////////////////////////
// Classes & Functions //
/////////////////////////

function  initialiseShowHideGrids() {
  const shGrids = document.querySelectorAll(SEL_SHOWHIDE_GRID_COMPONENT);
  shGrids.forEach(element => {
    const newSHGrid = new ShowHideGrid(element);
  });
}

/**
 * delegateEvents - Create delegated event listeners for the components managed within this module
 *
 * @returns {type} Description
 */
function delegateEvents() {
  createDelegatedEventListener("click", SEL_SHOWHIDE_GRID_HEADLINE, "toggle");
}


export default function initGrids() {
  // Create delegated event listeners for the components within this module
  delegateEvents();

  initialiseShowHideGrids();
}
