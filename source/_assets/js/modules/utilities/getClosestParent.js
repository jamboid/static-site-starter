/**
 * Returns the nearest parent element matching the selector, with the option to return the starting element if it matches.
 * source: https://blog.wearecolony.com/a-year-without-jquery/
 * @param   {Element}       el
 * @param   {string}        selector
 * @param   {boolean}       [includeSelf]
 * @return  {Element|null}
 */
export function getClosestParent(el, selector, includeSelf) {
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