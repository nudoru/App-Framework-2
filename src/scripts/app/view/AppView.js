import Nori from '../../nori/Nori.js';
import TemplateViewFactory from './TemplateViewComponent.js';
import ComponentTesting from './ComponentsTesting.js';
import ControlsTesting from './ControlsTesting.js';
import DOMUtils from '../../nudoru/browser/DOMUtils.js';
import ChildTest from './ChildTest.js';
import {append} from '../../nori/view/AppendView';

import ViewApp from './view.App';

import h from 'hyperscript';
const { div, span, h1 } = require('hyperscript-helpers')(h);

/**
 * View for an application.
 */
let AppViewModule = Nori.createView({

  mixins: [],

  initialize() {
    append(ViewApp.render(), '#app');
    this.initializeRouteViews();
    this.mapRoutes();
  },

  mapRoutes() {
    let vcDefault    = TemplateViewFactory('default', {
          target: '#contents',
          attach: 'replace'
        }),
        vcControls   = ControlsTesting('controls', {
          target: '#contents',
          attach: 'replace'
        }),
        vcStyles     = Nori.createComponent({})('styles', {
          target: '#contents',
          attach: 'replace'
        }),
        vcComponents = ComponentTesting('components', {
            target: '#contents',
            attach: 'replace'
          },
          ChildTest('append1', {
            target: '#debug-child',
            label : 'aaAppened1'
          }),
          ChildTest('append2', {
            target: '#debug-child',
            label : 'aaAppened2'
          }),
          Nori.createComponent()('div', {
            target : '#debug-child',
            elInner: 'testing dom el temp',
            elID   : 'my-el',
            elClass: 'h3-alternate'
          }, ChildTest('append5', {
            label: 'On dom el'
          })));

    // condition, component ID
    this.route('/', vcDefault);
    this.route('/styles', vcStyles);
    this.route('/controls', vcControls);
    this.route('/comps', vcComponents);
  }

})();

export default AppViewModule;