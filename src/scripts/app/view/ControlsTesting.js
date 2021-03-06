import {defineComponent} from '../../nori/Nori.js';
import Template from '../../nori/view/Templating.js';

/**
 * Module for a dynamic application view for a route or a persistent view
 */


export default defineComponent('ControlsTest', {

  componentDidMount() {
  },

  componentWillUnmount() {
  },

  render() {
    let templateFunc = Template.getTemplate(this.props.nodeName);
    return templateFunc(this.props);
  }


});