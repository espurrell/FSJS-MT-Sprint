// Fn for logging events
function logEvents(event, level, msg) {
    
    console.log(`[${level}] ${event}: ${msg}`);
  }
  
  module.exports = logEvents;