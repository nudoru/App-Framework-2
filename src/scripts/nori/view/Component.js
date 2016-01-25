/**
 * Base module for components
 * Must be extended with custom modules
 *
 * Functions beginning with $ should be treated as private
 *
 * Lifecycle should match React:
 *
 * First render: getDefaultProps, getInitialState, componentWillMount, render, componentDidMount
 * Props change: componentWillReceiveProps, shouldComponentUpdate, componentWillUpdate, (render), componentDidUpdate
 * Unmount: componentWillUnmount
 */

//----------------------------------------------------------------------------
//  Lifecycle stubs
//----------------------------------------------------------------------------

// getDOMEvents()
// componentWillUpdate(nextProps)
// componentDidUpdate(lastProps)
// componentDidMount()
// componentWillUnmount()
// componentWillDispose()

import Is from '../../nudoru/util/is.js';
import DOMUtils from '../../nudoru/browser/DOMUtils.js';
import Template from './Templating.js';
import EventDelegator from './ComponentEventDelegator.js';
import { isEqual, forOwn, reduce } from 'lodash';

const LS_NO_INIT   = 0,
      LS_INITED    = 1,
      LS_RENDERING = 2,
      LS_MOUNTED   = 3,
      LS_UNMOUNTED = 4,
      CLASS_PREFIX = 'js__vc';

