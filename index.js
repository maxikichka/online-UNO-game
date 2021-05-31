var clients = [];

var cardStack = ['0 #0000FF number-color', '1 #0000FF number-color', '1 #0000FF number-color', '2 #0000FF number-color', '2 #0000FF number-color', '3 #0000FF number-color', '3 #0000FF number-color', '4 #0000FF number-color', '4 #0000FF number-color', '5 #0000FF number-color', '5 #0000FF number-color', '6 #0000FF number-color', '6 #0000FF number-color', '7 #0000FF number-color', '7 #0000FF number-color', '8 #0000FF number-color', '8 #0000FF number-color', '9 #0000FF number-color', '9 #0000FF number-color', '0 #FF0000 number-color', '1 #FF0000 number-color', '1 #FF0000 number-color', '2 #FF0000 number-color', '2 #FF0000 number-color', '3 #FF0000 number-color', '3 #FF0000 number-color', '4 #FF0000 number-color', '4 #FF0000 number-color', '5 #FF0000 number-color', '5 #FF0000 number-color', '6 #FF0000 number-color', '6 #FF0000 number-color', '7 #FF0000 number-color', '7 #FF0000 number-color', '8 #FF0000 number-color', '8 #FF0000 number-color', '9 #FF0000 number-color', '9 #FF0000 number-color', '0 #00FF00 number-color', '1 #00FF00 number-color', '1 #00FF00 number-color', '2 #00FF00 number-color', '2 #00FF00 number-color', '3 #00FF00 number-color', '3 #00FF00 number-color', '4 #00FF00 number-color', '4 #00FF00 number-color', '5 #00FF00 number-color', '5 #00FF00 number-color', '6 #00FF00 number-color', '6 #00FF00 number-color', '7 #00FF00 number-color', '7 #00FF00 number-color', '8 #00FF00 number-color', '8 #00FF00 number-color', '9 #00FF00 number-color', '9 #00FF00 number-color', '0 #EEFF00 number-color', '1 #EEFF00 number-color', '1 #EEFF00 number-color', '2 #EEFF00 number-color', '2 #EEFF00 number-color', '3 #EEFF00 number-color', '3 #EEFF00 number-color', '4 #EEFF00 number-color', '4 #EEFF00 number-color', '5 #EEFF00 number-color', '5 #EEFF00 number-color', '6 #EEFF00 number-color', '6 #EEFF00 number-color', '7 #EEFF00 number-color', '7 #EEFF00 number-color', '8 #EEFF00 number-color', '8 #EEFF00 number-color', '9 #EEFF00 number-color', '9 #EEFF00 number-color', '#0000FF plus2-color', '#0000FF plus2-color', '#FF0000 plus2-color', '#FF0000 plus2-color', '#00FF00 plus2-color', '#00FF00 plus2-color', '#EEFF00 plus2-color', '#EEFF00 plus2-color', '#0000FF reverse-color', '#0000FF reverse-color', '#FF0000 reverse-color', '#FF0000 reverse-color', '#00FF00 reverse-color', '#00FF00 reverse-color', '#EEFF00 reverse-color', '#EEFF00 reverse-color', '#0000FF skip-color', '#0000FF skip-color', '#FF0000 skip-color', '#FF0000 skip-color', '#00FF00 skip-color', '#00FF00 skip-color', '#EEFF00 skip-color', '#EEFF00 skip-color', 'ignore plus4-wild', 'ignore plus4-wild', 'ignore plus4-wild', 'ignore plus4-wild', 'ignore normal-wild', 'ignore normal-wild', 'ignore normal-wild', 'ignore normal-wild'];

var playerCount = 2;

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/homepage.html');
});

app.get('/game.html', (req, res) => {
  res.sendFile(__dirname + '/game.html');
});

