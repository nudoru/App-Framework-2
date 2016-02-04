/**
 * Mixin view that allows for component views
 */

import ViewComponentFactory from './Component.js';
import BuildFromMixins from '../utils/BuildFromMixins.js';
import Router from './URLRouter.js';
import DeepCopy from '../../nudoru/util/DeepCopy.js';
import IsDOMElement from '../../nudoru/browser/IsDOMElement.js';
import {render} from './AppendView';

export default function () {

  let _routeViewMap      = {},
      _viewIDIndex       = 0,
      _routeOnURL        = false,
      _routeOnState      = false,
      _currentViewComponent,
      _componentRegistry = {};
  //_observedStore,
  //_currentStoreState;

  /**
   * Factory to create component view modules by concating multiple source objects
   */
  const defineComponent = (name, source) => {
    if (_componentRegistry[name]) {
      console.warn('Component already defined with type', name);
      return;
    }

    _componentRegistry[name] = source;
  };

  /**
   * Creates an instance of the component
   */
  const c = (name, props, children) => {
    if (!_componentRegistry.hasOwnProperty(name)) {
      console.warn('Component not found', name);
      //if (IsDOMElement(name)) {
      //  console.warn('isDOM!', name);
      //}
      return;
    }

    let source = _componentRegistry[name];

    let customizer,
        template,
        final,
        pDefaultProps;

    customizer = DeepCopy(source);

    customizer.mixins = customizer.mixins || [];
    customizer.mixins.unshift(ViewComponentFactory());

    template            = BuildFromMixins(customizer);
    template.__children = children;

    pDefaultProps = template.getDefaultProps;

    template.getDefaultProps = () => {
      let specs = {
        nodeName: name,
        id      : name + _viewIDIndex || 'vc' + _viewIDIndex,
        index   : _viewIDIndex++,
        attach  : 'append'
      };
      return Object.assign({}, pDefaultProps.call(template), specs, props);
    };

    final = Object.assign({}, template);
    final.$componentInit.call(final);

    if (typeof final.init === 'function') {
      final.init.call(final);
    }

    return final;
  };

  //----------------------------------------------------------------------------
  //  Conditional view such as routes or states
  //  Must be augmented with mixins for state and route change monitoring
  //----------------------------------------------------------------------------

  /**
   * Map a route to a module view controller
   */
  const route = (condition, component) => {
    _routeViewMap[condition] = component;
  };

  /**
   * Show a view (in response to a route change)
   */
  const showViewForCondition = (condition) => {
    let view = _routeViewMap[condition];

    if (!view) {
      console.warn("No view mapped for route: " + condition);
      return;
    }

    showView(view);
  };

  /**
   * Show a mapped view
   */
  const showView = (viewComponent) => {
    if (viewComponent === _currentViewComponent) {
      return;
    }

    // Remove
    if (_currentViewComponent) {
      _currentViewComponent.dispose();
    }
    _currentViewComponent = null;

    _currentViewComponent = viewComponent;
    //viewComponent.forceUpdate();
    render(viewComponent);
  };

  //----------------------------------------------------------------------------
  //  Routing
  //----------------------------------------------------------------------------

  const showViewForChangedCondition = (options) => {
    if (_routeOnURL) {
      showViewForChangedURL(options);
    } else if (_routeOnState) {
      showViewForChangedState(options);
    }
  };

  //----------------------------------------------------------------------------
  //  URL Fragment Route
  //----------------------------------------------------------------------------

  const initializeRouteViews = () => {
    _routeOnURL   = true;
    _routeOnState = false;

    Router.subscribe($onRouteChange);
  };

  const $onRouteChange = (payload) => {
    showViewForCondition(payload.routeObj.route);
  };

  /**
   * Typically on app startup, show the view assigned to the current URL hash
   *
   * @param silent If true, will not notify subscribers of the change, prevents
   * double showing on initial load
   */
  const showViewForChangedURL = (silent = false) => {
    showViewForCondition(Router.getCurrentRoute().route);
    if (!silent) {
      Router.notifySubscribers();
    }
  };

  //----------------------------------------------------------------------------
  //  Store State Route
  //  TODO Disabled - need to reevaluate for Redux
  //----------------------------------------------------------------------------

  //const initializeStateViews = (store) => {
  //  _routeOnURL   = false;
  //  _routeOnState = true;
  //
  //  _observedStore = store;
  //  _observedStore.subscribe($onStateChange.bind(this));
  //};
  //
  //const $onStateChange= () => {
  //  showViewForChangedState.bind(this)();
  //};
  //
  //const showViewForChangedState = () => {
  //  let state = _observedStore.getState().currentState;
  //  if (state) {
  //    if (state !== _currentStoreState) {
  //      _currentStoreState = state;
  //      showViewForCondition(_currentStoreState);
  //    }
  //  }
  //};

  //----------------------------------------------------------------------------
  //  API
  //----------------------------------------------------------------------------

  return {
    defineComponent,
    c,
    showView,
    showViewForCondition,
    route,
    showViewForChangedCondition,
    initializeRouteViews,
    showViewForChangedURL
    //initializeStateViews,
    //showViewForChangedState
  };

}