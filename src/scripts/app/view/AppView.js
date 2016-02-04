import Nori from '../../nori/Nori.js';
import TemplateViewFactory from './TemplateViewComponent.js';
import ComponentTesting from './ComponentsTesting.js';
import ControlsTesting from './ControlsTesting.js';
import ChildTest from './ChildTest.js';
import DOMUtils from '../../nudoru/browser/DOMUtils.js';
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

    let vcDefault    = Nori.c('TemplateViewComponent', {
          target: '#contents',
          attach: 'replace'
        }),
        vcControls   = Nori.c('ControlsTest', {
          target: '#contents',
          attach: 'replace'
        }),
        vcComponents = Nori.c('ComponentsTest', {
          target: '#contents',
          attach: 'replace'
        }, [
          Nori.c('ChildTest', {target: '#debug-child', label: 'aaAppened1'}),
          Nori.c('ChildTest', {target: '#debug-child', label: 'aaAppened2'}),
          Nori.c('ChildTest', {target: '#debug-child', label: 'aaAppened3'})
        ]);

    // condition, component ID
    this.route('/', vcDefault);
    //this.route('/styles', vcStyles);
    this.route('/controls', vcControls);
    this.route('/comps', vcComponents);
  }

})();

export default AppViewModule;