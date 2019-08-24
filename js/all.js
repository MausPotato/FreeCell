// 禁止右建選單
document.addEventListener('contextmenu', function(e){
  e.preventDefault();
});

// 12~16原本應為這樣↓,為了取消前次動畫故加上一個變數方便記錄與刪除
/*window.addEventListener('resize', function() {
  render();
});*/

// 調整視窗時牌會依照視窗大小重新render,200為防止過度呼叫方順
var resizeId;
window.addEventListener('resize', function(){
  clearTimeout(resizeId);
  resizeId = setTimeout(render, 200);
});

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
  let restartBtn = document.getElementById('restart');
  let no = document.getElementById('no');
  let yes = document.getElementById('yes');
  let body = document.getElementsByTagName('body');
  let disableclick = document.getElementById('disableclick');
  restartBtn.addEventListener('click', function() {
    restartMenu(true);
    timerPause();
  });
  no.addEventListener('click', function() {
    restartMenu(false);
    if (isGameStart) {
      timerStart();      
    }
  });
  yes.addEventListener('click', function() {
    restartMenu(false);
    initialize();
  });
  body[0].addEventListener('mousedown', function(e) {
    e.preventDefault();
  });
  body[0].addEventListener('mousemove', boardMouseMove);
  body[0].addEventListener('mouseup', boardMouseUp);
  disableclick.addEventListener('click', function(e) {
    e.preventDefault();
  });
};

function restartMenu(show) {
  let restartWindow = document.getElementById('restartwindow');
  let disableClick = document.getElementById('disableclick');
  // restartWindow.style.display = (show ? 'flex' : 'none');
  if (show) {
    restartWindow.style.display = 'flex';
    disableClick.style.display = 'block';
  }
  else {
    restartWindow.style.display = 'none';
    disableClick.style.display = 'none';
  }
}

// 作用同54~57
/*window.addEventListener('load', function() {
  createCards();
  initialize();
});*/

// 卡片製造
function createCards() {
  for (let i = 0; i < 52; i++) {
    // 69~70原要做為id使用
    /*let suit = Math.ceil((i + 1) / 13);
    let point = i % 13 + 1;*/
    let element = document.createElement('div');
    element.classList.add('card');
    element.style.top = 100 + 'vh';
    element.style.left = 76 + 'vh';
    element.style.backgroundImage = 'url(card/card_' + (i + 1) + '.png)';
    element.addEventListener('mousedown', function(event) {
      cardMouseDown(event);
    });
    element.addEventListener('dblclick', function(event) {
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
  // 練習新的for..of寫法,替代舊有for迴圈(104~110)
  for (let [i, cardElement] of draggedCards.entries()) {
    cardElement.card.style.top = (e.pageY - cardElement.offsetY) + 'px';
    cardElement.card.style.left = (e.pageX - cardElement.offsetX) + 'px';
    cardElement.card.style.zIndex = 50 + i;
  }
}
/*function boardMouseMove(e) {
  for (let i = 0; i < draggedCards.length; i++) {
    draggedCards[i].card.style.top = (e.pageY - draggedCards[i].offsetY) + 'px';
    draggedCards[i].card.style.left = (e.pageX - draggedCards[i].offsetX) + 'px';
    draggedCards[i].card.style.zIndex = 50 + i;
  }
}*/

function boardMouseUp(e) {
  if (e.button != 0 || draggedCards.length == 0) {
    return;
  }
  let card = draggedCards[0].card;
  let moveTo = collisionAll(card);
  if (moveTo != '') {
    let moveSuccess = freeCell.move(card.id, moveTo);
    if (moveSuccess && !isGameStart) {
      //todo 提出做另一個function
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

function cardMouseDown(e) {
  console.log(e.target.id + 'is clicked');
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
  e.preventDefault();
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