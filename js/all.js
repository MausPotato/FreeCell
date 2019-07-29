document.addEventListener("contextmenu", function(e){
  e.preventDefault();
}, false);

var time, timerId, resizeId;
var cardInterval = 5;
var vh;
var isMousePressed = false;
var draggedCards = [];
var isGameStart = false;

window.onload = function () {
  createCards();
  initialize();
  window.addEventListener('resize', function(){
    clearTimeout(resizeId);
    resizeId = setTimeout(render, 200);
  }, true);
};

function timing() {
  time++;
  timerRender();
}

function timerStart() {
  timerId = window.setInterval(timing, 1000);
}

function timerPause() {
  clearInterval(timerId);
}

function timerReset() {
  time = 0;
  timerPause();
  timerRender();
  isGameStart = false;
}

function timerRender() {
  let m = Math.floor(time / 60);
  let s = time - m * 60;
  if (s < 10) {
    s = '0' + s;
  }
  if (m < 10) {
    m = '0' + m;
  }
  document.getElementById('clock').innerHTML = m + ':' + s;
}

function boardMouseDown(e) {
  e.preventDefault();
  if(e.button == 0) {
    isMousePressed = true;
  }
}

function boardMouseMove(e) {
  if (isMousePressed && draggedCards.length != 0) {
    for (var i = 0; i < draggedCards.length; i++) {
      draggedCards[i].card.style.top = (e.pageY - draggedCards[i].offsetY) + 'px';
      //console.log('mmove', draggedCards[i].card.id);
      draggedCards[i].card.style.left = (e.pageX - draggedCards[i].offsetX) + 'px';
      draggedCards[i].card.style.zIndex = 50 + i;
    }
  }
}

function boardMouseUp(e) {
  //console.log(e.button, 'release');
  if (e.button == 0) {
    isMousePressed = false;
    if (draggedCards.length != 0) {
      let card = draggedCards[0].card;
      let c = collisionAll(card);
      //moveCard(card, c, freeCell.square[c[1]].length + 1);
      //draggedCards[0].card.style.zIndex = freeCell.square[c[1]].length + 1;
      if (c == '') {
        render();
      }
      else {
        let moveSuccess = freeCell.move(card.id, c);
        if (moveSuccess && !isGameStart) {
          isGameStart = true;
          timerStart();
        }
        render();
        if (freeCell.isWin()) {
          timerPause();
        }
      }
      draggedCards = [];
    }
  }
}

function cardMouseDown(e) {
  console.log(e.target.id + 'is clicked');
  e.preventDefault();
  if (e.button == 0) {
    let deck = freeCell.findCard(e.target.id);
    if (deck[0] == 'p' || deck[0] == 'h') {
      if (freeCell.numDraggable(e.target.id) == 1) {
        let draggedCard = {
          card: e.target,
          offsetX: e.offsetX,
          offsetY: e.offsetY
        };
        draggedCards.push(draggedCard);
      }
    }
    else if (deck[0] == 's') {
      for (var i = 0; i < freeCell.numDraggable(e.target.id); i++) {
        let element = document.getElementById(freeCell.square[deck[1]][freeCell.square[deck[1]].length - freeCell.numDraggable(e.target.id) + i]);
        let draggedCard = {
          card: element,
          offsetX: e.offsetX,
          offsetY: e.offsetY - (cardInterval * vh * i)
        };
        draggedCards.push(draggedCard);
      }
    }
  }
  return false;
}

function createCards() {
  for (let i = 0; i <= 51; i++) {
    let suit = Math.ceil((i + 1) / 13);
    let point = i % 13 + 1;
    let element = document.createElement('div');
    element.classList.add('card');
    element.style.top = 100 + 'vh';
    //console.log('ccards', element.id);
    element.style.left = 76 + 'vh';
    element.style.backgroundImage = 'url(card/card_' + (i + 1) + '.png)';
    element.addEventListener('mousedown', function() {
      cardMouseDown(event);
    });
    if (suit == 1) {
      element.id = 'S' + freeCell.lookUpTable[point];
    }
    if (suit == 2) {
      element.id = 'H' + freeCell.lookUpTable[point];
    }
    if (suit == 3) {
      element.id = 'D' + freeCell.lookUpTable[point];
    }
    if (suit == 4) {
      element.id = 'C' + freeCell.lookUpTable[point];
    }
    document.querySelector('.gameboard').appendChild(element);
  }
}

