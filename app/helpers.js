// SPEECH SYNTHESIS SETUP
var voicesReady = false;
window.speechSynthesis.onvoiceschanged = function() {
  voicesReady = true;
  // Uncomment to see a list of voices
  //console.log("Choose a voice:\n" + window.speechSynthesis.getVoices().map(function(v,i) { return i + ": " + v.name; }).join("\n"));
};

var generateSpeech = function(message, callback) {
  if (voicesReady) {
    var msg = new SpeechSynthesisUtterance();
    msg.voice = window.speechSynthesis.getVoices()[VOICEINDEX];
    msg.text = message;
    msg.rate = 0.2;
    if (typeof callback !== "undefined")
      msg.onend = callback;
    speechSynthesis.speak(msg);
  }
};

// getIntersectingDrum(screenPosition)
//    Returns the drum enclosing the input screen position
// Input:
//    screenPosition = [x,y]
// Output:
//    drum = object, if intersecting the board
//    false, if not intersecting the board

var getIntersectingDrum = function(screenPosition, palmVelocity, handCursor, isLeft) {
  if (palmVelocity[1] < 0 && Math.abs(palmVelocity[1]) > 200) { // && Math.abs(palmVelocity[0]) < 5 && Math.abs(palmVelocity[2]) < 5
    // if hit the bongo1 drum
    var screenX = screenPosition[0];
    var screenY = screenPosition[1];
    if (getDistance([screenX, screenY], [drums['bongo1']['centerX'], drums['bongo1']['centerY']]) <= BONGOSIZE1/2) {
      if (isLeft) {
        handCursor.setProperties({'background': 'lightblue'});
      } else {
        handCursor.setProperties({'background': 'pink'});
      }
      var drum = drums['bongo1'];
      return drum;
    }

    // if hit bongo2 drum
    else if (getDistance([screenX, screenY], [drums['bongo2']['centerX'], drums['bongo2']['centerY']]) <= BONGOSIZE2/2) {
      if (isLeft) {
        handCursor.setProperties({'background': 'lightblue'});
      } else {
        handCursor.setProperties({'background': 'pink'});
      }
      var drum = drums['bongo2'];
      return drum;
    }

    else {
      return false;
    }


    // if (screenPosition[0] >= gridOrigin[0] && screenPosition[0] <= gridOrigin[0] + BOARDSIZE
    //   && screenPosition[1] >= gridOrigin[1] && screenPosition[1] <= gridOrigin[1] + BOARDSIZE) {
    //   if (screenPosition[0] >= gridOrigin[0] + BOARDSIZE/2 && screenPosition[0] <= gridOrigin[0] + BOARDSIZE/2 + SNARESIZE
    //     && screenPosition[1] >= gridOrigin[1] + BOARDSIZE/2 && screenPosition[1] <= gridOrigin[1] + BOARDSIZE/2 + SNARESIZE) {
    //     handCursor.setProperties({'background': 'white'});
    //     var drum = drums['snare1'];
    //     return drum;
    //   }
    //   else {
    //     return false;
    //   }
    // }
    // else {
    //   return false;
    // }


  }
  else {
    return false;
  }
};

// gets Distance between two center points
var getDistance = function(point1, point2) {
  return Math.sqrt(Math.pow(point2[1] - point1[1], 2) + Math.pow(point2[0] - point1[0], 2))
}

// getIntersectingShipAndOffset(screenPosition)
//    Returns the ship enclosing the input screen position
// Input:
//    screenPosition = [x,y]
// Output:
//    shipInfo = {ship: Ship, offset: [x,y]}, if intersecting ships
//        where ship is a Ship model
//        and offset is the grab offset -- the delta between the screen position and ship origin
//    false, if not intersecting any ships
var getIntersectingShipAndOffset = function(screenPosition) {
  var intersectShip = false;
  playerBoard.get('ships').forEach(function(ship) {
    var shipOrigin = ship.get('screenPosition');
    if (ship.get('isVertical')) {
      var bbox = {
        x1: shipOrigin[0],
        x2: shipOrigin[0] + TILESIZE,
        y1: shipOrigin[1],
        y2: shipOrigin[1] + ship.get('length') * TILESIZE
      };
    } else {
      var bbox = {
        x1: shipOrigin[0],
        x2: shipOrigin[0] + ship.get('length') * TILESIZE,
        y1: shipOrigin[1],
        y2: shipOrigin[1] + TILESIZE
      };
    }
    if (bbox.x1 <= screenPosition[0] && bbox.x2 >= screenPosition[0]
    && bbox.y1 <= screenPosition[1] && bbox.y2 >= screenPosition[1]) {
      intersectShip = ship;
    }
  });

  if (intersectShip) {
    var shipPosition = intersectShip.get('screenPosition');
    var offset = [screenPosition[0] - shipPosition[0],
                  screenPosition[1] - shipPosition[1]];
    return {ship: intersectShip, offset: offset};
  } else {
    return false;
  }
}

// clearDrums()
//    Clears all highlighting from the drums
var clearDrums = function() {
  for (type in drums) {
    drum = drums[type];
    drum.surface.setProperties({backgroundColor: Colors.GREY});
  };
};

// highlightTile(position, color)
//    Highlights a tile with a particular color
// Input:
//    position = {row: r, col: c}, tilePosition
//    color = color hex code (see Colors at top of file)
var registerHit = function(drum, color) {
  drum.surface.setProperties({backgroundColor: color});
  if (!drum.played) {
    document.getElementById(drum.type).play();
    drum.played = true;
    return true;
  } else {
    return false;
  }
};

var playDrum = function(drum, color) {
  drum.surface.setProperties({backgroundColor: color});
  document.getElementById(drum.type).play();
  setTimeout(clearDrums, 200);
}

// unblinkTiles()
//    Clears all blinking from the tiles
var unblinkTiles = function() {
  tileModifiers.forEach(function(modifier) {
    modifier.opacityFrom(1);
  });
};

// blinkTile(position)
//    Causes a tile to blink
// Input: position = {row: r, col: c}, tilePosition
var blinkTile = function(position) {
  var angle = 0;
  tileModifiers[position.row*NUMTILES + position.col].opacityFrom(function() {
    angle += 0.1;
    return Math.cos(angle);
  });
};

// nextTurn()
//    Moves the game state to the next turn after TURNDELAY ms
var nextTurn = function() {
  setTimeout(gameState.nextTurn, TURNDELAY);
};

// placeShip(ship)
//    Deploys a ship to the player board, based on its current screen position
var placeShip = function(ship) {
  // First, snap rotation to vert / horiz
  ship.snapRotation();

  // Get the ship origin
  var screenOrigin = ship.getScreenOrigin();
  screenOrigin[0] += TILESIZE / 2;
  screenOrigin[1] += TILESIZE / 2;

  // Find the ship's origin in board coordinates
  var boardPosition = getIntersectingTile(screenOrigin);
  if (!boardPosition) {
    ship.resetShip();
    return;
  }
  ship.setBoardPosition(boardPosition);

  // Snap to grid
  var snappedPosition = getSnappedScreenPosition(boardPosition);
  ship.setScreenPosition(snappedPosition);
  
  // Try deploying ship
  var success = playerBoard.deployShip(ship);
  if (! success)
    ship.resetShip();
};

var getSnappedScreenPosition = function(boardPosition) {
  var screenPosition = gridOrigin.slice(0);
  screenPosition[0] += boardPosition.col * TILESIZE;
  screenPosition[1] += boardPosition.row * TILESIZE;
  return screenPosition;
};
