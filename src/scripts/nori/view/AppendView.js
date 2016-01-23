/*
Helper to append a module with a render() function to the DOM
 */

export function append(view, selector) {
  if (typeof view.render === 'function') {
    let parent = document.querySelector(selector);
    if (parent) {
      parent.appendChild(view.render());
    } else {
      console.warn('attach view, selector not found: ', selector);
    }
  } else {
    console.warn('attach view, view must have render() method');
  }
}