export default function () {

  let _internalProps,
      _children,
      _parent,
      _lastProps,
      _events         = EventDelegator(),
      _html,
      _domElementCache,
      props           = {};

  /**
   * Initialization
   * @param initProps
   */
  function $componentInit() {
    _internalProps = this.getDefaultProps();
    _children      = {};
    this.$processChildren();
    this.$setPublicProps();
  }

  function $processChildren() {
    if (this.__children) {
      this.__children.forEach(child => {
        let childObj = child;
        if (typeof child === 'function') {
          childObj = child();
        }
        this.addChild(childObj.id(), childObj);
      });
    }
  }

  //----------------------------------------------------------------------------
  //  Props
  //----------------------------------------------------------------------------

  /**
   * Override to set default props
   *
   * For a region, which is instantiated from the factory with props, this function
   * will be overwritten by the code in ComponentView to return the passed
   * initProps object
   */
  function getDefaultProps() {
    return {};
  }

  /**
   * Set new props and trigger rerender
   */
  function setProps(nextProps) {
    if (!Is.object(nextProps)) {
      console.warn('Must call setProps with an object');
      return;
    }

    this.$updateProps(nextProps, null);
  }

  function shouldUpdate(nextProps) {
    nextProps     = nextProps || _internalProps;
    let isPropsEq = isEqual(nextProps, _internalProps);
    return !(isPropsEq);
  }

  function updateProps(nextProps) {
    _lastProps     = Object.assign({}, _internalProps);
    _internalProps = Object.assign({}, _internalProps, nextProps);
  }

  function $updateProps(nextProps) {
    nextProps = nextProps || _internalProps;
    if (!shouldUpdate(nextProps)) {
      return;
    }

    if (typeof this.componentWillUpdate === 'function') {
      this.componentWillUpdate(nextProps);
    }

    updateProps(nextProps);

    this.$setPublicProps();

    this.$renderAfterPropsChange();

    if (typeof this.componentDidUpdate === 'function') {
      this.componentDidUpdate(_lastProps);
    }
  }

  function $setPublicProps() {
    props = Object.assign(props, _internalProps);
  }

  //----------------------------------------------------------------------------
  //  Rendering HTML
  //----------------------------------------------------------------------------

  function forceUpdate() {
    this.$renderAfterPropsChange(true);
    this.$forceUpdateChildren();
  }

  /**
   * Handle rendering after propschange
   */
  function $renderAfterPropsChange(force = false) {
      this.$renderComponent();
      if (this.isMounted() || force) {
        this.$mountComponent();
      }
  }

  /**
   * Render it, need to add it to a parent container, handled in higher level view
   * @param force If true, will force a render
   * @returns {*}
   */
  function $renderComponent() {
    this.$renderChildren();
    _html = this.render();
  }

  /**
   * May be overridden in a submodule for custom rendering
   * Should return HTML
   */
  function render() {
    let templateFunc = Template.getTemplate(this.id());

    return templateFunc(_internalProps);
  }

  //----------------------------------------------------------------------------
  //  Mounting to the DOM
  //----------------------------------------------------------------------------

  function $mountComponent() {
    if (!_html || _html.length === 0) {
      console.warn('Component ' + this.id() + ' cannot mount with no HTML. Call render() first?');
      return;
    }

    this.mount();
    this.$mountChildren();

    if (typeof this.componentDidMount === 'function') {
      this.componentDidMount();
    }
  }

  /**
   * Append it to a parent element
   */
  function mount() {
    let lastAdjacentNode;

    if (this.isMounted()) {
      // Capture where it was in the tree before removing so it can be replaced
      lastAdjacentNode = this.dom().nextSibling;
      this.unmount();
    }

    _domElementCache = attachElement(lastAdjacentNode);

    this.$addEvents();
  }

  function attachElement(lastAdjacent) {
    let domEl, currentHTML,
        mountPoint = document.querySelector(props.target);

    // For a child component that has no mount set, append to the end of the parent
    if (!mountPoint && _parent) {
      console.warn(id() + 'has no mount point defined, attaching to parent');
      mountPoint = document.querySelector('.' + getParent().className());
    }

    if (!mountPoint) {
      console.warn('Component', id(), 'invalid mount', props.target);
      return;
    }

    domEl = DOMUtils.HTMLStrToNode(_html);
    DOMUtils.addClass(domEl, 'nori__vc');
    DOMUtils.addClass(domEl, className());

    if (props.attach === 'replace') {
      currentHTML = mountPoint.innerHTML;
      if (_html !== currentHTML) {
        mountPoint.innerHTML = '';
        mountPoint.appendChild(domEl);
      }
    } else {
      mountPoint.insertBefore(domEl, lastAdjacent);
    }

    return domEl;
  }

  function $addEvents() {
    if (this.shouldDelegateEvents() && typeof this.getDOMEvents === 'function') {
      _events.delegateEvents(this.dom(), this.getDOMEvents(), _internalProps.autoFormEvents);
    }
  }

  /**
   * Override to delegate events or not based on some state trigger
   */
  function shouldDelegateEvents() {
    return true;
  }

  function unmount() {
    if (typeof this.componentWillUnmount === 'function') {
      this.componentWillUnmount();
    }

    this.$unmountChildren();
    this.$removeEvents();

    if (_internalProps.attach === 'replace') {
      DOMUtils.removeAllElements(document.querySelector(_internalProps.target));
    } else {
      if (this.dom()) {
        DOMUtils.removeElement(this.dom());
      }
    }

    _domElementCache = null;
  }

  function $removeEvents() {
    if (typeof this.getDOMEvents === 'function') {
      _events.undelegateEvents(this.getDOMEvents());
    }
  }

  function dispose() {
    if (typeof this.componentWillDispose === 'function') {
      this.componentWillDispose();
    }

    this.$disposeChildren();
    this.unmount();
  }


  //----------------------------------------------------------------------------
  //  Children
  //----------------------------------------------------------------------------

  function addChildren(childObjs) {
    if (childObjs) {
      forOwn(childObjs, (child, id) => {
        if (childObjs.hasOwnProperty(id)) {
          this.addChild(id, child, false);
        }
      });
      $forceUpdateChildren.bind(this)();
    } else {
      _children = {};
    }
  }

  function addChild(id, child, update) {
    if (!_children.hasOwnProperty(id)) {
      _children[id] = child;
    }

    child.setParent(this);

    if (update) {
      $forceUpdateChildren.bind(this)();
    }
  }

  function setParent(parent) {
    _parent = parent;
  }

  function getParent() {
    return _parent;
  }

  /**
   * Force init, render and mount of all children. Called after a new child is added
   * IF the current view is mounted and the children aren't
   */
  function $forceUpdateChildren() {
      forOwn(_children, child => {
        if (!child.isMounted()) {
          child.$renderComponent();
          child.mount();
        }
      });
  }

  function child(id) {
    if (_children.hasOwnProperty(id)) {
      return _children[id];
    }
    console.warn(this.id(), 'Child not found', id);
    return null;
  }

  function $renderChildren() {
    forOwn(_children, child => {
      child.$renderComponent();
    });
  }

  function $getChildHTMLObject() {
    return reduce(_children, (htmlObj, current, key) => {
      htmlObj[key] = current.getHTML();
      return htmlObj;
    }, {});
  }

  function $mountChildren() {
    forOwn(_children, child => {
      child.$mountComponent();
    });
  }

  function $unmountChildren() {
    forOwn(_children, child => {
      child.unmount();
    });
  }

  function $disposeChildren() {
    forOwn(_children, child => {
      child.dispose();
    });
  }

  function disposeChild(id) {
    if (_children.hasOwnProperty(id)) {
      _children[id].dispose();
    } else {
      console.warn('Cannot remove child. ', id, 'not found');
    }
  }

  //----------------------------------------------------------------------------
  //  Accessors
  //----------------------------------------------------------------------------

  function isMounted() {
    return !!this.dom();
  }

  function id() {
    return _internalProps.id;
  }

  function dom() {
    if (!_domElementCache) {
      _domElementCache = document.querySelector('.' + this.className());
    }
    return _domElementCache;
  }

  function html() {
    return _html;
  }

  function className() {
    return CLASS_PREFIX + _internalProps.index;
  }


  //----------------------------------------------------------------------------
  //  Utility
  //----------------------------------------------------------------------------

  function tmpl(html) {
    return Template.getTemplateFromHTML(html);
  }

  //----------------------------------------------------------------------------
  //  API
  //----------------------------------------------------------------------------

  return {
    // Direct obj access
    props,

    // public api
    setProps,
    getDefaultProps,
    id,
    dom,
    html,
    isMounted,
    tmpl,
    forceUpdate,
    render,
    mount,
    className,
    shouldDelegateEvents,
    unmount,
    dispose,
    addChild,
    addChildren,
    disposeChild,
    child,
    setParent,
    getParent,

    // private api
    $componentInit,
    $processChildren,
    $setPublicProps,
    $updateProps,
    $renderAfterPropsChange,
    $renderComponent,
    $mountComponent,
    $addEvents,
    $removeEvents,
    $forceUpdateChildren,
    $renderChildren,
    $mountChildren,
    $unmountChildren,
    $disposeChildren
  };
}