// GAME SETUP
var initialState = SKIPSETUP ? "playing" : "setup";
var state = new State({state: initialState});
var cursor = new Cursor();

// UI SETUP
setupUserInterface();

// selectedDrum: The drum that the player is currently hovering above
var selectedDrum = false;
var mostRecentDrum = false;

// grabbedShip/Offset: The ship and offset if player is currently manipulating a ship
// var grabbedShip = false;
// var grabbedOffset = [0, 0];

// isGrabbing: Is the player's hand currently in a grabbing pose
var isGrabbing = false;

// MAIN GAME LOOP
// Called every time the Leap provides a new frame of data
Leap.loop({ hand: function(hand) {
  // Clear any highlighting at the beginning of the loop
  clearDrums();

  // TODO: 4.1, Moving the cursor with Leap data
  // Use the hand data to control the cursor's screen position
  var cursorPosition = [hand.screenPosition()[0]+50, hand.screenPosition()[1]+300];;
  cursor.setScreenPosition(cursorPosition);
  cursor.setScreenRotation(hand.roll());

  // First, determine if grabbing pose or not
  console.log("grab: "+hand.grabStrength+", pinch: "+hand.pinchStrength);

  isGrabbing = hand.grabStrength >= 0.7 || hand.pinchStrength >= 0.7;

  selectedDrum = getIntersectingDrum(cursorPosition);

  // SETUP mode
  if (state.get('state') == 'setup') {
    background.setContent("<h1>PerfectBeats</h1>");
    // <h3 style='color: #7CD3A2;'>setup</h3>
    //  Enable the player to grab, move, and rotate the drum stick

    if (isGrabbing) {
      // background.setContent("<h1>PerfectBeats</h1><h3 style='color: #7CD3A2;'>playing</h3>");
      // $('#cursor-img').attr('src', 'img/stick1.png');
      // $('#cursor-img').attr('height', '80');
      state.startPlaying();
    } else {
      selectedDrum = false;
      $('#cursor-img').attr('src', 'img/blueDot.png');
      $('#cursor-img').attr('height', '25');
      background.setContent("<h1>PerfectBeats</h1>");
    }

    // // Grabbing, but no selected ship yet. Look for one.
    // // TODO: Update grabbedShip/grabbedOffset if the user is hovering over a ship
    // if (!grabbedShip && isGrabbing) {
    //   var shipAndOffset = getIntersectingShipAndOffset(cursorPosition);
    //   if (shipAndOffset != false) {
    //     grabbedShip = shipAndOffset["ship"];
    //     grabbedOffset = shipAndOffset["offset"];
    //   }
    // }

    // // Has selected a ship and is still holding it
    // // TODO: Move the ship
    // else if (grabbedShip && isGrabbing) {
    //   grabbedShip.setScreenPosition([cursorPosition[0] - grabbedOffset[0], cursorPosition[1] - grabbedOffset[1]]);
    //   grabbedShip.setScreenRotation(hand.roll());
    // }

    // // Finished moving a ship. Release it, and try placing it.
    // // TODO: Try placing the ship on the board and release the ship
    // else if (grabbedShip && !isGrabbing) {
    //   placeShip(grabbedShip);
    //   grabbedShip = false;
    // }
  }

  else if (state.get('state') == 'playing') {
    background.setContent("<h1>PerfectBeats</h1>");
    $('#cursor-img').attr('src', 'img/stick1.png');
    $('#cursor-img').attr('height', '80');
    // console.log(mostRecentDrum);

    if (isGrabbing && selectedDrum != false) {
      registerHit(selectedDrum, Colors.YELLOW);
      mostRecentDrum = selectedDrum;
      // selectedDrum = false;
    } 
    else if (!isGrabbing) {
      state.endPlaying();
      mostRecentDrum.played = false;
      selectedDrum.played = false;
      // selectedDrum = false;
      $('#cursor-img').attr('src', 'img/blueDot.png');
      $('#cursor-img').attr('height', '25');
      background.setContent("<h1>PerfectBeats</h1>");
    } else {
      state.endPlaying();
      mostRecentDrum.played = false;
      selectedDrum.played = false;

    }
  }

  // RECORDING or PLAYBACK 
  else {
    if (state.get('state') == 'recording') {
      background.setContent("<h1>PerfectBeats</h1>");
    }
    else if (state.get('state') == 'playback') {
      background.setContent("<h1>PerfectBeatsp</h1>");
    }
  }
}}).use('screenPosition', {scale: LEAPSCALE});
