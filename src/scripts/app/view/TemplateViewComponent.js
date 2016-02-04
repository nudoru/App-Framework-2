import Nori from '../../nori/Nori.js';
import NoriActions from '../../nori/action/ActionCreator';
import Template from '../../nori/view/Templating.js';

/**
 * Module for a dynamic application view for a route or a persistent view
 */

export default Nori.defineComponent('TemplateViewComponent',{

  mixins: [],

  //init() {
  //},

  getDefaultState() {
    return AppStore.getState();
  },

  //defineChildren() {},

  //getDOMEvents() {
  //  return {
  //    'evtstring selector': this._handlerFunc
  //  };
  //},

  //componentWillReceiveProps(nextProps){
  //},

  //componentWillUpdate(nextProps, nextState) {
  //},

  //componentDidUpdate(lastProps, lastState) {
  //},

  // Return HTML
  // Cache the template function for improved performance
  render() {
    // Default to grab template ID and return
    //let templateFunc = Template.getTemplate(this.id());
    //return templateFunc(this.props);

    // Custom
    let templateFunc = Template.getTemplateFromHTML(`
          <div class="padded">
            <h1>Hola</h1>
            <p>Default subview template.</p>
          </div>
        `);

    return templateFunc(this.props);
  }



  //componentDidMount() {
  //  let el = this.dom();
  //},

  //componentWillUnmount() {
  //},

  //componentWillDispose() {
  //},

});