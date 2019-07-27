var freeCell = {};
//freeCell.time = 65
freeCell.home = ['S0', 'H0', 'D0', 'C0'];
freeCell.park = ['', '', '', ''];
freeCell.square = [
  ['H2', 'DQ', 'C2', 'H6', 'S7', 'H5', 'D6'],
  ['S4', 'C3', 'DA', 'S2', 'H8', 'D8', 'C7'],
  ['D3', 'HA', 'S6', 'D4', 'CX', 'SQ', 'HX'],
  ['CA', 'SA', 'H9', 'C4', 'D2', 'C9', 'SJ'],
  ['HJ', 'D5', 'S5', 'H7', 'SX', 'D9'],
  ['C6', 'S3', 'DX', 'C5', 'HQ', 'CQ'],
  ['D7', 'C8', 'H3', 'SK', 'DK', 'S8'],
  ['S9', 'H4', 'CJ', 'DJ', 'CK', 'HK']
];
freeCell.movement = [];


//freeCell.square[4][3]

function show() {
  console.log('   home:', freeCell.home);
  console.log('   park:', freeCell.park);
  console.log('square1:', freeCell.square[0]);
  console.log('square2:', freeCell.square[1]);
  console.log('square3:', freeCell.square[2]);
  console.log('square4:', freeCell.square[3]);
  console.log('square5:', freeCell.square[4]);
  console.log('square6:', freeCell.square[5]);
  console.log('square7:', freeCell.square[6]);
  console.log('square8:', freeCell.square[7]);
}

freeCell.lookUpTable = {
  'A': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  'X': 10,
  'J': 11,
  'Q': 12,
  'K': 13,
    1: 'A',
   10: 'X',
   11: 'J',
   12: 'Q',
   13: 'K'
}

//card1=拿起的卡,card2=放置區的卡
//確認兩張卡卡花色是否一樣
freeCell.isSameSuit = function(card1, card2) {
  return card1[0] == card2[0];
};

//比較兩張卡顏色是否一樣
freeCell.isSameColor = function(card1, card2) {  
  if ((card1[0] == 'H' || card1[0] == 'D') && (card2[0] == 'H' || card2[0] == 'D')) {
    return true;
  } 
  if ((card1[0] == 'S' || card1[0] == 'C') && (card2[0] == 'S' || card2[0] == 'C')) {
    return true;
  } 
  return false;
};

//比較兩張卡的差(如要GoHome則差為1,如要GoSquare則差為-1,若為其他值則不可動作)
freeCell.numDiff = function(card1, card2) {
  var value1;
  switch (card1[1]) {
    case 'A':
      value1 = 1;
      break;
    case 'X':
      value1 = 10;
      break;
    case 'J':
      value1 = 11;
      break;
    case 'Q':
      value1 = 12;
      break;
    case 'K':
      value1 = 13;
      break;
    default:
      value1 = card1[1];
      break;
  }
  var value2;
  switch (card2[1]) {
    case 'A':
      value2 = 1;
      break;
    case 'X':
      value2 = 10;
      break;
    case 'J':
      value2 = 11;
      break;
    case 'Q':
      value2 = 12;
      break;
    case 'K':
      value2 = 13;
      break;
    default:
      value2 = card2[1];
      break;
  }
  return value1 - value2;
};

//刪除卡片
freeCell.takeCard = function(target, number) {
  let token = [];
  if (target[0] == 'p') {
    token.push(freeCell.park[target[1]]);
    freeCell.park[target[1]] = '';
    return token;
  }
  if (target[0] == 'h') {
    token.push(freeCell.home[target[1]]);
    switch (freeCell.home[target[1]][1]) {
      case 'A':
        freeCell.home[target[1]] = freeCell.home[target[1]][0] + '0';
        break;
      case '2':
        freeCell.home[target[1]] = freeCell.home[target[1]][0] + 'A';
        break;
      case 'X':
        freeCell.home[target[1]] = freeCell.home[target[1]][0] + '9';
        break;
      case 'J':
        freeCell.home[target[1]] = freeCell.home[target[1]][0] + 'X';
        break;
      case 'Q':
        freeCell.home[target[1]] = freeCell.home[target[1]][0] + 'J';
        break;
      case 'K':
        freeCell.home[target[1]] = freeCell.home[target[1]][0] + 'Q';
        break;
      default: 
        freeCell.home[target[1]] = freeCell.home[target[1]][0] + freeCell.home[target[1]][1]--;
        break;
    }
    return token;
  }
  if (target[0] == 's') {
    return freeCell.square[target[1]].splice(freeCell.square[target[1]].length - number, number);
  }
}

