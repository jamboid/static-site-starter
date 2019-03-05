/**
 * getOffset - Return an object with the top and left offsets of an element
 *
 * @param {element} el Single DOM element
 *
 * @returns {object} Simple object with left and top properties
 */
export function getOffset(el) {
  const element = el.getBoundingClientRect();
  
  return {
    left: element.left + window.scrollX,
    top: element.top + window.scrollY
  }
}