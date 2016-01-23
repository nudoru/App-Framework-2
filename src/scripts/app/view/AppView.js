import Nori from '../../nori/Nori.js';
import AppStore from '../store/AppStore.js';
import TemplateViewFactory from './TemplateViewComponent.js';
import ComponentTesting from './ComponentsTesting.js';
import ControlsTesting from './ControlsTesting.js';
import Template from '../../nori/view/Templating.js';
import DOMUtils from '../../nudoru/browser/DOMUtils.js';
import ChildTest from './ChildTest.js';

/**
 * View for an application.
 */
let AppViewModule = Nori.createView({

  mixins: [],

  initialize() {
    this.defineTemplates();

    this.attachTemplatesToEl('#app', ['applicationscaffold']);

    this.initializeRouteViews();

    this.mapRoutes();
  },

  defineTemplates() {
    Template.addTemplate('applicationscaffold', `<div>
      <section id="contents">Contents</section>
    </div>`);
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
            target: '#debug-child',
            elInner: 'testing dom el temp',
            elID: 'my-el',
            elClass: 'h3-alternate'
          },ChildTest('append5', {
            label : 'On dom el'
          })));

    // condition, component ID
    this.route('/', vcDefault);
    this.route('/styles', vcStyles);
    this.route('/controls', vcControls);
    this.route('/comps', vcComponents);
  },

  /**
   * Attach app HTML structure
   * @param templates
   */
  attachTemplatesToEl(mountSelector, templateArray) {
    let mountEl = document.querySelector(mountSelector);

    if (!templateArray) {
      return;
    }

    templateArray.forEach(function (templ) {
      mountEl.appendChild(DOMUtils.HTMLStrToNode(Template.getSource(templ, {})));
    });
  }

})();

export default AppViewModule;