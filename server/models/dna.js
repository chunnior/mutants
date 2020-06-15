var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var dnaSchema = new Schema({
  hash: { type: String, unique: true, required: true},
  sequence: { type: JSON, required: true},
  mutant: { type: Boolean, required: true}
});


module.exports = mongoose.model('Dna', dnaSchema);