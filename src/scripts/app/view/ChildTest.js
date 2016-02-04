import {defineComponent} from '../../nori/Nori.js';
import Template from '../../nori/view/Templating.js';
import Delegator from '../../nori/view/Delegator.js';

export default defineComponent('ChildTest', {

  counter: 0,
  events: {},

  init() {
    this.events = {
      'click button.nuButton-neutral-light': () => {
        console.log('Clicked',this.id());
        this.setProps({label: 'Clicked ' + (++this.counter) + ' times'});
      }
    };
  },

  onClick() {
    console.log('Clicked',this.id());
  },

  render() {
    let templateFunc = Template.getTemplateFromHTML(`<div>
            <button class="nuButton-neutral-light">{{id}}, {{label}}</button>
            <div class="test__subchild"></div>
          </div>`);
    return templateFunc(this.props);
  },

  componentDidMount(){
    //Delegator.delegateEvents(this.dom(), this.events, false);
  },

  componentWillUnmount(){
    //Delegator.undelegateEvents(this.events);
  }

});