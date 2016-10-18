const R$ = require('./Re$et_classes.js');
const Re$et = R$.Re$et;
const Re$etMemory = R$.Re$etMemory;

window.r$ = function(selector){
  if (typeof selector === 'string') {
    return new Re$et(Array.from(document.querySelectorAll(selector)));
  }
  else if (selector instanceof HTMLElement) {
    return new Re$et([selector]);
  }
  else if (selector instanceof Re$et) {
    return selector;
  }
  else if (selector instanceof Function) {
    if (document.readyState === 'complete') {
      return selector();
    }
    else {
      document.addEventListener('DOMContentLoaded', selector, false);
    }
  }
};

window.r$memory = new Re$etMemory();

window.r$.extend = function(...objs){
  const result = {};
  objs.forEach( (obj) => {
    Object.keys(obj).forEach( (key) => result[key] = obj[key] );
  });
  return result;
};

window.r$.ajax = function(options){
  defaults = {
    type: 'get'
  };
  options = r$.extend(defaults, options);
  const xhr = new XMLHttpRequest();
  xhr.open(options.type, options.url);

  xhr.onload = function(){
    if (xhr.status >= 200 && xhr.status < 300) {
      options.success(xhr.response);
    }
    else {
      if (options.error) {
        options.error(xhr.response);
      }
    }
  };

  xhr.send(options.data);
};
