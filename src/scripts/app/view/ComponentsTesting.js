import Nori from '../../nori/Nori.js';
import NoriActions from '../../nori/action/ActionCreator';
import AppView from './AppView';
import AppStore from '../store/AppStore';
import Template from '../../nori/view/Templating.js';
import DOMUtils from '../../nudoru/browser/DOMUtils.js';
import MixinDOMManipulation from '../../nori/view/Tweens.js';
import ChildTest from './ChildTest.js';

/**
 * Module for a dynamic application view for a route or a persistent view
 */

let _actionOneEl,
    _actionTwoEl,
    _actionThreeEl,
    _actionFourEl,
    _actionFiveEl,
    _actionSixEl,
    _this;

export default Nori.createComponent({
  /**
   * Mixins are other modules/objects that multiple components share, provides
   * common functionality between then.
   */
  mixins: [
    MixinDOMManipulation
  ],

  /**
   * Initialize and bind, called once on first render. Parent component is
   * initialized from app view
   * @param initProps
   */
  init() {
    _this = this;
  },

  /**
   * Component HTML was attached to the DOM
   */
  componentDidMount() {
    let dyn = {};

    [1, 2, 3].forEach(id => {
      id      = 'dynamic' + String(id);
      dyn[id] = ChildTest('dBtn' + id, {
        target: '#debug-child',
        attach: 'append',
        label : 'Dynamic! ' + id
      });
    });

    this.addChildren(dyn);

    //this._testNudoruComponents();
  },

  _testNudoruComponents() {
    _actionOneEl   = document.getElementById('action-one');
    _actionTwoEl   = document.getElementById('action-two');
    _actionThreeEl = document.getElementById('action-three');
    _actionFourEl  = document.getElementById('action-four');
    _actionFiveEl  = document.getElementById('action-five');
    _actionSixEl   = document.getElementById('action-six');

    _actionFourEl.addEventListener('click', function actFour(e) {
      _this.child('testChild').setProps({label: 'From the parent'});
    });

    _actionFiveEl.addEventListener('click', function actFour(e) {
      AppStore.apply(NoriActions.changeStoreState({foo: 'bar'}));
    });

    _actionSixEl.addEventListener('click', function actFour(e) {
      //
    });
  },

  componentWillUnmount() {
  }

});