const SuitEnum = {
	SPADE: 0,
  HEART: 1,
  DIAMOND: 2,
  CLUB: 3
}

const ColorEnum = {
  BLACK: 'black',
  RED: 'red'
}

const PileEnum = {
  CELL: 0,
  FOUNDATION: 1,
  TABLEAU: 2,
  HAND: 3
}

class Card {
  // 建構函式
  constructor(suit, point) {
    this.suit = suit;
    this.point = point;
    if (suit == SuitEnum.HEART || suit == SuitEnum.DIAMOND) {
      this.color = ColorEnum.RED;
    } else {
      this.color = ColorEnum.BLACK;
    }
  }
  toString() {
    let  suitString, pointString;
    switch (this.suit) {
      case SuitEnum.SPADE:
        suitString = '\u2660';
        break;
      case SuitEnum.HEART:
        suitString = '\u2665';
        break;
      case SuitEnum.DIAMOND:
        suitString = '\u2666';
        break;
      case SuitEnum.CLUB:
        suitString = '\u2663';
        break;
      default:
        // statements_def
        break;
    }
    switch (this.point) {
      case 1:
        pointString = 'A';
        break;
      case 13:
        pointString = 'K';
        break;
      case 12:
        pointString = 'Q';
        break;
      case 11:
        pointString = 'J';
        break;
      default:
        pointString = this.point.toString();
        break;
    }
    return ' ' + suitString + pointString;
  }
  valueOf() {
    return this.point;
  }
  static isSameSuit(card1, card2) {
    return card1.suit == card2.suit;
  }
  static isSameColor(card1, card2) {
    return card1.color == card2.color;
  }
  print() {
    console.log('%c'+ this.toString(), 'color:' + this.color); 
  }
}

class Deck {
  // 建構函式
  constructor(cards = [], maxSize = 99, canTake = function() {}, canPlace = function() {}) {
    this.cards = cards;
    this.maxSize = maxSize;
    this.canTake = function(number) {
      if (number > this.size()) {
        return false;
      }
      return canTake(number);
    };
    this.canPlace = function(deck) {
      if (deck.size() + this.size() > this.maxSize) {
        return false;
      }
      return canPlace(deck);
    }
  }
  size() {
    return this.cards.length;
  }
  isEmpty() {
    return this.cards.length == 0;
  }
  push(card) {
    if (this.cards.length < this.maxSize) {
      this.cards.push(card);
    } else {
      return false;
    }
  }
  take(number) {
    return new Deck(this.cards.splice(this.cards.length - number, number));
  }
  place(deck) {
    this.cards = this.cards.concat(deck.cards);
  }
  shuffle() {
    let length = this.cards.length;
    let random;
    while (length) {
      random = Math.floor(Math.random() * length--);
      [this.cards[length], this.cards[random]] = [this.cards[random], this.cards[length]];
    }
  }
  toString() {
    let string = '['
    for (let c of this.cards) {
      string += c.toString();
    }
    return string + ']';
  }
  print() {
    let string = '', css = [];
    for (let c of this.cards) {
      string += '%c' + c.toString();
      css.push('color:' + c.color);
    }
    console.log(string, ...css);
  }
  static fullSet() {
    let deck = new Deck([], 52);
    for (let suit in SuitEnum) {
      for (let point = 1; point <= 13; point++) {
        deck.push(new Card(SuitEnum[suit], point));
      }
    }
    return deck;
  }
  static isSameSuit(deck1, deck2 = new Deck()) {
    let cards = deck1.cards.concat(deck2.cards);
    for (let i = 0; i < cards.length - 1; i++) {
      if (!Card.isSameSuit(cards[i], cards[i + 1])) {
        return false;
      }
    }
    return true;
  }
  static isAltColor(deck1, deck2 = new Deck()) {
    let cards = deck1.cards.concat(deck2.cards);
    for (let i = 0; i < cards.length - 1; i++) {
      if (Card.isSameColor(cards[i], cards[i + 1])) {
        return false;
      }
    }
    return true;
  }
  static isAscSeq(deck1, deck2 = new Deck()) {
    let cards = deck1.cards.concat(dek2.cards);
    for (let i = 0; i < cards.length - 1; i++) {
      if (cards[i] - cards[i + 1] != -1) {
        return false;
      }
    }
    return true;
  }
  static isDscSeq(deck1, deck2 = new Deck()) {
    let cards = deck1.cards.concat(deck2.cards);
    for (let i = 0; i < cards.length - 1; i++) {
      if (cards[i] - cards[i + 1] != 1) {
        return false;
      }
    }
    return true;
  }
}

class FreeCell {
  constructor() {
    this.gameBoard = [[], [], [], []];
    this.initialize();
    this.gameBoard[PileEnum.CELL][0].canTake(2);
    this.history = [];
    console.log(this.gameBoard);
  }
  initialize() {
    for (let i = 0; i < 4; i++) {
      this.gameBoard[PileEnum.CELL].push(new Deck([], 1, FreeCell.cellTake));
      this.gameBoard[PileEnum.FOUNDATION].push(new Deck([], 13));
    }
    for (let i = 0; i < 8; i++) {
      this.gameBoard[PileEnum.TABLEAU].push(new Deck());
    }
    this.gameBoard[PileEnum.HAND].push(new Deck());
  }
  deal() {
    let deck = Deck.fullSet();
    deck.shuffle();
    for (let i = 0; !deck.isEmpty(); i++) {
      this.gameBoard[PileEnum.TABLEAU][i % 8].place(deck.take(1));
    }
  }
  move(from, to, number) {
    let deck = from.take(number);
    to.place(deck);
    let movement = {
      from: from,
      to: to,
      number: number
    }
    this.history.push(movement);
  }
  undo(number) {
    for (let i = 0; i < number; i++) {
      let movement = this.history.pop();
    }
  }
  print() {
    console.log('CELL');
    for (let c of this.gameBoard[PileEnum.CELL]) {
      c.print();
    }
    console.log('FOUNDATION');
    for (let f of this.gameBoard[PileEnum.FOUNDATION]) {
      f.print();
    }
    console.log('TABLEAU');
    for (let t of this.gameBoard[PileEnum.TABLEAU]) {
      t.print();
    }
    console.log('HAND');
    for (let h of this.gameBoard[PileEnum.HAND]) {
      h.print();
    }
  }
  static cellTake(number) {
    return true;
  }
  static cellPlace(deck) {
    return true;
  }
  static foundationTake(number) {
    if (number <= 1 && this.size() - number >= 1) {
      return true;
    }
    return false;
  }
  static foundationPlace(deck) {
    if (deck.size() <= 1 && Deck.isSameSuit(deck, this) && Deck.isAscSeq(deck, this)) {
      return true;
    }
    return false;
  }
  static tableauTake(number) {
    let deck = this.take(number);
    if (Deck.isDscSeq(deck) && Deck.isAltColor(deck)) {
      this.place(deck);
      return true;
    }
    this.place(deck);
    return false;
  }
  static tableauPlace(deck) {
    let top = this.take(1);
    if (Deck.isDscSeq(top, deck) && Deck.isAltColor(top, deck)) {
      this.place(deck);
      return true;
    }
    this.place(deck);
    return false;
  }
  static handTake(number) {
    if (number == this.size()) {
      return true;
    }
    return false;
  }
  static handPlace(deck) {
    if (Deck.isDscSeq(deck) && Deck.isAltColor(deck)) {
      return true;
    }
    return false;
  }
}