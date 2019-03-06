/**
 * Wrap an element in a container element
 *
 * @export
 * @param {*} el
 * @param {*} wrapper
 */
export default function wrapElement(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}