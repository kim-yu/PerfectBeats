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
  // setScreenRotation: function(rotation) {
  //   this.set('screenRotation', rotation);
  // }

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

// function shuffle(o){ //v1.0
//   for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
//   return o;
// };

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

  initialize: function() {
    // _.bindAll(this, 'waitingForPlayer', 'nextTurn');
    // var shotSequence = [];
    // for (var row = 0; row < NUMTILES; row++) {
    //   for (var col = 0; col < NUMTILES; col++) {
    //     shotSequence.push({row: row, col: col});
    //   }
    // }
    // shuffle(shotSequence);
    // var shots = shotSequence.map(function(pos) { return new Shot({position: pos}); });
    // this.set('cpuShots', new ShotSet(shots));
  },

  startRecording: function() {
    this.set('state', 'recording');
    console.log('recording');
  },

  stopRecording: function(hitSequence) {
    this.set('state', 'playing');
    console.log('stop recording');
    return hitSequence;
  },

  startPlayback: function(hitSequence) {
    console.log('playback');
    this.set('state', 'playback');
    for (var i=0; i < hitSequence.length; i++) {
      (function(i) {
        setTimeout(function() {
          var drum = hitSequence[i];
          drum.surface.setProperties({backgroundColor: Colors.YELLOW});
          document.getElementById(drum.type).play();
        }, i*1000);
      })(i);
    }
    this.set('state', 'playing');
  }
});

var Hit = Backbone.Model.extend({
  defaults: {
    position: {row: 0, col: 0},
  }
});
var HitSet = Backbone.Collection.extend({model: Hit});