function pickCards(stack, amount) {
  let pickedCards = [];
  for (let i = 0; i < amount; i++) {
      let typeOfCardI = Math.floor(Math.random() * stack.length);

      let typeOfCard = stack[typeOfCardI].split(" ");
      
      pickedCards.push(typeOfCard);

      stack.splice(typeOfCardI, 1);
  }
  return [stack, pickedCards];
}

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('looking for match', msg => {
    console.log(msg);
    if (clients.length == 0) {
      let startingCard = cardStack[Math.floor(Math.random() * cardStack.length)];
      clients.push([{"id": clients.length, "cardStack": cardStack, "startingCard": startingCard, "players": [socket], "first": "notset", "searching": "yes", "direction": 1}]);
      clients[clients.length - 1][0]["cardStack"].splice(clients[clients.length - 1][0]["cardStack"].indexOf(startingCard), 1);
    } else if (clients[clients.length - 1][0]["searching"] == "yes") {
      //console.log(clients[clients.length - 1][0]);
      //Player joined their game
      clients[clients.length - 1][0]["players"].push(socket);
    } else if (clients[clients.length - 1][0]["searching"] == "no") {
      let startingCard = cardStack[Math.floor(Math.random() * cardStack.length)];
      clients.push([{"id": clients.length, "cardStack": cardStack, "startingCard": startingCard, "players": [socket], "first": "notset", "searching": "yes", "direction": 1}]);
      clients[clients.length - 1][0]["cardStack"].splice(clients[clients.length - 1][0]["cardStack"].indexOf(startingCard), 1);
    }
  });

  socket.on('give my cards', msg => {
    let newCards = pickCards(clients[clients.length - 1][0]["cardStack"], 7);
    clients[clients.length - 1][0]["cardStack"] = newCards[0];

    //console.log(newCards[1]);

    let startingCard = clients[clients.length - 1][0]["startingCard"];

    console.log(startingCard);

    if (clients[clients.length - 1][0]["first"] == "notset") {
      clients[clients.length - 1][0]["first"] = Math.floor(Math.random() * clients[clients.length - 1][0]["players"].length)
    }

    let whoGoesFirst = clients[clients.length - 1][0]["first"];

    if (clients[clients.length - 1][0]["players"].indexOf(socket) == whoGoesFirst) {
      socket.emit("here are your cards", [newCards[1], startingCard, "first"]);
    } else {
      socket.emit("here are your cards", [newCards[1], startingCard, "second"]);
    }

  });
  
  socket.on("move", msg => {
    console.log("direction: ");
    console.log(clients[clients.length - 1][0]["direction"]);

    name = msg[1];
    card = msg[0];
    console.log(card);


    for (let i = 0; i < clients.length; i++) {
      // console.log(clients[i][0]["players"][0].id, clients[i][0]["players"][1].id);
      // console.log(socket.id);
      // console.log(socket in clients[i][0]["players"]);

      //find which game it is the palyer is in
      if (clients[i][0]["players"].indexOf(socket) > -1) {
        console.log(clients[i][0]["players"].length);
        for (let j = 0; j < clients[i][0]["players"].length; j++) {
          //loop through the players and send them correct specific data
          if (card[1] == "reverse-color") {
            //if card is reverse
            if (clients[i][0]["direction"] == 1) {
              if ((j == clients[i][0]["players"].indexOf(socket) - 1) || ((clients[i][0]["players"].indexOf(socket) == 0) && j == clients[i][0]["players"].length - 1)) {
                clients[i][0]["players"][j].emit("move", ["your turn", card]);
              } else {
                clients[i][0]["players"][j].emit("move", ["waiting for " + name, card]);
              }
            } else {
              if ((j == clients[i][0]["players"].indexOf(socket) + 1) || ((clients[i][0]["players"].indexOf(socket) == clients[i][0]["players"].length - 1) && j == 0)) {
                clients[i][0]["players"][j].emit("move", ["your turn", card]);
              } else {
                clients[i][0]["players"][j].emit("move", ["waiting for " + name, card]);
              }
            }

          } else if (card[1] == "skip-color") {
            //if card is skip
            if (clients[i][0]["direction"] == 1) {
              if ((j == clients[i][0]["players"].indexOf(socket) + 2) || ((clients[i][0]["players"].indexOf(socket) == clients[i][0]["players"].length - 2) && j == 0) || ((clients[i][0]["players"].indexOf(socket) == clients[i][0]["players"].length - 1) && j == 1)) {
                  clients[i][0]["players"][j].emit("move", ["your turn", card]);
              } else {
                  clients[i][0]["players"][j].emit("move", ["waiting for " + name, card]);
              }
            } else {
                if ((j == clients[i][0]["players"].indexOf(socket) - 2) || ((clients[i][0]["players"].indexOf(socket) == 0) && j == clients[i][0]["players"].length - 2) || ((clients[i][0]["players"].indexOf(socket) == 1) && j == clients[i][0]["players"].length - 1)) {
                  clients[i][0]["players"][j].emit("move", ["your turn", card]);
              } else {
                  clients[i][0]["players"][j].emit("move", ["waiting for " + name, card]);
              }
            }

          } else {
            //if card is not reverse or skip
            if (clients[i][0]["direction"] == 1) {
              if ((j == clients[i][0]["players"].indexOf(socket) + 1) || ((clients[i][0]["players"].indexOf(socket) == clients[i][0]["players"].length - 1) && j == 0)) {
                if (card[1] == "normal-wild") {
                  //previous picker gotta pick a color then send it to next client with the wild card
                  clients[i][0]["players"][j].emit("move", ["your turn", card, msg[2]]);
                } else if (card[1] == "plus4-wild") {
                  let newCards = pickCards(clients[i][0]["cardStack"], 4);
                  clients[i][0]["cardStack"] = newCards[0];
                  clients[i][0]["players"][j].emit("move", ["your turn", card, msg[2], newCards[1]]);
                } else if (card[1] == "plus2-color") {
                  let newCards = pickCards(clients[i][0]["cardStack"], 2);
                  clients[i][0]["cardStack"] = newCards[0];
                  clients[i][0]["players"][j].emit("move", ["your turn", card, newCards[1]]);
                } else {
                  clients[i][0]["players"][j].emit("move", ["your turn", card]);
                }
              } else {
                if (card[1] == "normal-wild") {
                  //previous picker gotta pick a color then send it to next client with the wild card
                  clients[i][0]["players"][j].emit("move", ["waiting for " + name, card, msg[2]]);
                } else if (card[1] == "plus4-wild") {
                  let newCards = pickCards(clients[i][0]["cardStack"], 4);
                  clients[i][0]["cardStack"] = newCards[0];
                  clients[i][0]["players"][j].emit("move", ["waiting for " + name, card, msg[2], newCards[1]]);
                } else if (card[1] == "plus2-color") {
                  let newCards = pickCards(clients[i][0]["cardStack"], 2);
                  clients[i][0]["cardStack"] = newCards[0];
                  clients[i][0]["players"][j].emit("move", ["waiting for " + name, card, newCards[1]]);
                } else {
                  clients[i][0]["players"][j].emit("move", ["waiting for " + name, card]);
                }
              }
            } else {
              if ((j == clients[i][0]["players"].indexOf(socket) - 1) || ((clients[i][0]["players"].indexOf(socket) == 0) && j == clients[i][0]["players"].length - 1)) {
                if (card[1] == "normal-wild") {
                  //previous picker gotta pick a color then send it to next client with the wild card
                  clients[i][0]["players"][j].emit("move", ["your turn", card, msg[2]]);
                } else if (card[1] == "plus4-wild") {
                  let newCards = pickCards(clients[i][0]["cardStack"], 4);
                  clients[i][0]["cardStack"] = newCards[0];
                  clients[i][0]["players"][j].emit("move", ["your turn", card, msg[2], newCards[1]]);
                } else if (card[1] == "plus2-color") {
                  let newCards = pickCards(clients[i][0]["cardStack"], 2);
                  clients[i][0]["cardStack"] = newCards[0];
                  clients[i][0]["players"][j].emit("move", ["your turn", card, newCards[1]]);
                } else {
                  clients[i][0]["players"][j].emit("move", ["your turn", card]);
                }
              } else {
                if (card[1] == "normal-wild") {
                  //previous picker gotta pick a color then send it to next client with the wild card
                  clients[i][0]["players"][j].emit("move", ["waiting for " + name, card, msg[2]]);
                } else if (card[1] == "plus4-wild") {
                  let newCards = pickCards(clients[i][0]["cardStack"], 4);
                  clients[i][0]["cardStack"] = newCards[0];
                  clients[i][0]["players"][j].emit("move", ["waiting for " + name, card, msg[2], newCards[1]]);
                } else if (card[1] == "plus2-color") {
                  let newCards = pickCards(clients[i][0]["cardStack"], 2);
                  clients[i][0]["cardStack"] = newCards[0];
                  clients[i][0]["players"][j].emit("move", ["waiting for " + name, card, newCards[1]]);
                } else {
                  clients[i][0]["players"][j].emit("move", ["waiting for " + name, card]);
                }
              }
            }
          }

        }
      }
    }

    if (card[1] == "reverse-color") {
      clients[clients.length - 1][0]["direction"] = clients[clients.length - 1][0]["direction"] * -1;
    }

  });

  socket.on("stop searching", function(msg) {
    for (let i = 0; i < clients[clients.length - 1][0]["players"].length; i++) {
      clients[clients.length - 1][0]["players"][i].emit("match found");
    }
    clients[clients.length - 1][0]["searching"] = "no";
  });

  socket.on("give me extra card", function(msg) {
    //HEY MAX FINISH THIS TO GIVE EXTRA CARD TO CLIENT WITH NO AVAIL
    let newCards = pickCards(clients[clients.length - 1][0]["cardStack"], 7);
    clients[clients.length - 1][0]["cardStack"] = newCards[0];
    clients[i][0]["players"][clients[i][0]["players"].indexOf(socket)].emit("here extra cards", newCards[1]);
  });

});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
