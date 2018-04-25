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
var drumModifiers = [];
var gridOrigin = [$(window).width() / 2, $(window).height() / 2];

var background;
var rightCursorSurface;
var leftCursorSurface;
var otherFeedback;
var distanceBetween = 150;

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
  var bongo1 = new Surface({
    size: [BONGOSIZE1, BONGOSIZE1],
    properties: {
      backgroundColor: Colors.GREY,
      color: "white",
      border: "solid 1px black",
      borderRadius: BONGOSIZE1/2 + 'px'
    },
    content: '<img id="left-cursor-img" src="img/bongo-top.png" height="'+BONGOSIZE1+'">'
  });
  var bongo1TransformModifier = new StateModifier({
    transform: Transform.translate(gridOrigin[0]+distanceBetween/2, gridOrigin[1] - BONGOSIZE1/2, 0)
  });

  var bongo2 = new Surface({
    size: [BONGOSIZE2, BONGOSIZE2],
    properties: {
      backgroundColor: Colors.GREY,
      color: "white",
      border: "solid 1px black",
      borderRadius: BONGOSIZE2/2 + 'px'
    },
    content: '<img id="left-cursor-img" src="img/bongo-top.png" height="'+BONGOSIZE2+'">'
  });
  var bongo2TransformModifier = new StateModifier({
    transform: Transform.translate(gridOrigin[0] - BONGOSIZE2 - distanceBetween/2, gridOrigin[1] - BONGOSIZE2/2, 0)
  });  

  var conga1 = new Surface({
    size: [CONGASIZE1, CONGASIZE1],
    properties: {
      backgroundColor: Colors.GREY,
      color: "white",
      border: "solid 1px black",
      borderRadius: CONGASIZE1/2 + 'px'
    },
    content: '<img id="left-cursor-img" src="img/conga-top.png" height="'+CONGASIZE1+'">'
  });
  var conga1TransformModifier = new StateModifier({
    transform: Transform.translate(gridOrigin[0] + distanceBetween/2, gridOrigin[1] - CONGASIZE1/2, 0)
  }); 

  var conga2 = new Surface({
    size: [CONGASIZE2, CONGASIZE2],
    properties: {
      backgroundColor: Colors.GREY,
      color: "white",
      border: "solid 1px black",
      borderRadius: CONGASIZE2/2 + 'px'
    },
    content: '<img id="left-cursor-img" src="img/conga-top.png" height="'+CONGASIZE2+'">'
  });
  var conga2TransformModifier = new StateModifier({
    transform: Transform.translate(gridOrigin[0] - CONGASIZE2 - distanceBetween/2, gridOrigin[1] - CONGASIZE2/2, 0)
  }); 
  // var bongoModifier = new Modifier({
  //   opacity: 1.0
  // });
  mainContext.add(bongo1TransformModifier).add(bongo1);
  mainContext.add(bongo2TransformModifier).add(bongo2);
  mainContext.add(conga1TransformModifier).add(conga1);
  mainContext.add(conga2TransformModifier).add(conga2);
  drums['bongo1'] = { surface: bongo1, type: 'bongo-low', played: false, radius: BONGOSIZE1/2, centerX: gridOrigin[0]+BONGOSIZE1/2 + distanceBetween/2, centerY: gridOrigin[1]};
  drums['bongo2'] = { surface: bongo2, type: 'bongo-high', played: false, radius: BONGOSIZE2/2, centerX: gridOrigin[0]-BONGOSIZE2/2 - distanceBetween/2, centerY: gridOrigin[1]};
  // TODO: Do Change the type and radius to account for the different conga sounds
  drums['conga1'] = { surface: conga1, type: 'bongo-low', played: false, radius: CONGASIZE1/2, centerX: gridOrigin[0]+CONGASIZE1/2 + distanceBetween/2, centerY: gridOrigin[1]};
  drums['conga2'] = { surface: conga2, type: 'bongo-high', played: false, radius: CONGASIZE2/2, centerX: gridOrigin[0]-CONGASIZE2/2 - distanceBetween/2, centerY: gridOrigin[1]};
  // drumModifiers.push(snareModifier);

  // Draw the cursor
  leftCursorSurface = new Surface({
    size : [CURSORSIZE, CURSORSIZE],
    properties : {
        background: 'royalblue',
        borderRadius: CURSORSIZE/2 + 'px',
        pointerEvents : 'none',
        zIndex: 1
    },
    // content: '<img id="left-cursor-img" src="img/blueDot.png" height="25">'
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

  rightCursorSurface = new Surface({
    size : [CURSORSIZE, CURSORSIZE],
    properties : {
        background: 'purple',
        borderRadius: CURSORSIZE/2 + 'px',
        pointerEvents : 'none',
        zIndex: 1
    },
    // content: '<img id="right-cursor-img" src="img/purpleDot.png" height="25">'
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

  // var rightCursorSizeModifier = new Modifier({
  //   transform : function() {
  //     var cursorSize = this.get('cursorSize');
  //     return Transform.scale(cursorSize, cursorSize, cursorSize);
  //   }.bind(rightCursor)
  // });

  mainContext.add(leftCursorTranslateModifier).add(leftCursorRotateModifier).add(leftCursorSurface);
  mainContext.add(rightCursorTranslateModifier).add(rightCursorRotateModifier).add(rightCursorSurface);

  otherFeedback = new Surface({
    content: "",
    size: [undefined, 50],
    properties: {
      backgroundColor: "rgb(34, 34, 34)",
      color: "white"
    }
  });
  var otherModifier = new StateModifier({
    origin: [0.0, 1.0],
    align: [0.0, 1.0]
  })
  mainContext.add(otherModifier).add(otherFeedback);
};
