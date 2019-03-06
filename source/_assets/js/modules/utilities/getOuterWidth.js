/**
 * outerWidth - function that returns the width of an element including horizontal margins
 *
 * @param {object} el - Single DOM element
 *
 * @returns {int} calculated outer width of el
 */
export default function getOuterWidth(el) {
  let width = parseInt(el.offsetWidth);
  const STYLE = getComputedStyle(el);

  width += parseInt(STYLE.marginLeft) + parseInt(STYLE.marginRight);
  
  return width;
}