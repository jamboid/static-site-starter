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