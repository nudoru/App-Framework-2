import Nori from '../../nori/Nori.js';

export default Nori.createComponent({

  counter: 0,

  getDOMEvents() {
    return {
      'click button.nuButton-neutral-light': () => this.setProps({label: 'Clicked ' + (++this.counter) + ' times'})
    };
  },

  render() {
    let combined     = Object.assign({}, this.props, this.state),
        templateFunc = this.tmpl(`<div>
            <button class="nuButton-neutral-light">{{id}}, {{label}}</button>
            <div class="test__subchild"></div>
          </div>`);
    return templateFunc(combined);
  }

});