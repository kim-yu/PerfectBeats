# PerfectBeats

### app
* config.js: sets constants like colors, drum sizes and coordinates, and speech/Leap Motion parameters
* helpers.js: functions for speech synthesis, identifying if a motion is a hit, identifying which drum the user is hovering over, providing visual/audio feedback 
* main.js: gets data from the Leap Motion Controller and process it, calls functions from helpers.js to provide visual/audio feedback, processes speech 
* models.js: creates objects for the dots and the state of the system 
* setup.js: creates objects for the dots and drums 
* setupSpeech.js: speech recognition setup

### css
* app.css: CSS for the website <br />
img: images of the dots and drums with and without highlighting <br />
index.html: HTML for website, gets necessary JavaScript and CSS files <br />
lib: folder containing necessary JavaScript files in order to use Famo.us, the Leap, and Underscore/Backbone <br />
sounds: folder containing drum sounds <br />
