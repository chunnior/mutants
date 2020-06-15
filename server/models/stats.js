var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var statsSchema = new Schema({
  type:  { type: String, required: true},
  count: { type: Number, required: true}
});


module.exports = mongoose.model('Stats', statsSchema);