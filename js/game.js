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
  constructor(cards = [], maxSize = 99) {
    this.cards = cards;
    this.maxSize = maxSize;
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
}

class FreeCell {
  constructor() {
    this.gameBoard = [[], [], [], []];
    this.initialize();
    console.log(this.gameBoard);
  }
  initialize() {
    for (let i = 0; i < 4; i++) {
      this.gameBoard[PileEnum.CELL].push(new Deck([], 1));
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
}