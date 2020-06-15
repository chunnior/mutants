const crypto = require('crypto');

const Dna = require('../models/dna');
const Stats = require('../models/stats');

 /**
 * Recorre el contenido de la matriz para verificar si es mutante
 * 
 * @param dna          adn a evaluar
 * 
 * @return             False: si no es un dna mutante / True: si es mutante
 **/
async function isMutant(dna) {

  let mutantSeqs = 0;

  for (let i = 0; i < dna.length; i++) {

    for (let j = 0; j < dna[i].length; j++) {

      //Si hay mas de 4 columnas a la derecha
      if( j <= dna.length - 4){

        //Verificacion Horizontal
        if (dna[i][j] === dna[i][j+1] && dna[i][j+1] === dna[i][j+2] && dna[i][j+2] === dna[i][j+3]) {
          mutantSeqs++;
        }

      }

      //Si hay mas de 4 filas a la derecha
      if( i <= dna.length - 4){

        //Verificacion vertical
        if (dna[i][j] === dna[i+1][j] && dna[i+1][j] === dna[i+2][j] && dna[i+2][j] === dna[i+3][j]) {
          mutantSeqs++;
        }
        
        //Si hay mas de 4 columnas a la izquierda
        if( j >= 3 ){

          //Verificacion oblicuo izquierda-abajo
          if (dna[i][j] === dna[i+1][j-1] && dna[i+1][j-1] === dna[i+2][j-2] && dna[i+2][j-2] === dna[i+3][j-3]) {
            mutantSeqs++;
          }

        }

        //Si hay mas de 4 columnas a la derecha
        if(j <= dna.length - 4){

          //Verificacion oblicuo derecha-abajo
          if (dna[i][j] === dna[i+1][j+1] && dna[i+1][j+1] === dna[i+2][j+2] && dna[i+2][j+2] === dna[i+3][j+3]) {
            mutantSeqs++;
          }

        }
      }

      //Se han encontrado mas de 1 secuencia, es mutante
      if(mutantSeqs > 1) return true;
    }
  }

  return false;

}

 /**
 * Recibe parametros desde endpoint POST /mutant/
 * 
 * @param req          parametros con adn a evaluar
 * 
 * @return             200-OK: Es adn mutante/ 403-forbidden: no es mutante / 500-server error
 **/
const processDna = async(req, res) => {
    
  const {dna} = req.body;

  try {

    let dnaHash = crypto.createHash('md5').update(JSON.stringify(dna)).digest('hex');

    let dnaDB = await Dna.findOne({'hash': dnaHash}).exec();

    //No esta registrado en la base de datos, debemos analizar y guardarlo
    if (!dnaDB){

      const genMutant = await isMutant(dna);

      let dnaDoc = new Dna({
        hash: dnaHash,
        sequence: dna,
        mutant: genMutant
      });

      dnaDB = await dnaDoc.save();
      
      //Incrementa el valor de los stats. @todo: realizar un solo update con la condicion y no 2
      await Stats.findOneAndUpdate({ type: 'human' },{ $inc: { count: 1 } }, {upsert: true});
      
      if(dnaDB.mutant)
        await Stats.findOneAndUpdate({ type: 'mutant' },{ $inc: { count: 1 } }, {upsert: true});

    }

    //Devuelve 200 si es mutante, 403 si no lo es
    const code = dnaDB.mutant ? 200 : 403

    return res.status(code).json({
      mutant: dnaDB.mutant
    });


  } catch (error) {

    console.error(error);
    return res.status(500).json({
      error
    });

  }
}

 /**
 * Recibe parametros desde endpoint GET /stats/
 * 
 * @param req          parametros con adn a evaluar
 * 
 * @return
 * {
 *   "count_mutant_dna":40, "count_human_dna":100: "ratio":0.4
 * }
 **/
const getStats = async(req, res) => {

  try {

    // Busca contador actual por type (human, mutant)
    const statsDB = await Stats.find()
                    .select({ "type": 1,"count": 1, "_id": 0})
                    .or([{ type: 'human' }, { type: 'mutant' }]);

    if(statsDB.length){
      
      let mutantsQty =  0;
      let humansQty =  0;

      //Asigna cantidad por cada tipo
      statsDB.forEach(element => {
        if (element.type === 'human') humansQty = element.count;
        if (element.type === 'mutant') mutantsQty = element.count;
      });

      //Calcula el ratio
      let ratio = 0;
      if (humansQty > 0){
        ratio = (mutantsQty / humansQty);
      }

      return res.status(200).json({
        count_mutant_dna: mutantsQty,
        count_human_dna: humansQty,
        ratio: ratio
      });

    }else{

      return res.status(200).json({
        stats: statsDB,
        message: 'No hay informacion para generar estadísticas'
      });

    }

  } catch (error) {

    console.error(error);
    return res.status(500).json({
      error
    });

  }
}

module.exports = {
  processDna,
  getStats
}