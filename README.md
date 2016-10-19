## Re$et

### About

Re$et is a lightweight DOM-manipulation library that extends traditional
libraries (like jQuery) by keeping track of all DOM changes and allowing
users to undo/redo.

### DOM Traversals

#### parent()
Selects the currently selected nodes' immediate parents.

#### children()
Selects the currently selected nodes' immediate children.

#### allChildren()
Selects the currently selected nodes' nested children.

#### find(selector)
Selects the currently selected nodes' nested children matching the selector.

### Irreversible DOM Operations

#### #outer(html)

#### #remove

#### #append

### Reversible DOM Operations

#### #addClass

#### #removeClass

#### #html

#### #attr

### Undo / Redo
The Re$et library attaches an object r$memory to the window. This object contains
a hash that maps each DOM element to a list of all operations performed on
that element. Calling undo() on a Re$et object will undo the most recent
operation for all selected nodes.

```html
<div class="container">
</div>
```

```javascript
r$(".container").addClass("new-class");
// r$(".container").attr('class') --> "new-class"
r$(".container").undo();
// r$(".container").attr('class') --> ""
```

Calling undoAll() will return each selected node to it's original state.

```javascript
r$(".container").addClass("class1");
r$(".container").addClass("class2");
r$(".container").addClass("class3");
// r$(".container").attr('class') --> "class1 class2 class3"
r$(".container").undoAll();
// r$(".container").attr('class') --> ""
```

redo() will reverse any undo() calls

Similarly redoAll() will reverse all undo() calls



### Event Listeners

### AJAX
