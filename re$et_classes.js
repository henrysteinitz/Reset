class Re$etMemory {
  constructor(){
    this.past = {}
    this.future = {}
  }

  set(nodes, action, parameters){
    nodes.forEach ( (node) => {
      if (node in this.past) {
        this.past[node].push({action: action, parameters: parameters})
      } else {
        this.past[node] = [{action: action, parameters: parameters}];
      }
      this.future[node] = [];
    })
  }

  unset(nodes){
    nodes.forEach ( (node) => {
      if (node in this.past) {
        if (node in this.future) {
          this.future[node].unshift(this.past[node].pop())
        } else {
          this.future[node] = [this.past[node].pop()];
        }
      }
    });
  }

  reset(nodes){
    nodes.forEach ( (node) => {
      if (node in this.future) {
        if (node in this.past) {
          this.past[node].push(this.future[node].shift())
        } else {
          this.past[node] = [this.future[node].shift()];
        }
      }
    });
  }

  seePast(node){
    return this.past[node][this.past[node].length - 1];
  }

  seeFuture(node){
    return this.future[node][0];
  }

}


class Re$et {
  constructor(nodes){
    this.nodes = nodes;
  }

  html(html, track){
    if(string === undefined){
      return this.nodes[0].innerHTML;
    } else {
      if (track !== false){
        r$memory.set(this.nodes, "html", {
          oldHtml: this.nodes[0].innerHTML,
          newHtml: html
        });
      }
      for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].innerHTML = html;
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

  attr(attribute, value){
    if (value){
      for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].setAttribute(attribute, value);
      }
    } else {
      return this.nodes[0].getAttribute(attribute);
    }

  }

  addClass(className, track){
    if (track !== false) {
      r$memory.set(this.nodes, 'addClass', {className: className});
    }
    for (let i = 0; i < this.nodes.length; i++) {
      const classes = this.nodes[i].className.split(" ");
      classes.push(className);
      this.nodes[i].setAttribute('class', classes.join(' '));
    }
  }

  removeClass(className, track){
    if (track !== false) {
      r$memory.set(this.nodes, 'removeClass', {className: className});
    }
    for (let i = 0; i < this.nodes.length; i++) {
      const classes = this.nodes[i].className.split(" ");
      const index = classes.indexOf(className);
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
    } else {
      for (let j = 0; j < this.nodes.length; j++) {
        const listeners = this.nodes[j].listeners;
        for (let i = 0; i < listeners[type].length; i++) {
          this.nodes[j].removeEventListener(type, listeners[type][i]);
        }
        listeners[type] = [];
      }
    }
  }

  undo() {
    this.nodes.forEach( (node) => {
      const last = r$memory.seePast(node);
      switch(last.action) {

        case "addClass":
          r$(node).removeClass(last.parameters.className, false);
          break;

        case "removeClass":
          r$(node).addClass(last.parameters.className, false);
          break;

        case "html":
          r$(node).html()

        default:
          break;
      }
    })
    r$memory.unset(this.nodes)
  }

  redo(){
    this.nodes.forEach( (node) => {
      const last = r$memory.seeFuture(node);
      switch(last.action) {

        case "addClass":
          r$(node).addClass(last.parameters.className, false);
          break;

        case "removeClass":
          r$(node).removeClass(last.parameters.className, false);
          break;

        default:
          break;
      }
    });
    r$memory.reset(this.nodes)
  }

  undoAll(){
    this.nodes.forEach( (node) => {
      while(r$memory.past[node].length > 0) {
        r$(node).undo();
      }
    });
  }

  redoAll(){
    this.nodes.forEach( (node) => {
      while(r$memory.future[node].length > 0) {
        r$(node).redo();
      }
    });
  }

}

R$ = {};
R$.Re$et = Re$et;
R$.Re$etMemory = Re$etMemory;

module.exports = R$;