//增加卡片
freeCell.placeCard = function(target, card) {
  if (target[0] == 'p') {
    freeCell.park[target[1]] = card[0];
  }
  if (target[0] == 'h') {
    freeCell.home[target[1]] = card[0];
  }
  if (target[0] == 's') {
    freeCell.square[target[1]] = freeCell.square[target[1]].concat(card);
  }
}

//找到卡片在哪
freeCell.findCard = function(card) {
  //檢查卡片是否在park
  for (let i = 0; i < freeCell.park.length; i++) {
    if (card == freeCell.park[i]) {
      return 'p' + i;
    }
  }
  //檢查卡片是否在home
  for (let i = 0; i < freeCell.home.length; i++) {
    if (freeCell.isSameSuit(card, freeCell.home[i]) && freeCell.numDiff(card, freeCell.home[i]) <= 0) {
      return 'h' + i;
    }
  }
  //檢查卡片是否在square
  for (let i = 0; i < freeCell.square.length; i++) {
    for (let j = 0; j < freeCell.square[i].length; j++) {
      if (card == freeCell.square[i][j]) {
        return 's' + i;
      }
    }
  }
}

//確認可提起張數
freeCell.numDraggable = function(card) {
  //檢查卡片是否在park
  for (let i = 0; i < freeCell.park.length; i++) {
    if (card == freeCell.park[i]) {
      return 1;
    }
  }
  //檢查卡片是否在home
  for (let i = 0; i < freeCell.home.length; i++) {
    if (card == freeCell.home[i]) {
      return 1;
    }
    if (freeCell.isSameSuit(card, freeCell.home[i]) && freeCell.numDiff(card, freeCell.home[i]) < 0) {
      return 0;
    }
  }
  //檢查卡片是否在square
  var deck, order;
  for (let i = 0; i < freeCell.square.length; i++) {
    for (let j = 0; j < freeCell.square[i].length; j++) {
      if (card == freeCell.square[i][j]) {
        deck = i;
        order = j;
      }
    }
  }
  var ret = 1;
  for (let i = order;  i < freeCell.square[deck].length - 1; i++) {
    //若不成立直接return0
    //如果有件事情(=接起來)要A(=顏色不同)對而且B對(差為+1)
    //如果有件事情
    if (freeCell.isSameColor(freeCell.square[deck][i], freeCell.square[deck][i + 1]) 
        || freeCell.numDiff(freeCell.square[deck][i], freeCell.square[deck][i + 1]) != 1) {
      return 0;
    }  
    ret = ret + 1;
    //freeCell.square[deck][i]
  }
  return ret;
  //freeCell.square[deck][order];
};

//確認可移動張數
freeCell.numMovable = function(m, n) {
  return Math.pow(2, m) * (n + 1);
}

//確認是否贏了遊戲
freeCell.isWin = function() {
  var win = ['SK', 'HK', 'DK', 'CK'];
  for (let i = 0; i < freeCell.home.length; i++) {
    if (freeCell.home[i] != win[i]) {
      return false;
    }
  }
  return true;
};

//freeCell.park = ['C5', '', '', 'D4'];
//freeCell.park = ['', '', 'DJ', ''];
freeCell.movePark = function(card, index) {
  if (freeCell.park[index] != '') {
    return false;
  }
  if (freeCell.numDraggable(card) == 1) {
    let token = freeCell.takeCard(freeCell.findCard(card), 1);
    freeCell.placeCard('p' + index, token);
    return true;
  }
  return false;
};

freeCell.moveHome = function(card, index) {
  if (!freeCell.isSameSuit(card, freeCell.home[index])) {
    return false;
  }
  if (freeCell.numDiff(card, freeCell.home[index]) == 1 && freeCell.numDraggable(card) == 1) {
    let token = freeCell.takeCard(freeCell.findCard(card), 1);
    freeCell.placeCard('h' + index, token);
    return true;
  }
  return false;
};

