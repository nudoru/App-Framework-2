/*
 Helper to append a module with a render() function to the DOM
 */

export function append(view, selector) {
  if (typeof view.render === 'function') {
    let parent = document.querySelector(selector),
        el     = view.render();
    if (parent) {
      parent.appendChild(el);
      return el;
    } else {
      console.warn('attach view, selector not found: ', selector);
    }
  } else {
    console.warn('attach view, view must have render() method');
  }
  return null;
}