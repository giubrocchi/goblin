// time = 0 é rosa, time = 1 é verde
let time = Math.round(Math.random());
let control = '';
let tempo = 0;
let disp = 0;

function colocarTime(){
	let goblin = document.getElementById("goblin");
  if(time == 0){
		goblin.src = './static/images/goblinsRosa/goblinR.png';
    document.getElementById("id-time").innerHTML = "Rosa";
		document.getElementById("id-time").style.color = "rgb(255,105,180)";
	}else{
		goblin.src = './static/images/goblinsVerde/goblinV.png';
    document.getElementById("id-time").innerHTML = "Verde";
		document.getElementById("id-time").style.color = "rgb(34,139,34)";
	}
}

function plantar(id){
  // só planta se tempo for 0 e não tiver arvores para plantar no control
  if(tempo != 0 || control != '')
    return;
  tempo = 5;
  control = id;

  var audio = new Audio('./static/sound/button-21.mp3');
  audio.play();
}

function update(){
  // tempo para plantar outra arvore
  if(tempo > 0)
    tempo--;
  else if(control != '')
    control = '';

  // atualizar tempo no html
  document.getElementById("id-tempo").innerHTML = tempo;

  // control != '' quer dizer que há planta para plantar
  if(control != ''){
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET","/getLugar?id=" + control, true);
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        colocarArvore(xmlhttp.responseText, control);
    }
    xmlhttp.send();
  }
  else{
    // se nao há arvores para plantar, só atualiza campo
    updateCampo();
  }
}

function colocarArvore(resp, id){
  // resp 0 = não tem arvore no local
  // coloca a arvore no servidor
  if(resp == '0'){
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET","/plantar?id=" + id + "&time=" + time, true);
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
        // depois de colocar arvore, limpa o control e da update no campo
        control = '';
        updateCampo();
      }
    }
    xmlhttp.send();
  }
  else{
    controle = '';
    tempo = 0;
  }
}

function iniciarJogo(){
  
  document.getElementById("back").style.display = "none";
  document.getElementById("iniciar").style.display = "none";
  var audio = new Audio('./static/sound/button-30.mp3');
  audio.play();
}

function finalizarJogo(time){
  disp = 1;
  let str = "Jogo finalizado!<br>";
  if(time == 0)
    str += "O time rosa venceu!";
  else if(time == 1)
    str += "O time verde venceu!";
  else
    str += "Empate!"
  str += "<br>Aguarde até o jogo reiniciar."
  document.getElementById("msg-finalizar").innerHTML = str;
  document.getElementById("finalizar").style.display = "inherit";
  setTimeout(tirarAlerta, 5000);
}

function updateCampo(){
  // da update no campo de arvores
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET","/getCampo", true);
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
      let resp = JSON.parse(xmlhttp.responseText);
      let campo = resp["campo"];
      let rosa = resp["rosa"];
      let verde = resp["verde"];
      let total = resp["total"];
      document.getElementById("num-time-rosa").innerHTML = rosa;
      document.getElementById("num-time-verde").innerHTML = verde;
      if(parseInt(rosa) + parseInt(verde) == parseInt(total)){
        if(parseInt(rosa) > parseInt(verde) && disp == 0)
          finalizarJogo(0);
        else if(parseInt(rosa) < parseInt(verde)  && disp == 0)
          finalizarJogo(1);
        else if(disp == 0)
          finalizarJogo(2);
      }
      for(let i = 0; i < campo.length; i++){
        for(let j = 0; j < campo[i].length; j++){
          let id = i + '-' + j;
          if(campo[i][j] != 0){
            let img = '';
            if(campo[i][j] <= 4){
              img += 'url(./static/images/arvoresRosas/arvoreRosa0' + campo[i][j] + '.png)';
            }
            else{
              img += 'url(./static/images/arvoresVerdes/arvoreVerde0' + (campo[i][j]-4) + '.png)';
            }
            document.getElementById(id).style.backgroundImage = img;
          }
          else{
            document.getElementById(id).style.backgroundImage = '';
          }
        }
      }
    }
  }
  xmlhttp.send();
}

function tirarAlerta(){
  document.getElementById("finalizar").style.display = "none";
  disp = 0;
}

let interval = setInterval(update, 1000);