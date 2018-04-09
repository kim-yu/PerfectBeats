var Cursor = Backbone.Model.extend({
  defaults: {
    screenPosition: [0, 0]
  },
  setScreenPosition: function(position) {
    this.set('screenPosition', position.slice(0));
  }
});

// function shuffle(o){ //v1.0
//   for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
//   return o;
// };

var State = Backbone.Model.extend({
  defaults: {
    state: "setup", // setup, playing, recording, playback
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

  startPlaying: function() {
    if (this.get('state') == 'setup')
      this.set('state', 'playing');
    else
      alert("Not in setup mode, so can't start playing");
  },

  endPlaying: function(winner) {
    if (this.get('state') == 'playing') {
      this.set('state', 'setup');
    }
    else
      alert("Not playing, so can't end playing");
  }
});

var Hit = Backbone.Model.extend({
  defaults: {
    position: {row: 0, col: 0},
  }
});
var HitSet = Backbone.Collection.extend({model: Hit});

var Stick = Backbone.Model.extend({
  defaults: {
    position: {row: 0, col: 0},
    screenPosition: [0, 0],
    startPosition: [0, 0],
    screenRotation: 0,
    isVertical: false,
  },

  initialize: function() {

  },

  setScreenPosition: function(position) {
    this.set('screenPosition', position.slice(0));
  },

  setScreenRotation: function(rotation) {
    this.set('screenRotation', rotation);
  },

  setBoardPosition: function(position) {
    this.set('position', position);
  },

  resetShip: function() {
    this.set('screenPosition', this.get('startPosition').slice(0));
    this.set('screenRotation', 0);
    this.set('isVertical', false);
  },

  snapRotation: function() {
    var rotation = this.get('screenRotation');
    var diff1 = Math.abs( rotation - Math.PI/2 );
    var diff2 = Math.abs( rotation + Math.PI/2 );
    var isVertical = (diff1 < Math.PI/4 || diff2 < Math.PI/4);
    this.set('screenRotation', isVertical ? Math.PI/2 : 0);
    this.set('isVertical', isVertical);
  },

  getEndpoints: function() {
    var endpoint = {
      row: this.get('position').row,
      col: this.get('position').col
    };
    if (this.get('isVertical'))
      endpoint.row += this.get('length') - 1;
    else
      endpoint.col += this.get('length') - 1;
    return {start: this.get('position'), end: endpoint};
  },

  getScreenOrigin: function() {
    var origin = this.get('screenPosition').slice(0);
    if (this.get('isVertical')) {
      // Get vertical origin
      origin[0] += this.get('length') * TILESIZE/2;
      origin[1] -= this.get('length') * TILESIZE/2;
    }
    return origin;
  },

  overlaps: function(otherShip) {
    var a = this.getEndpoints();
    var b = otherShip.getEndpoints();

    return (a.start.row <= b.end.row
            && a.end.row >= b.start.row
            && a.start.col <= b.end.col
            && a.end.col >= b.start.col);
  }
});
var StickSet = Backbone.Collection.extend({model: Stick});

// var Board = Backbone.Model.extend({
//   initialize: function() {
//     this.set('hits', new HitSet());

//     var sticks = new StickSet();

//     forEach(function(shipType, i) {
//       var stick = new Stick({
//         type: stickType,
//         screenPosition: [0, (i+1)*100],
//         startPosition: [0, (i+1)*100],
//       });
//       sticks.add(stick);
//     });
//     this.set('sticks', sticks);
//   },

//   deployStick: function(stick) {
//     if (this.outOfBounds(stick))
//       return false;

//     var overlap = false;
//     this.get('stick').forEach(function(otherStick) {
//       if (stick.get('type') != otherStick.get('type') && stick.get('isDeployed'))
//         overlap = otherStick.overlaps(stick);
//     });

//     // No overlaps and not out of bounds, so deploy
//     if (! overlap)
//       stick.set("isDeployed", true);

//     return !overlap;
//   },

//   outOfBounds: function(stick) {
//     var endpoints = stick.getEndpoints();
//     var start = endpoints.start;
//     var end = endpoints.end;
//     return (start.row < 0 || start.row >= NUMTILES
//       || start.col < 0 || start.col >= NUMTILES
//       || end.row < 0 || end.row >= NUMTILES
//       || end.col < 0 || end.col >= NUMTILES);
//   },

//   resetBoard: function() {
//     this.initialize();
//   },

//   registerHit: function(hit) {
//     var position = hit.get('position');

//     var hitStatus = true;
//     var result = {hit: hit};
    
//     this.get('hits').add(hit);

//     return result;
//   }
// });
