var Ditty = require('ditty')

module.exports = function(midiGrabber){

  var repeater = Ditty() 
  var release = null
  var downNotes = []
  var repeatLength = 1

  repeater.setLength = function(value){
    repeatLength = value
    refresh()
  }

  repeater.start = function(length){
    if (!release){
      release = midiGrabber.grab(function(data){
        if (data[2]) down(data)
        else up(data)
      })
    }
    if (length){
      repeater.setLength(length)
    }
  }

  repeater.stop = function(){
    if (release){
      release()
      release = null
    }
  }

  function down(data){
    downNotes.push(data)
    refresh()
  }

  function up(data){
    downNotes = downNotes.filter(function(note){
      return !(note[0] == data[0] && note[1] == data[1])
    })
    refresh()
  }

  function refresh(){
    repeater.setNotes(downNotes.map(function(data){
      return {
        key: data[0] + '/' + data[1],
        on: data, off: [data[0], data[1], 0],
        position: 0, length: repeatLength/2
      }
    }), repeatLength)
  }

  return repeater
}