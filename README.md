# Examen- Mutantes

Proyecto que se encarga de detectar si un humano es mutante basado en su secuencia de ADN.

## Herramientas usadas

- NodeJs
- Express
- MongoDB
## Pasos para ejecutar la app localmente

- Tener una versión de Nodejs superior a la 12
- Tener mongodb instalada y corriendo
- Descargar o clonar el proyecto
   ```sh
   $ git clone https://github.com/chunnior/mutants.git
    ```
- Ejecutar :
    ```sh
    $ npm install && npm start
    ```

## Pruebas en produccion
Se encuentra una version de la aplicacion alojada en AWS (Elastic Beanstalk)
URL: http://mutants-env.eba-qpbbrwma.us-east-2.elasticbeanstalk.com/

## URL de las apis
  - /mutant/
  Detecta si un humano es mutante evaluando las secuencias de ADN recibido

    ```sh
    POST -> /mutant/
    BODY {“dna”:["ATGCGA","AAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]}
    ```
    Devuelve 
        200-OK Si es un ADN mutantes
        403-Forbidden Si no es mutante
- /stats/
  Calculo de estadisticas, devuelve un JSON con la cantidad de humanos, cantidad de mutantes y ratio.

    ```sh
    GET -> /stats/
    ```
    Ejemplo de JSON de respuesta:
     ```sh
    {
    "count_mutant_dna": 3,
    "count_human_dna": 4,
    "ratio": 0.75
    }
    ```
 


----



