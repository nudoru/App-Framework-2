import h from 'hyperscript';
const { div, section} = require('hyperscript-helpers')(h);

export default {
    render() {
      return div([section('#contents')]);
    }
}