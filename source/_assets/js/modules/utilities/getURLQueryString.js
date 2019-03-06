/**
 * Read a page's GET URL query string variables and return them as an associative array.
 * 
 * @return  {Array}
 */
export default function getURLQueryString() {
  let vars = [];
  let hash;
  
  const hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  
  for (let i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  
  return vars;
}