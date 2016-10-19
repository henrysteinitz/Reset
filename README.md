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

#### #outer([html])
Calling this method without an argument will return the outer html of the first
selected node. Passing in a string will replace each nodes' outer html with the
passed string.

#### #remove
Removes the selected nodes from the DOM.

#### #append


### Reversible DOM Operations
Passing a final argument of "false" to any of the following methods will prevent 
the the operation from being saved to memory for reversion.

#### #addClass(className, [track])
Adds the passed class name to the selected elements list of classes

#### #removeClass(className, [track])
Removes the passed class name from the selected elements list of classes.

#### #html([html], [track])

#### #attr(attribute, value, [track])

### Reversions
The Re$et library attaches an object r$memory to the window. This object contains
a hash that maps each DOM element to a list of all operations performed on
that element.

#### undo()
Calling undo() on a Re$et object will undo the most recent operation for
all selected nodes.

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

#### undoAll()
Calling undoAll() will undo all reversible operations.

```javascript
r$(".container").addClass("class1");
r$(".container").addClass("class2");
r$(".container").addClass("class3");
// r$(".container").attr('class') --> "class1 class2 class3"
r$(".container").undoAll();
// r$(".container").attr('class') --> ""
```
#### redo()
Calling redo() will reverse one undo() call.

#### redoAll()
Similarly redoAll() will reverse all undo() calls


### Event Listeners

### AJAX
