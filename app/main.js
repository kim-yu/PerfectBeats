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

var drumsToObject = {
  'bongo': [drums['bongo1'], drums['bongo2']],
  'conga': [drums['conga1-bass'], drums['conga2-bass'], drums['conga1-tone'], drums['conga2-tone']],
  'djembe': [drums['djembe-bass'], drums['djembe-tone']],
  'all': [drums['bongo1'], drums['bongo2'], drums['conga1-bass'], drums['conga2-bass'], drums['conga1-tone'], drums['conga2-tone'], drums['djembe-bass'], drums['djembe-tone']]
};

var currentDrums = drumsToObject['all'];
var volume = 1.0;

function onSelectChange() {
  var new_drum = document.getElementById("select-drum").value;
  // console.log(new_drum);
  for (drumType in drumsToObject) {
    // console.log(drumType);
    // console.log(drumsToSurface[drumType].length);
    // console.log(drumsToSurface[drumType][0]);
    for (var i=0; i<drumsToObject[drumType].length; i++) {
      // console.log(drumsToSurface[drumType][i]);
      var currentDrum = drumsToObject[drumType][i].surface;
      currentDrum.setProperties({'display': 'none'});
    }
  }

  for (var i=0; i<drumsToObject[new_drum].length; i++) {
    console.log("SelectedDrum");
    var currentDrum = drumsToObject[new_drum][i].surface;
    // console.log(drum);
    currentDrum.setProperties({'display': 'block'});
  }

  currentDrums = drumsToObject[new_drum];
}

// MAIN GAME LOOP
// Called every time the Leap provides a new frame of data
Leap.loop({ frame: function(frame) {
  if (frame.hands.length > 0) {
    // Clear any highlighting at the beginning of the loop
    // clearDrums(); do this in registerHit, otherwise some don't have time to turn yellow

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
        var leftPalmVelocity = leftHand.palmVelocity;

        if (leftSize <= hitHeight) {
          leftCursorSurface.setProperties({'borderRadius': hitHeight/2+'px'});//'background': 'lightblue', 
          leftCursorSurface.setSize([hitHeight, hitHeight])
          // var leftPalmVelocity = leftHand.palmVelocity;
          leftSelectedDrum = getIntersectingDrum(leftCursorPosition, leftPalmVelocity, leftCursorSurface, true);
        } else {
          leftCursorSurface.setProperties({'background': 'royalblue', 'borderRadius': leftSize/2+'px'});
          leftCursorSurface.setSize([leftSize, leftSize])
        }

        if (leftSelectedDrum != false) {
          if (state.get('state') == 'recording') {
            var leftHit = registerHit(leftSelectedDrum, Colors.RED, leftPalmVelocity);
            if (leftHit) {
              hitSequence.push([leftSelectedDrum, Date.now(), leftPalmVelocity[1], volume]);
            }
          } else {
            var leftHit = registerHit(leftSelectedDrum, Colors.YELLOW, leftPalmVelocity[1]);
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
        var rightPalmVelocity = rightHand.palmVelocity;

        if (rightSize <= hitHeight) {
          rightCursorSurface.setProperties({'borderRadius': hitHeight/2+'px'});//'background': 'pink', 
          rightCursorSurface.setSize([hitHeight, hitHeight])

          // var rightPalmVelocity = rightHand.palmVelocity; moved out of here b/c sometimes was undefined

          rightSelectedDrum = getIntersectingDrum(rightCursorPosition, rightPalmVelocity, rightCursorSurface, false);
        } else {
          rightCursorSurface.setProperties({'background': 'purple', 'borderRadius': rightSize/2+'px'});
          rightCursorSurface.setSize([rightSize, rightSize])
        }
      
        if (rightSelectedDrum != false) {
          if (state.get('state') == 'recording') {
            var rightHit = registerHit(rightSelectedDrum, Colors.RED, rightPalmVelocity[1]);
            if (rightHit) {
              hitSequence.push([rightSelectedDrum, Date.now(), rightPalmVelocity[1], volume]);
            }
          } else {
            var rightHit = registerHit(rightSelectedDrum, Colors.YELLOW, rightPalmVelocity[1], volume);
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
    if (userSaid(transcript, ['Beats record', 'beats record'])) {
      state.startRecording();
      hitSequence = [];
      return true;
    }
    else if (userSaid(transcript, ['Beats play', 'beats play'])) {
      state.startPlayback(hitSequence);
      return true;
    }
  } 
  else if (state.get('state') == 'recording') {
    if (userSaid(transcript, ['Beats stop', 'beats stop'])) {
      state.stopRecording(hitSequence);
      return true;
    } 
  }

  return processed;
};
