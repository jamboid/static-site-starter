
//////////////////////
// Module Constants //
//////////////////////

const CLASS_BODY_NAV_VISIBLE = "nav_Visible";

////////////////////////////////
// Module Classes & Functions //
////////////////////////////////

/**
 *
 *
 * @export
 * @class MainNavToggle
 */
export default class MainNavToggle {
  constructor(element) {
    this.menuToggle = element;

    this.bindCustomMessageEvents();
    this.subscribeToEvents();
  }

  toggleMenu() {
    document.body.classList.toggle(CLASS_BODY_NAV_VISIBLE);
  }
  
  openMenu() { }

  closeMenu() { }

  subscribeToEvents() { }

  /**
   * Add event handler for main navigation toggle
   * @function
   */
  bindCustomMessageEvents() {
    this.menuToggle.addEventListener("toggleMainNav", this.toggleMenu.bind(this));
    this.menuToggle.addEventListener("openMainNav", this.openMenu.bind(this));
    this.menuToggle.addEventListener("closeMainNav", this.closeMenu.bind(this));
  }
}