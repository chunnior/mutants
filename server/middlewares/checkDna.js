
 /**
 * Verificar DNA.
 **/
let checkDna = (req, res, next) => {

  const {dna} = req.body;

  // Validar que se reciba dna
  if (!dna){
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No se recibe ADN'
      }
    });
  }

  //Validar tamañano NxN
  let irregularLen = dna.filter((sequence) => {
    return sequence.length < dna.length || sequence.length > dna.length;
  });

  if (irregularLen.length > 0){
    return res.status(400).json({
      ok: false,
      err: {
        message: 'ADN de tamaño incorrecto'
      }
    });
  } 

  //Validar solo letras ATGC con regex
  let regex = /^[ATGC]*$/;

  let irregularLetter = dna.filter((sequence) => {
    return !regex.test(sequence);
  });

  if (irregularLetter.length > 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `Secuencia de ADN con base incorrecta ${irregularLetter}` 
      }
    });
  }

  next();

};


module.exports = {
  checkDna
}