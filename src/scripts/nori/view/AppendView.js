import DOMUtils from '../../nudoru/browser/DOMUtils.js';

export function append(el, selector) {
  let parent = document.querySelector(selector);
  if (parent) {
    parent.appendChild(el);
  } else {
    console.warn('Can\'t append element, selector not found: ', selector);
  }
}

export function replace(el, selector) {
  if (el.parent) {
    let parent      = document.querySelector(selector),
        nextSibling = el.nextSibling;
    if (parent) {
      parent.removeChild(el);
      parent.insertBefore(el, nextSibling);
    } else {
      console.warn('Can\'t append element, selector not found: ', selector);
    }
  } else {
    append(el, selector);
  }
}

//https://medium.com/@fay_jai/dissecting-reactjs-lifecycle-methods-be4fdea11c6d#.hfspw5la9

export function render(component, selector, attach) {
  if (typeof component.noriType === 'function') {
    let html           = component.render(),
        el             = DOMUtils.HTMLStrToNode(html),
        targetSelector = selector ? selector : component.props.target,
        method         = attach ? attach : component.props.attach;

    console.log('render', component.id(), targetSelector, method);

    // call will mount?

    if (method === 'replace') {
      replace(el, targetSelector);
    } else {
      append(el, targetSelector);
    }

    //call did mount?

  } else {
    console.warn('Can\'t render a non Nori component');
  }


}