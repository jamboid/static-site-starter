/**
 * Remove the style attribute from an element
 *
 * @param {type} element Description
 *
 * @returns {type} Description
 */
export default function removeInlineStyles(element) {
  element.setAttribute('style', '');
}