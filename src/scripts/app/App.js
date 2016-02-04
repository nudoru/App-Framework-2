import {createClass} from '../nori/Nori.js';
import AppActions from './action/ActionCreator.js';
import AppActionConstants from './action/ActionConstants.js';
import NoriActions from '../nori/action/ActionCreator.js';
import AppStore from './store/AppStore.js';
import AppView from './view/AppView.js';

require('!style!css!sass!../../sass/app.sass');

/**
 * "Controller" for a Nori application. The controller is responsible for
 * bootstrapping the app and possibly handling socket/server interaction.
 * Any additional functionality should be handled in a specific module.
 */
let App = createClass({

  mixins: [],

  /**
   * Initialize
   * Called when App is required in main.js
   */
  initialize() {
    console.log('app initialize');
    AppView.initialize();
    this.runApplication();
  },

  /**
   * Remove the "Please wait" cover and start the app
   */
  runApplication() {
    AppView.showViewForChangedCondition(true); // Start with the route in the current URL
  }

})();

export default App;