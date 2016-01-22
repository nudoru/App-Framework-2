/**
 * Add RxJS Subject to a module.
 *
 * Add one simple observable subject or more complex ability to create others for
 * more complex eventing needs.
 */

import Rx from 'rx';

export default function() {

  let _subjectMap = {};

  function subscribe(name, handler) {
    if (!_subjectMap.hasOwnProperty(name)) {
      _subjectMap[name] = new Rx.Subject();
    }
    return _subjectMap[name].subscribe(handler);
  }

  function notify(name, payload) {
    if (_subjectMap.hasOwnProperty(name)) {
      _subjectMap[name].onNext(payload);
    } else {
      console.warn('ObservableSubject, no subscribers of ' + name);
    }
  }

  return {
    subscribe: subscribe,
    notify   : notify
  };

}