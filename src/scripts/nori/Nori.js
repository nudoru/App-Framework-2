import ComponentViews from './view/ComponentViews.js';
import AssignArray from './utils/AssignArray.js';
import BuildFromMixins from './utils/BuildFromMixins.js';
import CreateClass from './utils/CreateClass.js';

let _componentViewInstance = null;

/**
 * Allow for optional external configuration data from outside of the compiled
 * app bundle. For easy of settings tweaks after the build by non technical devs
 * @returns {void|*}
 */
export function config() {
  return Object.assign({}, (window.APP_CONFIG_DATA || {}));
}

//----------------------------------------------------------------------------
//  Factories
//----------------------------------------------------------------------------

export function createClass(customizer) {
  return CreateClass({}, customizer);
}

/**
 * Create a new Nori application instance
 * @param customizer
 * @returns {*}
 */
export function createApplication(customizer) {
  customizer.mixins = customizer.mixins || [];
  customizer.mixins.push(this);
  return CreateClass({}, customizer)();
}

/**
 * Creates a application view
 * @param customizer
 * @returns {*}
 */
export function createView(customizer) {
  customizer.mixins = customizer.mixins || [];
  customizer.mixins.push(ComponentViews());
  return CreateClass({}, customizer);
}

/**
 * Define a component view
 * @param name
 * @param source
 * @returns {*}
 */
export function defineComponent(name, source) {
  if (!_componentViewInstance) {
    _componentViewInstance = ComponentViews();
  }
  return _componentViewInstance.defineComponent(name, source);
}

/**
 * Instantiate a component view
 * @param name
 * @param props
 * @param children
 * @returns {*}
 */
export function c(name, props, children) {
  if (!_componentViewInstance) {
    console.warn('Must create components before using them');
    return;
  }
  return _componentViewInstance.c(name, props, children);
}