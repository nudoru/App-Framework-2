/**
 * Return a new Nori class by combining a template and customizer with mixins
 * @param template
 * @param customizer
 * @returns {Function}
 */

import buildFromMixins from './BuildFromMixins.js';

export default function(template, customizer) {
  template = template || {};
  return function factory() {
    return Object.assign({}, template, buildFromMixins(customizer));
  };
}