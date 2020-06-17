require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(require('./routes'));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({
        ok: false,
        err: {
          message: err.message
        }
      });
  }
  next();
});

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


mongoose.connect(process.env.URLDB, (err, res) => {

  if (err){
    console.error(`> server.js: (${err})`);
    return;
  }

  console.log('\nBase de datos ONLINE'); 
  app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto: ${process.env.PORT}` );
  });

});



