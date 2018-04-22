// Import Famo.us dependencies
var Engine = famous.core.Engine;
var Modifier = famous.core.Modifier;
var Transform = famous.core.Transform;
var Surface = famous.core.Surface;
var ImageSurface = famous.surfaces.ImageSurface;
var StateModifier = famous.modifiers.StateModifier;
var Draggable = famous.modifiers.Draggable;
var GridLayout = famous.views.GridLayout;

var tiles = [];
var drums = new Object();
var tileModifiers = [];
drumModifiers = [];
var gridOrigin = [265, 35];

var background;

// USER INTERFACE SETUP
var setupUserInterface = function() {
  var mainContext = Engine.createContext();
  background = new Surface({
    content: "<h1>PerfectBeats</h1>",
    properties: {
      backgroundColor: "rgb(34, 34, 34)",
      color: "white",
      textAlign: "center"
    }
  });
  mainContext.add(background);

  // Draw the drums
  var snare1 = new Surface({
    size: [SNARESIZE, SNARESIZE],
    properties: {
      backgroundColor: Colors.GREY,
      color: "white",
      border: "solid 1px black"
      // borderRadius: SNARESIZE/2 + 'px'
    }
  });
  var snareTransformModifier = new StateModifier({
    transform: Transform.translate(gridOrigin[0] + BOARDSIZE/2, gridOrigin[1] + BOARDSIZE/2, 0)
  });
  var snareModifier = new Modifier({
    opacity: 1.0
  });
  mainContext.add(snareTransformModifier).add(snareModifier).add(snare1);
  drums['snare1'] = { surface: snare1, type: 'snare1', played: false };
  drumModifiers.push(snareModifier);

  // Draw the cursor
  var leftCursorSurface = new Surface({
    size : [CURSORSIZE, CURSORSIZE],
    properties : {
        background: 'none',
        borderRadius: CURSORSIZE/2 + 'px',
        pointerEvents : 'none',
        zIndex: 1
    },
    content: '<img id="left-cursor-img" src="img/blueDot.png" height="25">'
  });
  // var cursorOriginModifier = new StateModifier({origin: [0.5, 0.5]});
  var leftCursorTranslateModifier = new Modifier({
    transform : function(){
      var cursorPosition = this.get('screenPosition');
      return Transform.translate(cursorPosition[0], cursorPosition[1], 0);
    }.bind(leftCursor)
  });

  var leftCursorRotateModifier = new Modifier({
    origin: [0, 0],
    transform : function(){
      var cursorRotation = this.get('screenRotation');
      return Transform.rotateZ(cursorRotation);
    }.bind(leftCursor)
  });

  var rightCursorSurface = new Surface({
    size : [CURSORSIZE, CURSORSIZE],
    properties : {
        background: 'none',
        borderRadius: CURSORSIZE/2 + 'px',
        pointerEvents : 'none',
        zIndex: 1
    },
    content: '<img id="right-cursor-img" src="img/blueDot.png" height="25">'
  });

  var rightCursorTranslateModifier = new Modifier({
    transform : function(){
      var cursorPosition = this.get('screenPosition');
      return Transform.translate(cursorPosition[0], cursorPosition[1], 0);
    }.bind(rightCursor)
  });

  var rightCursorRotateModifier = new Modifier({
    origin: [0, 0],
    transform : function(){
      var cursorRotation = this.get('screenRotation');
      return Transform.rotateZ(cursorRotation);
    }.bind(rightCursor)
  });

  mainContext.add(leftCursorTranslateModifier).add(leftCursorRotateModifier).add(leftCursorSurface);
  mainContext.add(rightCursorTranslateModifier).add(rightCursorRotateModifier).add(rightCursorSurface);
};
