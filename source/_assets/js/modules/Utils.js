// Utilities Module
"use strict";

/**
 * Returns the nearest parent element matching the selector, with the option to return the starting element if it matches.
 * source: https://blog.wearecolony.com/a-year-without-jquery/
 * @param   {Element}       el
 * @param   {string}        selector
 * @param   {boolean}       [includeSelf]
 * @return  {Element|null}
 */
export function closestParent(el, selector, includeSelf) {
  let parent = el.parentNode;

  if (includeSelf && el.matches(selector)) {
    return el;
  }

  while (parent && parent !== document.body) {
    if (parent.matches && parent.matches(selector)) {
      return parent;
    } else if (parent.parentNode) {
      parent = parent.parentNode;
    } else {
      return null;
    }
  }

  return null;
}


/**
 * Get the index if a DOM node in relation to its siblings within a parent element
 *
 * @export
 * @param {*} node
 * @returns
 */
export function indexOfNode(node) {
  const CHILD = node;
  const PARENT = CHILD.parentNode;
  // The equivalent of parent.children.indexOf(child)
  const INDEX = Array.prototype.indexOf.call(PARENT.children, CHILD);  

  return INDEX;
}

/**
 * Create HTML elements from a string containing HTML tags and content
 *
 * @export
 * @param {*} htmlString
 * @returns
 */
export function createNodeFromHTML(htmlString) {
  const CONTAINER_ELEMENT = document.createElement('div');
  CONTAINER_ELEMENT.innerHTML = htmlString.trim();
  // Change this to div.childNodes to support multiple top-level nodes
  return CONTAINER_ELEMENT.firstChild;
}

export function wrapElement(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

/**
 * isElementInView - Check if an element is visible in the viewport and returns a boolean 
 * accordingly
 *
 * @param {object} element Description
 *
 * @returns {boolean} Description
 */
export function isElementInView(element) {
  const WINDOW_HEIGHT = window.innerHeight;
  const SCROLL_TOP = window.scrollY;
  const ELEMENT_OFFSET = element.getBoundingClientRect();
  const ELEMENT_TOP = ELEMENT_OFFSET.top;
  const ELEMENT_HEIGHT = element.offsetHeight;

  if ( ELEMENT_TOP < (SCROLL_TOP + WINDOW_HEIGHT)  && (ELEMENT_TOP + ELEMENT_HEIGHT) > SCROLL_TOP ) {
    return true;
  } else if ( (ELEMENT_TOP + ELEMENT_HEIGHT) > SCROLL_TOP && (ELEMENT_TOP + ELEMENT_HEIGHT) < (SCROLL_TOP + WINDOW_HEIGHT) ) {
    return true;
  } else {
    return false;
  }
}

/**
 * outerWidth - function that returns the width of an element including horizontal margins
 *
 * @param {object} el - Single DOM element
 *
 * @returns {int} calculated outer width of el
 */
export function outerWidth(el) {
  let width = parseInt(el.offsetWidth);
  const STYLE = getComputedStyle(el);

  width += parseInt(STYLE.marginLeft) + parseInt(STYLE.marginRight);
  return width;
}

/**
 * Returns the height of an element including vertical margins
 * 
 * @param {Element} el
 */
export function outerHeight(el) {
  let height = parseInt(el.offsetHeight);
  const STYLE = getComputedStyle(el);

  height += parseInt(STYLE.marginTop) + parseInt(STYLE.marginBottom);
  return height;
}

/**
 * Read a page's GET URL query string variables and return them as an associative array.
 * 
 * @return  {Array}
 */
export function getURLQueryString() {
  var vars = [],
    hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

/**
 * Converts any encoded characters in a string to their unencoded versions - e.g. &amp to &
 *
 * @param {string} text
 *
 * @returns {string}
 */
export function decodeCharacters(text) {
  var elem = document.createElement('textarea');
  elem.innerHTML = text;
  return elem.value;
}

/**
 * Remove the style attribute from an element
 *
 * @param {type} element Description
 *
 * @returns {type} Description
 */
export function removeInlineStyles(element) {
  element.setAttribute('style', '');
}

/**
 * getOffset - Return an object with the top and left offsets of an element
 *
 * @param {element} el Single DOM element
 *
 * @returns {object} Simple object with left and top properties
 */
export function getOffset(el) {
  el = el.getBoundingClientRect();
  return {
    left: el.left + window.scrollX,
    top: el.top + window.scrollY
  }
}

/**
 * ready - Call a function when the page DOM is loaded and complete
 *
 * @param {function} fn Description
 */
export function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

export default {
  closestParent: closestParent,
  isElementInView: isElementInView,
  outerWidth: outerWidth,
  outerHeight: outerHeight,
  getURLQueryString: getURLQueryString,
  decodeCharacters: decodeCharacters,
  removeInlineStyles: removeInlineStyles,
  getOffset: getOffset,
  createNodeFromHTML: createNodeFromHTML,
  indexOfNode: indexOfNode,
  wrapElement: wrapElement,
  ready: ready
};
