import { isEqual } from 'lodash';

/**
 * Holds state for an Component
 */

export default (props = {}, state = {}, children = null) => {
  return {
    props,
    state,
    children,
    parent,
    lastProps: null,
    lastState: null,

    getProps() {
      return Object.assign({}, this.props);
    },

    getState() {
      return Object.assign({}, this.state);
    },

    shouldUpdate(nextProps, nextState) {
      nextProps     = nextProps || this.props;
      nextState     = nextState || this.state;
      let isStateEq = isEqual(nextState, this.state),
          isPropsEq = isEqual(nextProps, this.props);
      return !(isStateEq) || !(isPropsEq);
    },

    setProps(nextProps) {
      this.lastProps = Object.assign({}, this.props);
      this.props     = Object.assign({}, this.props, nextProps);
    },

    setState(nextState) {
      this.lastState = Object.assign({}, this.state);
      this.state     = Object.assign({}, this.state, nextState);
    },

    setParent(parent) {
      this.parent = parent;
    },

    getParent() {
      return this.parent;
    },

    addChild(id, newChild) {
      if (!this.children.hasOwnProperty(id)) {
        this.children[id] = newChild;
      }
    },

    removeChild(id) {
      if (this.children.hasOwnProperty(id)) {
        delete this.children[id];
      }
    }
  };
}