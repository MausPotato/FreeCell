// 禁止右建選單
document.addEventListener("contextmenu", function(e){
  e.preventDefault();
}, false);

// 調整視窗時牌會依照視窗大小重新render,200為防止過度呼叫方順
var resizeId;
window.addEventListener('resize', function(){
  clearTimeout(resizeId);
  resizeId = setTimeout(render, 200);
}, true);

// timer介面
var time, timerId;
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
  timerRender();
  timerPause();
  // todo試著移出timer
  isGameStart = false;
}

function timerRender() {
  let m = Math.floor(time / 60);
  let s = time % 60;
  if (s < 10) {
    s = '0' + s;
  }
  if (m < 10) {
    m = '0' + m;
  }
  document.getElementById('clock').innerHTML = m + ':' + s;
}

// HTML載入後進行
window.onload = function () {
  createCards();
  initialize();
};

// 卡片製造
function createCards() {
  for (let i = 0; i <= 51; i++) {
    let suit = Math.ceil((i + 1) / 13);
    let point = i % 13 + 1;
    let element = document.createElement('div');
    element.classList.add('card');
    element.style.top = 100 + 'vh';
    element.style.left = 76 + 'vh';
    element.style.backgroundImage = 'url(card/card_' + (i + 1) + '.png)';
    element.addEventListener('mousedown', function() {
      cardMouseDown(event);
    });
    element.addEventListener('dblclick', function() {
      cardDblClick(event);
    });
    // 利用未洗牌的deck直接給id
    element.id = freeCell.deck[i];
    document.querySelector('.gameboard').appendChild(element);
  }
}

// 牌的間距(考慮移除,改用牌的高度)
var cardInterval = 5, vh;
function calculateVh() {
  vh = window.innerHeight / 100;
}

var draggedCards = [];
var isGameStart = false;
function boardMouseMove(e) {
  if (draggedCards.length != 0) {
    for (let i = 0; i < draggedCards.length; i++) {
      draggedCards[i].card.style.top = (e.pageY - draggedCards[i].offsetY) + 'px';
      draggedCards[i].card.style.left = (e.pageX - draggedCards[i].offsetX) + 'px';
      draggedCards[i].card.style.zIndex = 50 + i;
    }
  }
}

function boardMouseUp(e) {
  if (e.button != 0) {
    return;
  }
  if (draggedCards.length != 0) {
    let card = draggedCards[0].card;
    let moveTo = collisionAll(card);
    if (moveTo != '') {
      let moveSuccess = freeCell.move(card.id, moveTo);
      if (moveSuccess && !isGameStart) {
        isGameStart = true;
        timerStart();
      }
      if (freeCell.isWin()) {
        timerPause();
      }
    }
    render();
    draggedCards = [];
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
      for (let i = 0; i < freeCell.numDraggable(e.target.id); i++) {
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

function cardDblClick(e) {
  e.preventDefault();
  //todo 把動畫從搭波click分離
  let moveSuccess = freeCell.autoMove(e.target.id);
  if (moveSuccess) {
    if (!isGameStart) {
      isGameStart = true;
      timerStart();
    }
    let dest = freeCell.findCard(e.target.id);
    let element;
    if (dest[0] == 'p' || dest[0] == 'h') {
      element = document.getElementById(e.target.id);
      element.style.zIndex = 55;
    }
    if (dest[0] == 's') {
      for (let i = freeCell.square[dest[1]].length - freeCell.numDraggable(e.target.id); i < freeCell.square[dest[1]].length; i++) {
        element = document.getElementById(freeCell.square[dest[1]][i]);
        element.style.zIndex = 50 + i;
      }
    }
  }
  if (freeCell.isWin()) {
    timerPause();
  }
  render();
}

var animationMap = new Map();
function moveAnimation(card, top, left, slowmove) {
  card.style.top = top;
  card.style.left = left;

}

function moveCard(card, destination, index) {
  // card is a element, destination是字串
  let deck = document.getElementById(destination);
  let cardInterval = Math.min(50 / freeCell.square[destination[1]].length, 5);
  card.classList.add('slowmove');
  card.style.top = deck.offsetTop + (cardInterval * vh * (index - 1)) + 'px';
  //console.log('mcard', card.id);
  moveAnimation(card, deck.offsetTop, deck.offsetLeft, true);
  card.style.left = deck.offsetLeft + 'px';
  //console.log(card.style.zIndex);
  let timeOutId = setTimeout(function() {
    card.style.zIndex = index;
    card.classList.remove('slowmove');
    //console.log(card.style.zIndex);
  }, 500);
  return timeOutId;
}

function collision(card1, card2) {
  const overlapW = 1 / 2;
  const overlapH = 2 / 3;
  let w = card1.offsetWidth;
  let h = card1.offsetHeight;
  let deltaX = Math.abs(card1.offsetLeft - card2.offsetLeft);
  let deltaY = Math.abs(card1.offsetTop - card2.offsetTop);
  return deltaX < (w * overlapW) && deltaY < (h * overlapH);
}

function collisionAll(card) {
  let element;
  for (let i = 0; i < 4; i++) {
    element = document.getElementById('p' + i);
    if (collision(card, element)) {
      return 'p' + i;
    }
    element = document.getElementById('h' + i);
    if (collision(card, element)) {
      return 'h' + i;
    }
  }
  let deck = freeCell.findCard(card.id);
  for (let i = 0; i < freeCell.square.length; i++) {
    // 如果同牌堆不做碰撞
    if (deck[0] == 's' && deck[1] == i) {
      continue;
    }
    // 如果牌堆有牌則撞最後一張,沒有則直接碰撞地板
    let target = 's' + i;
    if (freeCell.square[i].length >= 1) {
      target = freeCell.square[i][freeCell.square[i].length - 1];
    }
    element = document.getElementById(target);
    if (collision(card, element)) {
      return 's' + i;
    }
  }
  return '';
}

var timeOutId = [];
function render() {
  calculateVh();
  for (let i = 0; i < timeOutId.length; i++) {
    clearTimeout(timeOutId[i]);
  }
  timeOutId = [];
  //random deck
  let element;
  for (let i = 0; i < 4; i++) {
    //renderPark
    if (freeCell.park[i] != '') {
      element = document.getElementById(freeCell.park[i]);
      timeOutId.push(moveCard(element, 'p' + i, 1));
    }
    //renderHome
    for (let j = freeCell.lookUpTable[freeCell.home[i][1]]; j > 0; j--) {
      element = document.getElementById(freeCell.home[i][0] + freeCell.lookUpTable[j]);
      console.log(j);
      timeOutId.push(moveCard(element, 'h' + i, 1));
    }
  }  
  for (let i = 0; i < freeCell.square.length; i++) {
    for (let j = 0; j < freeCell.square[i].length; j++) {
      element = document.getElementById(freeCell.square[i][j]);
      timeOutId.push(moveCard(element, 's' + i, j + 1));
    }
  }
}

function initialize() {
  freeCell.initial();
  timerReset();
  shuffle();
  setTimeout(render, 100);
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
    element.style.zIndex =  Math.ceil((i + 1) / 8);
  }
}

function restart(e) {
  initialize();
}