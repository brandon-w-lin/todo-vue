new Sortable(el, {
  // name: String — group name
  // pull: true|false|["foo", "bar"]|'clone'|function — ability to move from the list. clone — copy the item, rather than move. Or an array of group names which the elements may be put in. Defaults to true.
  // put: true|false|["baz", "qux"]|function — whether elements can be added from other lists, or an array of group names from which elements can be added.
  // revertClone: boolean — revert cloned element to initial position after moving to a another list.
  group: "name",  // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
  // enable sorting
  sort: true,  
  // time to wait before the sorting should start
  delay: 0
  // enable delay on touch
  delayOnTouchOnly: false,
  // how many pixels the point should move before cancelling a delayed drag event
  touchStartThreshold: 0, 
  // disables the sortable if set to true.
  disabled: false, 
  // which items inside the element should be draggable
  draggable: '>*'
  // save and restore the sort.
  store: null,
  // animation speed
  animation: 0,
  // easing function: "cubic-bezier(1, 0, 0, 1)"
  easing: null, 
  // drag handle
  handle: ".my-handle",
  // elements to ignore
  ignore: 'a, img',
  // filter selector
  filter: ".ignore-elements", 
  // preverntDefault when filtering
  preventOnFilter: true,
  // drop placeholder
  ghostClass: "sortable-ghost",
  // chosen class
  chosenClass: "sortable-chosen",
  // dragging class
  dragClass: "sortable-drag",
  // default data attribute
  dataIdAttr: 'data-id',
  // enable drop bubble
  dropBubble: false,
  // threshold of the swap zone
  swapThreshold: 1,
  // invert swap
  invertSwap: false,
  // threshold of the inverted swap zone
  invertedSwapThreshold: 1,
  // will be detected automatically if not given
  direction: 'horizontal',
  // ignore the HTML5 DnD behaviour
  forceFallback: false,
  // fallback class
  fallbackClass: "sortable-fallback",
  // appends the cloned DOM Element into the document body
  fallbackOnBody: false,  
  // how far the mouse should move before it's considered as a drag.
  fallbackTolerance: 0, 
  // fallback offsets
  fallbackOffset: {
      x: 0,
      y: 0
  },
  dragoverBubble: false,
  // remove the cloned element when it is not showing
  removeCloneOnHide: true, 
  // distance mouse must be from empty sortable to insert drag element into it
  emptyInsertThreshold: 5, // px, 
  // set data
  setData: function (/** DataTransfer */dataTransfer, /** HTMLElement*/dragEl) {
    dataTransfer.setData('Text', dragEl.textContent); // `dataTransfer` object of HTML5 DragEvent
  },
  // scroll plugin options
  // Enable the plugin. Can be HTMLElement.
  scroll: true, 
  // if you have custom scrollbar scrollFn may be used for autoscrolling
  scrollFn: function(offsetX, offsetY, originalEvent, touchEvt, hoverTargetEl) { ... }, 
  // px, how near the mouse must be to an edge to start scrolling.
  scrollSensitivity: 30, 
  // force auto scroll fallback
  forceAutoScrollFallback: false,
  // px, speed of the scrolling
  scrollSpeed: 10, 
  // apply autoscroll to all parent elements, allowing for easier movement
  bubbleScroll: true,
  // OnSpill Plugin options
  // Enable plugin
  revertOnSpill: true, 
  // Called when item is spilled
  onSpill: function(/**Event*/evt) {
    evt.item // The spilled item
  },
  // MultiDrag Plugin options
  // Enable the plugin
  multiDrag: true, 
  // Class name for selected item
  selectedClass: "sortable-selected", 
  // Key that must be down for items to be selected
  multiDragKey: null, 
  // Called when an item is selected
  onSelect: function(/**Event*/evt) {
    evt.item // The selected item
  },
  // Called when an item is deselected
  onDeselect: function(/**Event*/evt) {
    evt.item // The deselected item
  },
  // Swap Plugin options
  // Enable swap mode
  swap: true, 
  // Class name for swap item (if swap mode is enabled)
  swapClass: "sortable-swap-highlight",
  
});