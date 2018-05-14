var Cursor = Backbone.Model.extend({
  defaults: {
    screenPosition: [0, 0],
    screenRotation: 0,
    cursorSize: 25
  },
  setScreenPosition: function(position) {
    this.set('screenPosition', position.slice(0));
  },

  setCursorSize: function(size) {
    this.set('cursorSize', size);
  },

  setScreenRotation: function(rotation) {
    if (rotation < 0) {
      this.set('screenRotation', 0)
    } else if (rotation > 1.5708) {
      this.set('screenRotation', 1.5708);
    } else {
      this.set('screenRotation', rotation);
    }
  },
});

// playHit = function(drum) {
//   setTimeout(function() {
//     console.log(drum);
//     drum.surface.setProperties({backgroundColor: Colors.YELLOW});
//     document.getElementById(drum.type).play();
//   }, 200);
// }

var State = Backbone.Model.extend({
  defaults: {
    state: "playing", // setup, playing, recording, playback
    boards: [],
    waiting: true
  },

  clearState: function() {
    this.set('state', 'playing');
    background.setContent("<h1>PerfectBeats</h1><br>");
  },

  startRecording: function() {
    this.set('state', 'recording');
    background.setContent("<h1>PerfectBeats</h1><h3 style='color: #FA5C4F;'>Recording</h3>");
  },

  stopRecording: function(hitSequence) {
    this.set('state', 'playing');
    var self = this;
    if (hitSequence.length == 0) {
      background.setContent("<h1>PerfectBeats</h1><h3 style='color: #FAF36F;'>Nothing recorded</h3>");
      setTimeout(function() {
        self.clear_state();
      }, 2000);
    } else {
      background.setContent("<h1>PerfectBeats</h1><h3 style='color: #FAF36F;'>Recording saved</h3>");
      setTimeout(function() {
        self.clearState();
      }, 2000);
    }
    return hitSequence;
  },

  startPlayback: function(hitSequence) {
    this.set('state', 'playback');
    var self = this;
    if (hitSequence.length == 0) {
      background.setContent("<h1>PerfectBeats</h1><h3 style='color: #257DE7;'>No recording to play</h3>");
      setTimeout(function() {
        self.clearState();
      }, 2000);
    }
    else {
      background.setContent("<h1>PerfectBeats</h1><h3 style='color: #257DE7;'>Playing last recording</h3>");
      var start = hitSequence[0][1];
      var end = hitSequence[hitSequence.length-1][1];
      for (var i=0; i < hitSequence.length; i++) {
        (function(i) {
          setTimeout(function() {
            var drum = hitSequence[i][0];
            playDrum(drum, Colors.BLUE);
          }, hitSequence[i][1] - start);
        })(i);
      }
      setTimeout(function() {
        self.clearState();
      }, end - start + 1000);
    }
  }
});
