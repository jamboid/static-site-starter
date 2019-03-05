/**
 * Returns the height of an element including vertical margins
 * 
 * @param {Element} el
 */
export function getOuterHeight(el) {
  let height = parseInt(el.offsetHeight);
  const STYLE = getComputedStyle(el);

  height += parseInt(STYLE.marginTop) + parseInt(STYLE.marginBottom);
  return height;
}