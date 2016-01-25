export function append(el, selector) {
  let parent = document.querySelector(selector);
  if (parent) {
    parent.appendChild(el);
  } else {
    console.warn('Can\'t append element, selector not found: ', selector);
  }
}

export function replace(el, selector) {
  let parent = document.querySelector(selector),
      nextSibling = el.nextSibling;
  if (parent) {
    parent.removeChild(el);
    parent.insertBefore(el, nextSibling);
  } else {
    console.warn('Can\'t append element, selector not found: ', selector);
  }
}