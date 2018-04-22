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

// MAIN GAME LOOP
// Called every time the Leap provides a new frame of data
Leap.loop({ frame: function(frame) {
  if (frame.hands.length > 0) {
    // Clear any highlighting at the beginning of the loop
    clearDrums();
    state.startPlaying();
    
    for (var h=0; h < frame.hands.length; h++) {
      hand = frame.hands[h];
      if (hand.isLeft) {
        leftHand = hand;
      } else {
        rightHand = hand;
      }

      if (leftHand == null) {
        console.log('no left hand');
      } else {
        // TODO: 4.1, Moving the cursor with Leap data
        // Use the hand data to control the cursor's screen position
        var leftCursorPosition = [leftHand.screenPosition()[0]+50, leftHand.screenPosition()[1]+300];
        leftCursor.setScreenPosition(leftCursorPosition);

        leftSelectedDrum = getIntersectingDrum(leftCursorPosition);

        background.setContent("<h1>PerfectBeats</h1>");
        //  Enable the player to grab, move, and rotate the drum stick

        $('#left-cursor-img').attr('src', 'img/blueDot.png');
        $('#left-cursor-img').attr('height', '25');

        if (state.get('state') == 'playing') {
          if (leftSelectedDrum != false) {
            registerHit(leftSelectedDrum, Colors.YELLOW);
            leftMostRecentDrum = leftSelectedDrum;
          } else {
            state.endPlaying();
            leftMostRecentDrum.played = false;
            leftSelectedDrum.played = false;
          }
        }
      }

      if (rightHand == null) {
        console.log('no right hand');
      } else {
        // TODO: 4.1, Moving the cursor with Leap data
        // Use the hand data to control the cursor's screen position
        var rightCursorPosition = [rightHand.screenPosition()[0]+50, rightHand.screenPosition()[1]+300];
        rightCursor.setScreenPosition(rightCursorPosition);

        rightSelectedDrum = getIntersectingDrum(rightCursorPosition);

        //  Enable the player to grab, move, and rotate the drum stick

        $('#right-cursor-img').attr('src', 'img/blueDot.png');
        $('#right-cursor-img').attr('height', '25');

        if (state.get('state') == 'playing') {
          if (rightSelectedDrum != false) {
            registerHit(rightSelectedDrum, Colors.YELLOW);
            rightMostRecentDrum = rightSelectedDrum;
          } else {
            state.endPlaying();
            rightMostRecentDrum.played = false;
            rightSelectedDrum.played = false;
          }
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
