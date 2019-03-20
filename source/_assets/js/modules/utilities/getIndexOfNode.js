/**
 * Get the index if a DOM node in relation to its siblings within a parent element
 *
 * @export
 * @param {*} node
 * @returns
 */
export default function getIndexOfNode(node) {
  const CHILD = node;
  const PARENT = CHILD.parentNode;
  // The equivalent of parent.children.indexOf(child)
  const INDEX = Array.prototype.indexOf.call(PARENT.children, CHILD);
  return INDEX;
}