// GAME SETUP
var initialState = "playing";
var state = new State({state: initialState});
var leftCursor = new Cursor();
var rightCursor = new Cursor();

// UI SETUP
setupUserInterface();

// selectedDrum: The drum that the player is currently hovering above
var leftSelectedDrum = false;
var leftMostRecentDrum = false;
var rightSelectedDrum = false;
var rightMostRecentDrum = false;

var leftHand = null;
var rightHand = null;

var maxCursorSize = 150;

var hitHeight = 50;
var hitSequence = [];

// MAIN GAME LOOP
// Called every time the Leap provides a new frame of data
Leap.loop({ frame: function(frame) {
  if (frame.hands.length > 0) {
    // Clear any highlighting at the beginning of the loop
    clearDrums();
    
    for (var h=0; h < frame.hands.length; h++) {
      hand = frame.hands[h];
      if (hand.type == 'left') {
        leftHand = hand;
      } else {
        rightHand = hand;
      }

      // -650 : 200, value+650/800
      if (leftHand != null) {
        var leftCursorPosition = [leftHand.screenPosition()[0]+50, leftHand.screenPosition()[2]+300];
        var leftSize = (1-(leftHand.screenPosition()[1]+600)/1200)*maxCursorSize
        leftCursor.setScreenPosition(leftCursorPosition);
        if (leftSize <= hitHeight) {
          leftCursorSurface.setProperties({'borderRadius': hitHeight/2+'px'});//'background': 'lightblue', 
          leftCursorSurface.setSize([hitHeight, hitHeight])
          var leftPalmVelocity = leftHand.palmVelocity;
          leftSelectedDrum = getIntersectingDrum(leftCursorPosition, leftPalmVelocity, leftCursorSurface, true);
        } else {
          leftCursorSurface.setProperties({'background': 'royalblue', 'borderRadius': leftSize/2+'px'});
          leftCursorSurface.setSize([leftSize, leftSize])
        }

        if (leftSelectedDrum != false) {
          var leftHit = registerHit(leftSelectedDrum, Colors.YELLOW);
          if (state.get('state') == 'recording') {
            if (leftHit) {
              hitSequence.push([leftSelectedDrum, Date.now()]);
            }
          }
          leftMostRecentDrum = leftSelectedDrum;
        } else {
          leftMostRecentDrum.played = false;
          leftSelectedDrum.played = false;
        }
      }

      if (rightHand != null) {
        var rightCursorPosition = [rightHand.screenPosition()[0]+50, rightHand.screenPosition()[2]+300];
        var rightSize = (1-(rightHand.screenPosition()[1]+600)/1200)*maxCursorSize
        rightCursor.setScreenPosition(rightCursorPosition);

        if (rightSize <= hitHeight) {
          rightCursorSurface.setProperties({'borderRadius': hitHeight/2+'px'});//'background': 'pink', 
          rightCursorSurface.setSize([hitHeight, hitHeight])

          var rightPalmVelocity = rightHand.palmVelocity;

          rightSelectedDrum = getIntersectingDrum(rightCursorPosition, rightPalmVelocity, rightCursorSurface, false);
        } else {
          rightCursorSurface.setProperties({'background': 'purple', 'borderRadius': rightSize/2+'px'});
          rightCursorSurface.setSize([rightSize, rightSize])
        }
      
        if (rightSelectedDrum != false) {
          var rightHit = registerHit(rightSelectedDrum, Colors.YELLOW);
          if (state.get('state') == 'recording') {
            if (rightHit) {
              hitSequence.push([rightSelectedDrum, Date.now()]);
            }
          }
          rightMostRecentDrum = rightSelectedDrum;
        } else {
          rightMostRecentDrum.played = false;
          rightSelectedDrum.played = false;
        }
      }
    }
  }
}}).use('screenPosition', {scale: LEAPSCALE});

// processSpeech(transcript)
//  Is called anytime speech is recognized by the Web Speech API
// Input: 
//    transcript, a string of possibly multiple words that were recognized
// Output: 
//    processed, a boolean indicating whether the system reacted to the speech or not
var processSpeech = function(transcript) {
  // Helper function to detect if any commands appear in a string
  var userSaid = function(str, commands) {
    for (var i = 0; i < commands.length; i++) {
      if (str.indexOf(commands[i]) > -1)
        return true;
    }
    return false;
  };

  var processed = false;
  if (state.get('state') == 'playing') {
    if (userSaid(transcript, ['record'])) {
      state.startRecording();
      hitSequence = [];
      return true;
    }
    else if (userSaid(transcript, ['play'])) {
      state.startPlayback();
      var start = hitSequence[0][1];
      for (var i=0; i < hitSequence.length; i++) {
        (function(i) {
          setTimeout(function() {
            var drum = hitSequence[i][0];
            playDrum(drum, Colors.BLUE);
          }, hitSequence[i][1] - start);
        })(i);
      }
      state.endPlayback();
      return true;
    }
  } 
  else if (state.get('state') == 'recording') {
    if (userSaid(transcript, ['stop'])) {
      state.stopRecording(hitSequence);
      return true;
    } 
  }

  return processed;
};