freeCell.moveSquare = function(card, index) {
  let emptySquare = 0;
  for (let i = 0; i < freeCell.square.length; i++) {
    if (freeCell.square[i].length == 0) {
      emptySquare++;
    }
  }
  let emptyPark = 0;
  for (let i = 0; i < freeCell.park.length; i++) {
    if (freeCell.park[i] == '') {
      emptyPark++;
    }
  }  
  let draggable = freeCell.numDraggable(card) > 1;
  let notTooLong = freeCell.numDraggable(card) <= freeCell.numMovable(emptySquare - 1, emptyPark);
  if (freeCell.square[index].length == 0 && draggable && notTooLong) {
    let token = freeCell.takeCard(freeCell.findCard(card), freeCell.numDraggable(card));
    freeCell.placeCard('s' + index, token);

    return true;
  }
  let diffColor = !freeCell.isSameColor(card, freeCell.square[index]);
  let lessOne = freeCell.numDiff(card, freeCell.square[index]) == -1;
  notTooLong = freeCell.numDraggable(card) <= freeCell.numMovable(emptySquare, emptyPark);
  if (diffColor && lessOne && draggable && notTooLong) {
    let token = freeCell.takeCard(freeCell.findCard(card), freeCell.numDraggable(card));
    freeCell.placeCard('s' + index, token);
    return true;
  }
  return false;
}

//freeCell.movePark('DJ', 3)

/*freeCell.autoMove = function () {
  
};

freeCell.moveHome = function(card, index) {
  // body...
};*/

//destination: park[0] ~ park[3]: 'p0' ~ 'p3';
freeCell.move = function (card, destination) {
  console.log('Move ' + card + ' to ' + destination + '.');
  if (destination[0] == 'p') {
    return freeCell.movePark(card, destination[1]);
  }
  else if (destination[0] == 'h') {
    return freeCell.movePark(card, destination[1]);
  }
  else if (destination[0] == 's') {
    return freeCell.moveSquare(card, destination[1]);
  }
  else {
    console.log('error in freeCell.move()');
  }
  //delete
  //移動卡牌, 若成功移動回傳true, 失敗回傳false
  //eg.如果根本沒有card這張牌就回傳false
  //卡牌移至Home若成功放置回傳true
  //卡牌移至Park若成功放置回傳true
};


document.addEventListener("contextmenu", function(e){
  e.preventDefault();
}, false);

var isMousePressed = false;
var draggedCard = null;
function boardMouseDown(e) {
  e.preventDefault();
  console.log(e.button, 'press');
  if(e.button == 0) {
    isMousePressed = true;
  }
}

function boardMouseMove(e) {
  if (isMousePressed && draggedCard != null) {
    console.log('Dragging...' + draggedCard);
    draggedCard.card.style.top = (e.pageY - draggedCard.offsetY) + 'px';
    draggedCard.card.style.left = (e.pageX - draggedCard.offsetX) + 'px';
    draggedCard.card.style.zIndex = '99';
  }
}

function boradMouseUp(e) {
  console.log(e.button, 'release');
  if (e.button == 0) {
    isMousePressed = false;
    draggedCard.card.style.zIndex = '5';
    draggedCard = null;
  }
}

function cardMouseDown(e) {
  console.log(e);
  e.preventDefault();
  if (e.button == 0) {
    draggedCard = {
      card: e.target,
      offsetX: e.offsetX,
      offsetY: e.offsetY
    };
  }
  return false;
}

//<div id="c1" class="card" onmousedown="cardMouseDown(event)"></div>
//<div id="c2" class="card" onmousedown="cardMouseDown(event)"></div>
function createCards() {
  for (let i = 0; i <= 51; i++) {
    let suit = Math.ceil((i + 1) / 13);
    let point = i % 13 + 1;
    let element = document.createElement('div');
    element.classList.add('card');
    element.style.top = point * 50 + 'px';
    element.style.left = suit * 100 + 'px';
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

window.onload = function () {
  createCards();
};