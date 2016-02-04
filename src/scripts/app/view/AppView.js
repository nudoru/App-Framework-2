import {c, createView} from '../../nori/Nori.js';
import TemplateViewFactory from './TemplateViewComponent.js';
import ComponentTesting from './ComponentsTesting.js';
import ControlsTesting from './ControlsTesting.js';
import ChildTest from './ChildTest.js';
import DOMUtils from '../../nudoru/browser/DOMUtils.js';
import {append, render} from '../../nori/view/AppendView';

import ViewApp from './view.App';

import h from 'hyperscript';
const { div, span, h1 } = require('hyperscript-helpers')(h);

/**
 * View for an application.
 */
let AppViewModule = createView({

  mixins: [],

  initialize() {
    append(ViewApp.render(), '#app');
    this.initializeRouteViews();
    this.mapRoutes();
  },

  mapRoutes() {
    //let vcDefault    = TemplateViewFactory('default', {
    //      target: '#contents',
    //      attach: 'replace'
    //    }),
    //    vcControls   = ControlsTesting('controls', {
    //      target: '#contents',
    //      attach: 'replace'
    //    }),
    //    vcComponents = ComponentTesting('components', {
    //      target: '#contents',
    //      attach: 'replace'
    //    }, [
    //      ChildTest('append1', {target: '#debug-child', label: 'aaAppened1'}),
    //      ChildTest('append2', {target: '#debug-child', label: 'aaAppened2'}),
    //      ChildTest('append3', {target: '#debug-child', label: 'aaAppened3'})
    //    ]);

    let vcDefault    = c('TemplateViewComponent', {
          target: '#contents',
          attach: 'replace'
        }),
        vcControls   = c('ControlsTest', {
          target: '#contents',
          attach: 'replace'
        }),
        vcComponents = c('ComponentsTest', {
          target: '#contents',
          attach: 'replace'
        }, [
          c('ChildTest', {target: '#debug-child', label: 'aaAppened1'}),
          c('ChildTest', {target: '#debug-child', label: 'aaAppened2'}),
          c('ChildTest', {target: '#debug-child', label: 'aaAppened3'})
        ]);

    // condition, component ID
    this.route('/', vcDefault);
    //this.route('/styles', vcStyles);
    this.route('/controls', vcControls);
    this.route('/comps', vcComponents);
  }

})();

export default AppViewModule;