const SuitEnum = {
	SPADE: 0,
  HEART: 1,
  DIAMOND: 2,
  CLUB: 3
}

const ColorEnum = {
  BLACK: 0,
  RED: 1
}

class Card {
  // 建構函式
  constructor(suit, point) {
    console.log(suit, point);
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
}

class Deck {
  // 建構函式
  constructor(cards = [], maxSize = 99) {
    this.cards = cards;
    this.maxSize = maxSize;
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
    this.cards.concat(deck.cards);
  }
}