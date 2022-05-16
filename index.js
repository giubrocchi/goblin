const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/public'));

// 0 = Vazio, 1-4 = Time rosa, 5-8 = Time verde
let campo = Array(11).fill(0).map(x => Array(16).fill(0));
let rosa = 0;
let verde = 0;
let total = campo.length*campo[0].length;

// retorna pagina inicial
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// retorna campo de arvores
app.get('/getCampo', (req, res) => {
  let ret = {
    "campo": campo,
    "rosa": rosa,
    "verde": verde,
    "total": total
  }
  
  res.send(ret);
});

// retorna lugar especifico do campo
app.get('/getLugar', (req, res) => {
  let id = req.query.id;
  let lugar = id.split('-');

  res.send(campo[lugar[0]][lugar[1]].toString());
});

// planta uma arvore no campo
app.get('/plantar', (req, res) => {
  let id = req.query.id;
  let lugar = id.split('-');
  let time = parseInt(req.query.time);

  let arv = (Math.floor(Math.random() * 4) + 1);
  if(time == 1){
    arv += 4;
    verde++;
  }
  else{
    rosa++;
  }

  campo[lugar[0]][lugar[1]] = arv;
  res.end();
});

setInterval(verifica, 1);

function verifica(){
  if(total == rosa + verde){
    setTimeout(reload, 5000);
  }
}

function reload(){
  campo = Array(11).fill(0).map(x => Array(16).fill(0));
  rosa = 0;
  verde = 0;
}

app.listen(process.env.PORT || 3000);