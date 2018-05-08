// Import Famo.us dependencies
var Engine = famous.core.Engine;
var Modifier = famous.core.Modifier;
var Transform = famous.core.Transform;
var Surface = famous.core.Surface;
var ImageSurface = famous.surfaces.ImageSurface;
var StateModifier = famous.modifiers.StateModifier;
var Draggable = famous.modifiers.Draggable;
var GridLayout = famous.views.GridLayout;

var drums = new Object();
var drumModifiers = [];
var gridOrigin = [$(window).width() / 2, $(window).height() / 2];

var background;
var rightCursorSurface;
var leftCursorSurface;
var otherFeedback;
var distanceBetween = 20;

//drums
var bongo1;
var bongo2;
var conga1;
var conga2;
var djembe;

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
  bongo1 = new Surface({
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
    transform: Transform.translate(gridOrigin[0]+distanceBetween/2 + BONGOX, gridOrigin[1] - BONGOSIZE1/2 + BONGOY, 0)
  });

  bongo2 = new Surface({
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
    transform: Transform.translate(gridOrigin[0] - BONGOSIZE2 - distanceBetween/2 + BONGOX, gridOrigin[1] - BONGOSIZE2/2 + BONGOY, 0)
  });  

  conga1 = new Surface({
    size: [CONGASIZE1, CONGASIZE1],
    properties: {
      backgroundColor: Colors.GREY,
      color: "white",
      border: "solid 1px black",
      borderRadius: CONGASIZE1/2 + 'px',
      // display: "none"
    },
    content: '<img id="left-cursor-img" src="img/conga-top.png" height="'+CONGASIZE1+'">'
  });
  var conga1TransformModifier = new StateModifier({
    transform: Transform.translate(gridOrigin[0] + distanceBetween/2 + CONGAX, gridOrigin[1] - CONGASIZE1/2 + CONGAY, 0)
  }); 

  conga2 = new Surface({
    size: [CONGASIZE2, CONGASIZE2],
    properties: {
      backgroundColor: Colors.GREY,
      color: "white",
      border: "solid 1px black",
      borderRadius: CONGASIZE2/2 + 'px',
      // display: "none"
    },
    content: '<img id="left-cursor-img" src="img/conga-top.png" height="'+CONGASIZE2+'">'
  });
  var conga2TransformModifier = new StateModifier({
    transform: Transform.translate(gridOrigin[0] - CONGASIZE2 - distanceBetween/2 + CONGAX, gridOrigin[1] - CONGASIZE2/2 + CONGAY, 0)
  }); 

  djembe = new Surface({
    size: [DJEMBESIZE, DJEMBESIZE],
    properties: {
      backgroundColor: Colors.GREY,
      color: "white",
      border: "solid 1px black",
      borderRadius: DJEMBESIZE/2 + 'px',
      // display: "none"
    },
    content: '<img id="left-cursor-img" src="img/djembe-top.png" height="'+DJEMBESIZE+'">'
  });
  var djembeTransformModifier = new StateModifier({
    transform: Transform.translate(gridOrigin[0] - DJEMBESIZE/2 + DJEMBEX, gridOrigin[1] - DJEMBESIZE/2 + DJEMBEY, 0)
  }); 

  // var bongoModifier = new Modifier({
  //   opacity: 1.0
  // });
  mainContext.add(bongo1TransformModifier).add(bongo1);
  mainContext.add(bongo2TransformModifier).add(bongo2);
  mainContext.add(conga1TransformModifier).add(conga1);
  mainContext.add(conga2TransformModifier).add(conga2);
  mainContext.add(djembeTransformModifier).add(djembe);

  drums['bongo1'] = { drumType: 'bongo', surface: bongo1, type: 'bongo-low', played: false, innerRadius: 0, outerRadius: BONGOSIZE1/2, centerX: gridOrigin[0]+BONGOSIZE1/2 + distanceBetween/2 + BONGOX, centerY: gridOrigin[1] + BONGOY};
  drums['bongo2'] = { drumType: 'bongo', surface: bongo2, type: 'bongo-high', played: false, innerRadius: 0, outerRadius: BONGOSIZE2/2, centerX: gridOrigin[0]-BONGOSIZE2/2 - distanceBetween/2 + BONGOX, centerY: gridOrigin[1] + BONGOY};
  // TODO: Do Change the type and radius to account for the different conga sounds
  drums['conga1-bass'] = { drumType: 'conga', surface: conga1, type: 'conga-bass', played: false, innerRadius: 0, outerRadius: CONGASIZE1/2 * BASS_RATIO, centerX: gridOrigin[0]+CONGASIZE1/2 + distanceBetween/2 + CONGAX, centerY: gridOrigin[1] + CONGAY};
  drums['conga2-bass'] = { drumType: 'conga', surface: conga2, type: 'conga-bass', played: false, innerRadius: 0, outerRadius: CONGASIZE2/2 * BASS_RATIO, centerX: gridOrigin[0]-CONGASIZE2/2 - distanceBetween/2 + CONGAX, centerY: gridOrigin[1] + CONGAY};

  drums['conga1-tone'] = { drumType: 'conga', surface: conga1, type: 'conga-tone', played: false, innerRadius: CONGASIZE1/2 * BASS_RATIO, outerRadius: CONGASIZE1/2, centerX: gridOrigin[0]+CONGASIZE1/2 + distanceBetween/2 + CONGAX, centerY: gridOrigin[1] + CONGAY};
  drums['conga2-tone'] = { drumType: 'conga', surface: conga2, type: 'conga-tone', played: false, innerRadius: CONGASIZE2/2 * BASS_RATIO, outerRadius: CONGASIZE2/2, centerX: gridOrigin[0]-CONGASIZE2/2 - distanceBetween/2 + CONGAX, centerY: gridOrigin[1] + CONGAY};
  
  // drums['conga1-muff'] = { surface: conga1, type: 'conga-muff', played: false, radius: CONGASIZE1/2, centerX: gridOrigin[0]+CONGASIZE1/2 + distanceBetween/2, centerY: gridOrigin[1]};
  // drums['conga2-muff'] = { surface: conga2, type: 'conga-muff', played: false, radius: CONGASIZE2/2, centerX: gridOrigin[0]-CONGASIZE2/2 - distanceBetween/2, centerY: gridOrigin[1]};

  // drums['conga1-tip'] = { surface: conga1, type: 'conga-tip', played: false, radius: CONGASIZE1/2, centerX: gridOrigin[0]+CONGASIZE1/2 + distanceBetween/2, centerY: gridOrigin[1]};
  // drums['conga2-tip'] = { surface: conga2, type: 'conga-tip', played: false, radius: CONGASIZE2/2, centerX: gridOrigin[0]-CONGASIZE2/2 - distanceBetween/2, centerY: gridOrigin[1]};

  // drums['conga1-openslap'] = { surface: conga1, type: 'conga-openslap', played: false, radius: CONGASIZE1/2, centerX: gridOrigin[0]+CONGASIZE1/2 + distanceBetween/2, centerY: gridOrigin[1]};
  // drums['conga2-openslap'] = { surface: conga2, type: 'conga-openslap', played: false, radius: CONGASIZE2/2, centerX: gridOrigin[0]-CONGASIZE2/2 - distanceBetween/2, centerY: gridOrigin[1]};

  // drums['conga1-closedslap'] = { surface: conga1, type: 'conga-closedslap', played: false, radius: CONGASIZE1/2, centerX: gridOrigin[0]+CONGASIZE1/2 + distanceBetween/2, centerY: gridOrigin[1]};
  // drums['conga2-closedslap'] = { surface: conga2, type: 'conga-closedslap', played: false, radius: CONGASIZE2/2, centerX: gridOrigin[0]-CONGASIZE2/2 - distanceBetween/2, centerY: gridOrigin[1]};
  
  // drums['conga1-mutedslap'] = { surface: conga1, type: 'conga-mutedslap', played: false, radius: CONGASIZE1/2, centerX: gridOrigin[0]+CONGASIZE1/2 + distanceBetween/2, centerY: gridOrigin[1]};
  // drums['conga2-mutedslap'] = { surface: conga2, type: 'conga-mutedslap', played: false, radius: CONGASIZE2/2, centerX: gridOrigin[0]-CONGASIZE2/2 - distanceBetween/2, centerY: gridOrigin[1]};
  
  drums['djembe-bass'] = { drumType: 'djembe', surface: djembe, type: 'djembe-bass', played: false, innerRadius: 0, outerRadius: DJEMBESIZE/2 * BASS_RATIO, centerX: gridOrigin[0] + DJEMBEX, centerY: gridOrigin[1] + DJEMBEY};
  drums['djembe-tone'] = { drumType: 'djembe', surface: djembe, type: 'djembe-tone', played: false, innerRadius: DJEMBESIZE/2 * BASS_RATIO, outerRadius: DJEMBESIZE/2, centerX: gridOrigin[0] + DJEMBEX, centerY: gridOrigin[1] + DJEMBEY};
  // drumModifiers.push(snareModifier);

  // left cursor
  leftCursorSurface = new Surface({
    size : [CURSORSIZE, CURSORSIZE],
    properties : {
        background: 'royalblue',
        borderRadius: CURSORSIZE/2 + 'px',
        pointerEvents : 'none',
        zIndex: 1
    }
  });

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

  // right cursor
  rightCursorSurface = new Surface({
    size : [CURSORSIZE, CURSORSIZE],
    properties : {
        background: 'purple',
        borderRadius: CURSORSIZE/2 + 'px',
        pointerEvents : 'none',
        zIndex: 1
    }
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

  // Speech output
  otherFeedback = new Surface({
    content: "",
    size: [undefined, 30],
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
