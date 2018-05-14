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
// TODO: change function to allow for different parts of the drum to intersect
var getIntersectingDrum = function(screenPosition, palmVelocity, handCursor, isLeft, currentDrum) {
  if (palmVelocity[1] < 0 && Math.abs(palmVelocity[1]) > 200) { // && Math.abs(palmVelocity[0]) < 5 && Math.abs(palmVelocity[2]) < 5
    // if hit the bongo1 drum
    var screenX = screenPosition[0];
    var screenY = screenPosition[1];
    // console.log("HERE");
    for (var i=0; i<currentDrums.length; i++) {
      var currentDrum = currentDrums[i];
      // console.log(currentDrum);
      // console.log(currentDrum['centerX']);
      // console.log(currentDrum['centerY']);
      var distance = getDistance([screenX, screenY], [currentDrum['centerX'], currentDrum['centerY']]);
      // console.log('distance '+distance);
      if (distance >= currentDrum['innerRadius'] && distance <= currentDrum['outerRadius']) {
        // console.log("HIT");
        if (isLeft) {
          handCursor.setProperties({'background': 'lightblue'});
        } else {
          handCursor.setProperties({'background': 'pink'});
        }
        var drum = currentDrum;
        // volume = Math.abs(palmVelocity[1]);
        volume = Math.min( Math.abs(palmVelocity[1]), 1200); // range is 200-1200
        volume = volume - 200;
        volume = volume/1000.0;
        // console.log(palmVelocity[1]);
        // console.log(volume);
        return drum;
      }
      // console.log(drums[drum]);
      
      // console.log(drums[drum]);
    }

    if (isLeft) {
      handCursor.setProperties({'background': 'royalblue'});
    } else {
      handCursor.setProperties({'background': 'purple'});
    }
    return false;

    // if (getDistance([screenX, screenY], [drums['bongo1']['centerX'], drums['bongo1']['centerY']]) <= BONGOSIZE1/2) {
    //   if (isLeft) {
    //     handCursor.setProperties({'background': 'lightblue'});
    //   } else {
    //     handCursor.setProperties({'background': 'pink'});
    //   }
    //   var drum = drums['bongo1'];
    //   return drum;
    // }

    // // if hit bongo2 drum
    // else if (getDistance([screenX, screenY], [drums['bongo2']['centerX'], drums['bongo2']['centerY']]) <= BONGOSIZE2/2) {
    //   if (isLeft) {
    //     handCursor.setProperties({'background': 'lightblue'});
    //   } else {
    //     handCursor.setProperties({'background': 'pink'});
    //   }
    //   var drum = drums['bongo2'];
    //   return drum;
    // }

    // else {
    //   if (isLeft) {
    //     handCursor.setProperties({'background': 'royalblue'});
    //   } else {
    //     handCursor.setProperties({'background': 'purple'});
    //   }
    //   return false;
    // }


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
    if (isLeft) {
        handCursor.setProperties({'background': 'royalblue'});
      } else {
        handCursor.setProperties({'background': 'purple'});
      }
    return false;
  }
};

// gets Distance between two center points
var getDistance = function(point1, point2) {
  return Math.sqrt(Math.pow(point2[1] - point1[1], 2) + Math.pow(point2[0] - point1[0], 2))
}

// clearDrums()
//    Clears all highlighting from the drums
var clearDrums = function() {
  for (type in drums) {
    drum = drums[type];
    drum.surface.setProperties({backgroundColor: Colors.GREY});
  };
};

// registerHit(drum, color)
//    Highlights a drum with a particular color and plays the drum's sound
// Input:
//    drum
//    color = color hex code (see Colors at top of file)
var registerHit = function(drum, color) {
  drum.surface.setProperties({backgroundColor: color});
  if (!drum.played) {
    // console.log(volume);
    document.getElementById(drum.type).volume = volume;
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

var getSnappedScreenPosition = function(boardPosition) {
  var screenPosition = gridOrigin.slice(0);
  screenPosition[0] += boardPosition.col * TILESIZE;
  screenPosition[1] += boardPosition.row * TILESIZE;
  return screenPosition;
};
