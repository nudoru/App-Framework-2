/**
 * Merges a collection of objects
 * @param target
 * @param sourceArray
 * @returns {*}
 */

export default function (target, sourceArray) {
  return sourceArray.reduce((tgt, mixin) => {
    return Object.assign(tgt, mixin);
  }, target);
}