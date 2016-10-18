## Re$et

### About

Re$et is a lightweight DOM-manipulation library that extends traditional
libraries (like jQuery) by keeping track of all DOM changes and allowing
users to undo/redo.

### DOM Traversal

### DOM Operation

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



### Event Listeners

### AJAX
