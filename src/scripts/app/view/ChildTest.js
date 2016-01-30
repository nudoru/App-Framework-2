import Nori from '../../nori/Nori.js';
import Template from '../../nori/view/Templating.js';
import Delegator from '../../nori/view/Delegator.js';

let eventDelegator = Delegator(),
    events;

export default Nori.createComponent({

  counter: 0,

  init() {
    events = {
      'click button.nuButton-neutral-light': () => this.setProps({label: 'Clicked ' + (++this.counter) + ' times'})
    };
  },

  render() {
    let templateFunc = Template.getTemplateFromHTML(`<div>
            <button class="nuButton-neutral-light">{{id}}, {{label}}</button>
            <div class="test__subchild"></div>
          </div>`);
    return templateFunc(this.props);
  },

  componentDidMount(){
    eventDelegator.delegateEvents(this.dom(), events, false);
  },

  componentWillUnmount(){
    eventDelegator.undelegateEvents(events);
  }

});