function moveCard(card, destination, index) {
  //card is a element, destination是字串
  let deck = document.getElementById(destination);
  let cardInterval = Math.min(50 / freeCell.square[destination[1]].length, 5);
  card.classList.add('slowmove');
  card.style.top = deck.offsetTop + (cardInterval * vh * (index - 1)) + 'px';
  //console.log('mcard', card.id);
  card.style.left = deck.offsetLeft + 'px';
  card.style.zIndex = 50 + index;
  //console.log(card.style.zIndex);
  setTimeout(function() {
    card.style.zIndex = index;
    card.classList.remove('slowmove');
    //console.log(card.style.zIndex);
  }, 500);
}

function collision(x1, y1, x2, y2, w, h) {
  return Math.abs(x1 - x2) < w / 2 && Math.abs(y1 - y2) < 2 * h / 3;
}

function collisionAll(card) {
  let element;
  let x = card.offsetLeft;
  let y = card.offsetTop;
  let w = card.offsetWidth;
  let h = card.offsetHeight;
  for (let i = 0; i < 4; i++) {
    element = document.getElementById('p' + i);
    if (collision(x, y, element.offsetLeft, element.offsetTop, w, h)) {
      return 'p' + i;
    }
    element = document.getElementById('h' + i);
    if (collision(x, y, element.offsetLeft, element.offsetTop, w, h)) {
      return 'h' + i;
    }
  }
  let deck = freeCell.findCard(card.id);
  let targetDebug = 'targetDebug:';
  for (let i = 0; i < freeCell.square.length; i++) {
    if (deck[0] == 's' && deck[1] == i) {
      continue;
    }
    let target;
    if (freeCell.square[i].length >= 1) {
      target = freeCell.square[i][freeCell.square[i].length - 1];
    }
    else {
      target = 's' + i;
    }
    targetDebug += (' ' + target);
    element = document.getElementById(target);
    if (collision(x, y, element.offsetLeft, element.offsetTop, w, h)) {
      console.log(element);
      return 's' + i;
    }
  }
  console.log(targetDebug);
  return '';
}

function render() {
  calculateVh();
  //random deck
  let element;
  for (let i = 0; i < 4; i++) {
    //renderPark
    if (freeCell.park[i] != '') {
      element = document.getElementById(freeCell.park[i]);
      moveCard(element, 'p' + i, 1);
    }
    //renderHome
    for (let j = freeCell.lookUpTable[freeCell.home[i][1]]; j > 0; j--) {
      element = document.getElementById(freeCell.home[i][0] + freeCell.lookUpTable[j]);
      console.log(j);
      moveCard(element, 'h' + i, 1);
    }
  }  
  for (let i = 0; i < freeCell.square.length; i++) {
    for (let j = 0; j < freeCell.square[i].length; j++) {
      element = document.getElementById(freeCell.square[i][j]);
      moveCard(element, 's' + i, j + 1);
    }
  }
}

function initialize() {
  freeCell.initial();
  timerReset();
  shuffle();
  render();
}

function shuffle() {
  //洗牌
  let length = freeCell.deck.length;
  let random;
  while (length) {
    random = Math.floor(Math.random() * length--);
    [freeCell.deck[length], freeCell.deck[random]] = [freeCell.deck[random], freeCell.deck[length]];
  }
  //發牌
  for (let i = 0; i < freeCell.deck.length; i++) {
    freeCell.square[i % 8].push(freeCell.deck[i]);
    let element = document.getElementById(freeCell.deck[i]);
    element.style.top = 100 + 'vh';
    //console.log('shuffle', element.style.top, element.id);
    element.style.left = 76 + 'vh';
  }
}

function calculateVh() {
  vh = window.innerHeight / 100;
}

function restart(e) {
  initialize();
}