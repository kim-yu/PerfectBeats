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

playHit = function(drum) {
  setTimeout(function() {
    console.log(drum);
    drum.surface.setProperties({backgroundColor: Colors.YELLOW});
    document.getElementById(drum.type).play();
  }, 200);
}

var State = Backbone.Model.extend({
  defaults: {
    state: "playing", // setup, playing, recording, playback
    boards: [],
    waiting: true
  },

  startRecording: function() {
    this.set('state', 'recording');
  },

  stopRecording: function(hitSequence) {
    this.set('state', 'playing');
    return hitSequence;
  },

  startPlayback: function() {
    this.set('state', 'playback');
  },

  endPlayback: function() {
    this.set('state', 'playing');
  }
});
