window.DEBUG = true;
var freeCell = {};
freeCell.deck = [
  'SA', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'SX', 'SJ', 'SQ', 'SK',
  'HA', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'HX', 'HJ', 'HQ', 'HK',
  'DA', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'DX', 'DJ', 'DQ', 'DK',
  'CA', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'CX', 'CJ', 'CQ', 'CK'
];

freeCell.initial = function() {
  freeCell.home = ['S0', 'H0', 'D0', 'C0'];
  freeCell.park = ['', '', '', ''];
  freeCell.square = [[],[],[],[],[],[],[],[]];
  freeCell.history = [];
}

// let token = freeCell.takeCard('s6', 5);
// placeCard('s3', token);

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
  '0': 0,
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
  return freeCell.lookUpTable[card1[1]] - freeCell.lookUpTable[card2[1]];
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
    freeCell.home[target[1]] = freeCell.home[target[1]][0] + freeCell.lookUpTable[freeCell.lookUpTable[freeCell.home[target[1]][1]] - 1];
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
    let diffColor = freeCell.isSameColor(freeCell.square[deck][i], freeCell.square[deck][i + 1]);
    let lessOne = freeCell.numDiff(freeCell.square[deck][i], freeCell.square[deck][i + 1]) != 1;
    if (diffColor || lessOne) {
      return 0;
    }  
    ret = ret + 1;
  }
  return ret;
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

freeCell.canMovePark = function(card, index) {
  if (freeCell.park[index] == '' && freeCell.numDraggable(card) == 1) {
    return true;
  }
  return false;
};

freeCell.movePark = function(card, index, undo = false) {
  if (!undo) {
    let movement = {
      from: freeCell.findCard(card),
      to: 'p' + index,
      card: card
    }
    freeCell.history.push(movement);
  }
  let token = freeCell.takeCard(freeCell.findCard(card), 1);
  freeCell.placeCard('p' + index, token);
};

freeCell.canMoveHome = function(card, index) {
  if (freeCell.isSameSuit(card, freeCell.home[index]) && freeCell.numDiff(card, freeCell.home[index]) == 1 && freeCell.numDraggable(card) == 1) {
    return true;
  }
  return false;
}

freeCell.moveHome = function(card, index, undo = false) {
  if (!undo) {
    let movement = {
      from: freeCell.findCard(card),
      to: 'h' + index,
      card: card
    }
    freeCell.history.push(movement);
  }
  let token = freeCell.takeCard(freeCell.findCard(card), 1);
  freeCell.placeCard('h' + index, token);
};

freeCell.canMoveSquare = function(card, index) {
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
  let draggable = freeCell.numDraggable(card) > 0;
  let notTooLong = freeCell.numDraggable(card) <= freeCell.numMovable(emptySquare - 1, emptyPark);
  if (freeCell.square[index].length == 0) {
    if (draggable && notTooLong) {
      return true;
    }
    else {
      return false;
    }
  }
  let diffColor = !freeCell.isSameColor(card, freeCell.square[index][freeCell.square[index].length - 1]);
  let lessOne = freeCell.numDiff(card, freeCell.square[index][freeCell.square[index].length - 1]) == -1;
  notTooLong = freeCell.numDraggable(card) <= freeCell.numMovable(emptySquare, emptyPark);
  if (diffColor && lessOne && draggable && notTooLong) {
    return true;
  }
  return false;
}

freeCell.moveSquare = function(card, index, undo = false) {
  if (!undo) {
    let movement = {
      from: freeCell.findCard(card),
      to: 's' + index,
      card: card
    }
    freeCell.history.push(movement);
  }
  let token = freeCell.takeCard(freeCell.findCard(card), freeCell.numDraggable(card));
  freeCell.placeCard('s' + index, token);
}

freeCell.autoMove = function (card) {
  for (let i = 0; i < freeCell.home.length; i++) {
    if (freeCell.move(card, 'h' + i)) {
      return true;
    }
  }
  for (let i = 0; i < freeCell.square.length; i++) {
    if (freeCell.move(card, 's' + i)) {
      return true;
    }
  }
  for (let i = 0; i < freeCell.park.length; i++) {
    if (freeCell.move(card, 'p' + i)) {
      return true;
    }
  }
  return false;
};

//destination: park[0] ~ park[3]: 'p0' ~ 'p3';
freeCell.move = function (card, destination) {
  //移動卡牌, 若成功移動回傳true, 失敗回傳false
  console.log('Move ' + card + ' to ' + destination + '.');
  if (destination[0] == 'p') {
    if (freeCell.canMovePark(card, destination[1])) {
      freeCell.movePark(card, destination[1]);
      return true;
    }
  }
  else if (destination[0] == 'h') {
    if (freeCell.canMoveHome(card, destination[1])) {
      freeCell.moveHome(card, destination[1]);
      return true;
    }
  }
  else if (destination[0] == 's') {
    if (freeCell.canMoveSquare(card, destination[1])) {
      freeCell.moveSquare(card, destination[1]);
      return true;
    }
  }
  else {
    console.error('error in freeCell.move()');
  }
  return false;
};

freeCell.undo = function() {
  let movement = freeCell.history.pop();
  console.log(movement);
  if (!movement) {
    return false;
  }
  if (movement.from[0] == 'p') {
    freeCell.movePark(movement.card, movement.from[1], true);
    return true;
  }
  else if (movement.from[0] == 'h') {
    freeCell.moveHome(movement.card, movement.from[1], true);
    return true;
  }
  else if (movement.from[0] == 's') {
    freeCell.moveSquare(movement.card, movement.from[1], true);
    return true;
  }
  else {
    console.error('error in freeCell.undo()');
  }
  return false;
}