// GAME SETUP
var initialState = SKIPSETUP ? "playing" : "setup";
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

var maxCursorSize = 100;

var hitHeight = 50;

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

      if (leftHand != null) {
        // TODO: 4.1, Moving the cursor with Leap data
        // Use the hand data to control the cursor's screen position
        var leftCursorPosition = [leftHand.screenPosition()[0]+50, leftHand.screenPosition()[2]+300];
        var leftSize = (1-(leftHand.screenPosition()[1]+600)/1200)*maxCursorSize
        leftCursor.setScreenPosition(leftCursorPosition);
        // -650 : 200, value+650/800
        // console.log(leftSize);
        // $('#left-cursor-img').attr('height', Math.min(Math.abs(1-(leftSize+600)/1200)*maxCursorSize), 100);
        if (leftSize <= hitHeight) {
          leftCursorSurface.setProperties({'borderRadius': hitHeight/2+'px'});//'background': 'lightblue', 
          leftCursorSurface.setSize([hitHeight, hitHeight])
          var leftPalmVelocity = leftHand.palmVelocity;
          leftSelectedDrum = getIntersectingDrum(leftCursorPosition, leftPalmVelocity, leftCursorSurface);
          // console.log(leftCursorSurface.getProperties());
        } else {
          leftCursorSurface.setProperties({'background': 'royalblue', 'borderRadius': leftSize/2+'px'});
          leftCursorSurface.setSize([leftSize, leftSize])
          // console.log(leftCursorSurface.getProperties());
        }

        

        

        // background.setContent("<h1>PerfectBeats</h1>");
        //  Enable the player to grab, move, and rotate the drum stick

        if (leftSelectedDrum != false) {
          registerHit(leftSelectedDrum, Colors.YELLOW);
          leftMostRecentDrum = leftSelectedDrum;
        } else {
          leftMostRecentDrum.played = false;
          leftSelectedDrum.played = false;
        }
      }

      if (rightHand != null) {
        // TODO: 4.1, Moving the cursor with Leap data
        // Use the hand data to control the cursor's screen position
        var rightCursorPosition = [rightHand.screenPosition()[0]+50, rightHand.screenPosition()[2]+300];
        var rightSize = (1-(rightHand.screenPosition()[1]+600)/1200)*maxCursorSize
        rightCursor.setScreenPosition(rightCursorPosition);

        // console.log(rightSize);

        if (rightSize <= hitHeight) {
          rightCursorSurface.setProperties({'borderRadius': hitHeight/2+'px'});//'background': 'pink', 
          rightCursorSurface.setSize([hitHeight, hitHeight])

          var rightPalmVelocity = rightHand.palmVelocity;

          rightSelectedDrum = getIntersectingDrum(rightCursorPosition, rightPalmVelocity, rightCursorSurface);
          // console.log(rightCursorSurface.getProperties());
        } else {
          rightCursorSurface.setProperties({'background': 'purple', 'borderRadius': rightSize/2+'px'});
          rightCursorSurface.setSize([rightSize, rightSize])
          // console.log(rightCursorSurface.getProperties());
        }
        
        
        // $('#right-cursor-img').attr('height', Math.min(Math.abs(1-(rightSize+600)/1200)*maxCursorSize), 100);

        

        //  Enable the player to grab, move, and rotate the drum stick
        if (rightSelectedDrum != false) {
          registerHit(rightSelectedDrum, Colors.YELLOW);
          rightMostRecentDrum = rightSelectedDrum;
        } else {
          rightMostRecentDrum.played = false;
          rightSelectedDrum.played = false;
        }
      }

      // RECORDING or PLAYBACK 
      if (state.get('state') == 'recording') {
        background.setContent("<h1>PerfectBeats</h1>");
      }
      else if (state.get('state') == 'playback') {
        background.setContent("<h1>PerfectBeatsp</h1>");
      }
    }
  }
}}).use('screenPosition', {scale: LEAPSCALE});
