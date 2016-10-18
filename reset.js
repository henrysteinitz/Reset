/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const R$ = __webpack_require__(2);
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


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	class Re$etMemory {
	  constructor(){
	    this.past = {}
	    this.future = {}
	  }

	  set(nodes, action, parameters){
	    if (nodes in this.past) {
	      this.past[nodes].push([action, parameters])
	    } else {
	      this.past[nodes] = [[action, parameters]];
	    }
	  }

	  unset(nodes){
	    if (nodes in this.past) {
	      if (nodes in this.future) {
	        this.future[nodes].unshift(this.past[nodes].pop())
	      } else {
	        this.future[nodes] = [this.past.nodes.pop()];
	      }
	    }
	  }
	}

	class Re$et {
	  constructor(nodes){
	    this.nodes = nodes;
	  }

	  html(string){
	    if(string === undefined){
	      return this.nodes[0].innerHTML;
	    } else {
	      for (let i = 0; i < this.nodes.length; i++) {
	        this.nodes[i].innerHTML = string;
	      }
	    }
	  }

	  empty(){
	    for (let i = 0; i < this.nodes.length; i++) {
	      this.nodes[i].outerHTML = "";
	    }
	  }

	  append(elements){
	    let dom = r$(elements);
	    const moreHTML = [];
	    for (let i = 0; i < this.nodes.length; i++) {
	      moreHTML.push("");
	      for (let j = 0; j < dom.nodes.length; j++) {
	        moreHTML[i] = moreHTML[i].concat(dom.nodes[j].outerHTML);
	      }
	    }

	    for (let i = 0; i < this.nodes.length; i++) {
	      this.nodes[i].innerHTML += moreHTML[i];
	    }
	  }

	  set(attribute, value){
	    for (let i = 0; i < this.nodes.length; i++) {
	      this.nodes[i].setAttribute(attribute, value);
	    }
	  }

	  addClass(className){
	    for (let i = 0; i < this.nodes.length; i++) {
	      const classes = this.nodes[i].className.split(" ");
	      classes.push(className);
	      this.nodes[i].setAttribute('class', classes.join(' '));
	    }
	  }

	  removeClass(clsName){
	    for (let i = 0; i < this.nodes.length; i++) {
	      const classes = this.nodes[i].className.split(" ");
	      const index = classes.indexOf(clsName);
	      if (index >= 0) {
	        classes.splice(index, 1);
	      }
	      this.nodes[i].className = classes.join(' ');
	    }
	  }

	  children(){
	    let result = [];
	    const allChildren = (node) => {
	      node.childNodes.forEach((child) =>{
	        if (child.nodeType === 1){
	          result.push(child);
	          allChildren(child);
	        }
	      });
	    };
	    this.nodes.forEach((child) => {
	      allChildren(child);
	    });
	    return new DOMNodeCollection(result);
	  }

	  parent(){
	    const result = [];
	    for (let i = 0; i < this.nodes.length; i++) {
	      result.push(this.nodes[i].parentNode);
	    }

	    return new DOMNodeCollection(result);
	  }

	  find(query){
	    let result = [];
	    for (let i = 0; i < this.nodes.length; i++) {
	      result = result.concat(Array.from(this.nodes[i].querySelectorAll(query)));
	    }

	    return new DOMNodeCollection(result);
	  }

	  remove(){
	    this.empty();
	    this.nodes = [];
	  }

	  on(type, func){
	    for (let i = 0; i < this.nodes.length; i++) {
	      let e = this.nodes[i].addEventListener(type, func);
	      this.nodes[i].listeners = this.nodes[i].listeners || {};
	      this.nodes[i].listeners[type] =  this.nodes[i].listeners[type] || [];
	      this.nodes[i].listeners[type].push(func);
	    }
	  }

	  off(type, func){
	    if(func !== undefined){
	      for (let i = 0; i < this.nodes.length; i++) {
	        const listeners = this.nodes[i].listeners;
	        this.nodes[i].removeEventListener(type, func);
	        const index = listeners[type].indexOf(func);
	        listeners[type].splice(index, 1);
	      }
	    }else{
	      for (let j = 0; j < this.nodes.length; j++) {
	        const listeners = this.nodes[j].listeners;
	        for (let i = 0; i < listeners[type].length; i++) {
	          this.nodes[j].removeEventListener(type, listeners[type][i]);
	        }
	        listeners[type] = [];
	      }
	    }
	  }

	  undo(){

	  }

	  redo(){

	  }
	}

	R$ = {};
	R$.Re$et = Re$et;
	R$.Re$etMemory = Re$etMemory;

	module.exports = R$;


/***/ }
/******/ ]);