var Slider = (function() {
  var constructor = function(container) {
    var width = 349
    var height = 37
    
    var headWidth = 40
    var maxHeadX = width - headWidth
    var minHeadX = 0
    
    var base = document.createElement('div')
    base.style.width = width + "px"
    base.style.height = height + "px"
    base.style.background = "white"
    
    var track = document.createElement('div')
    track.style.width = width + "px"
    track.style.height = 6 + "px"
    track.style.position = "relative"
    track.style.top = 25 + "px"
    track.style.border = "1px solid black"
    base.appendChild(track)
    
    var head = document.createElement('div')
    head.style.width = headWidth + "px"
    head.style.height = height + "px"
    head.style.marginBottom = '-' + (height + 2) + "px"
    head.style.position = "relative"
    head.style.border = "1px solid black"
    base.appendChild(head)
    
    var glass = document.createElement('div')
    glass.style.width = width + 2 + "px"
    glass.style.height = height + 2 + "px"
    glass.style.position = "relative"
    glass.style.background = "rgba(100,100,100,0.5)";
    base.appendChild(glass)

    container.appendChild(base)

    //////////////////////////////////////////////////////////////
    // mouse
    
    glass.onmousedown = function (e) {
      e.preventDefault()
      var pos = getEventRelPos(glass, e)
      
      var grabX = headWidth / 2
      var headX = getValue()
      if (pos.x >= headX && pos.x < headX + headWidth) {
          grabX = pos.x - headX
      }
      
      setValue(pos.x - grabX)
    
      var oldMove = document.onmousemove
      document.onmousemove = function (e) {
          var pos = getEventRelPos(glass, e)
          setValue(pos.x - grabX)
      }
      
      var oldUp = document.onmouseup
      document.onmouseup = function (e) {
          document.onmousemove = oldMove
          document.onmouseup = oldUp
      }
    };
    
    //////////////////////////////////////////////////////////////
    // touch
    
    glass.ontouchstart = function (e) {
      e.preventDefault()
      var pos = getEventRelPos(glass, e.touches[0])
    
      var grabX = headWidth / 2
      var headX = getValue()
      if (pos.x >= headX && pos.x < headX + headWidth) {
          grabX = pos.x - headX
      }
    
      setValue(pos.x - grabX)
    
      var oldMove = document.ontouchmove
      document.ontouchmove = function (e) {
          e.preventDefault();
          var pos = getEventRelPos(glass, e.touches[0])
          setValue(pos.x - grabX)
      }
    
      var oldEnd = document.ontouchend;
      var oldCancel = document.ontouchcancel
      document.ontouchend = document.ontouchcancel = function (e) {
          document.ontouchmove = oldMove
          document.ontouchend = oldEnd
          document.ontouchcancel = oldCancel;
      }
    };
    
    //////////////////////////////////////////////////////////////
    // head position

    var getValue = function() {
      return getPos(head).x - getPos(base).x
    };
    
    var setValue = function(newPosition) {
      head.style.left = Math.round(cap(newPosition, minHeadX, maxHeadX)) + "px"
      var event = new CustomEvent('change', {detail: {value: getValue()}});
      container.dispatchEvent(event);
    };

    var getPercentage = function() {
      return getValue() / maxHeadX
    };
    
    var setPercentage = function(newPosition) {
      setValue(newPosition * maxHeadX)
    };
    
    
    //////////////////////////////////////////////////////////////
    // utils
    
    var cap = function(newPosition, minHeadX, maxHeadX) {
      if (newPosition < minHeadX) return minHeadX
      if (newPosition > maxHeadX) return maxHeadX
      return newPosition
    };
    
    var getPos = function(element) {
      var rect = element.getBoundingClientRect();
      return {x : rect.left, y : rect.top}
    };
    
    var getEventRelPos = function(element, event) {
      var rect = element.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      return {x : x, y : x}
    };

    return {
      getPercentage: getPercentage,
      setPercentage: setPercentage,
      getValue: getValue,
      setValue: setValue
    };
  };

  return {
    constructor: constructor
  };
  
}());

