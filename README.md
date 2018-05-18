# PerfectBeats

app\n
  config.js: sets constants like colors, drum sizes and coordinates, and speech/Leap Motion parameters\n
  helpers.js: functions for speech synthesis, identifying if a motion is a hit, identifying which drum the user is hovering over, providing visual/audio feedback\n
  main.js: gets data from the Leap Motion Controller and process it, calls functions from helpers.js to provide visual/audio feedback, processes speech\n
  models.js: creates objects for the dots and the state of the system\n
  setup.js: creates objects for the dots and drums\n
  setupSpeech.js: speech recognition setup\n
css\n
  app.css: CSS for the website\n
img: images of the dots and drums with and without highlighting\n
index.html: HTML for website, gets necessary JavaScript and CSS files\n
lib: folder containing necessary JavaScript files in order to use Famo.us, the Leap, and Underscore/Backbone\n
sounds: folder containing drum sounds\n
