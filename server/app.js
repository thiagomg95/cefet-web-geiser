var express = require('express'),
    app = express();
var fs = require ('fs');
var path = require('path');
var _ = require('underscore');

// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 3-4 linhas de código (você deve usar o módulo de filesystem (fs))
var db = {
  jogadores: JSON.parse(fs.readFileSync('server/data/jogadores.json')),
  jogosPorJogador: JSON.parse(fs.readFileSync('server/data/jogosPorJogador.json'))
};


// configurar qual templating engine usar. Sugestão: hbs (handlebars)
app.set('view engine', 'hbs');

// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json

app.set('views', 'server/views');
app.get('/', function(request, response)
{
  response.render('index', {
    players: db.jogadores.players
  });
//  response.end('yay');
});

// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter umas 15 linhas de código

app.get('/jogador/:id/', function(request, response) {

  // retorna detalhes do jogador
  let player = _.find(db.jogadores.players, function(el) {
    return el.steamid === request.params.id;
  });

  // retorna jogos do jogador
  let playerDetails = dbJogador[request.params.id];

  // contabilizar a quantidade de jogos não jogados
  playerDetails.notPlayed = _.where(playerDetails.games, {
    playtime_forever: 0
  }).length;

  // ordenar por ordem decrescente de horas jogadas
  playerDetails.games = _.sortBy(playerDetails.games, function(el) {
    return -el.playtime_forever;
  });

  // retorna os 5 primeiros
  playerDetails.games = _.first(playerDetails.games, 5);

  // converter tempo jogado de minuto para hora
  playerDetails.games = _.map(playerDetails.games, function(el) {
    el.playtime_forever = Math.round(el.playtime_forever/60);
    return el;
  });

  response.render('jogador', {
    profile: player,
    gameInfo: playerDetails,
    favorite: playerDetails.games[0]
  });
});


// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código

app.use(express.static('client'));

// abrir servidor na porta 3000
app.listen(3000, function () {
	console.log ("Server listening");
});
// dica: 1-3 linhas de código
