var StudyQueue, permuteArray, permutedOrder;
StudyQueue = (function() {
  function StudyQueue(params) {
    this.showArchived = false;
    this.blankMsg = "(this side is blank)";
    this.cards = new Array();
    this.backFirst = false;
    this.cardFrontSel = "";
    this.cardBackSel = "";
    this.filters = new Array();
    this.order = new Array();
    this.tries = [0, 0, 0];
    this.cardTries = new Object();
    this.offset = 3;
    this.flipped = false;
    _.extend(this, params);
  }
  StudyQueue.prototype.beforeRestart = function() {
    return null;
  };
  StudyQueue.prototype.beforeShowCard = function() {
    return null;
  };
  StudyQueue.prototype.getCards = function() {
    return null;
  };
  StudyQueue.prototype.showCardLabels = function() {
    return null;
  };
  StudyQueue.prototype.onFlip = function() {
    return null;
  };
  StudyQueue.prototype.onFinished = function() {
    return null;
  };
  StudyQueue.prototype.updateStudyStatsView = function() {
    return null;
  };
  StudyQueue.prototype.restart = function(params) {
    var cards;
    _.extend(this, params);
    this.beforeRestart();
    log("restarting...");
    if (!params || !params.cards) {
      cards = this.getCards();
      if (cards) {
        this.cards = cards;
      }
    }
    this.reorder();
    this.resetCounts();
    this.updateStudyStatsView(this);
    if (this.order.length === 0) {
      showMsg("No cards to show with this filter");
      log("no cards to show with this filter");
      return;
    }
    this.count = -1;
    this.flipped = false;
    return this.showNextCard();
  };
  StudyQueue.prototype.result = function(right) {
    if (right) {
      this.updateStats();
    } else {
      this.requeueCurrentCard();
    }
    return this.showNextCard();
  };
  StudyQueue.prototype.clearFilters = function() {
    this.filters = new Array();
    return this.showArchived = false;
  };
  StudyQueue.prototype.refreshCards = function(params) {
    log("refreshing cards");
    return this.cards = this.getCards();
  };
  StudyQueue.prototype.resetCounts = function() {
    this.cardTries = new Object();
    this.runCount = this.leftInRun = this.order.length;
    return this.tries = [0, 0, 0];
  };
  StudyQueue.prototype.reorder = function() {
    var i, order;
    order = (function() {
      var _ref, _results;
      _results = [];
      for (i = 0, _ref = this.cards.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        if (this.inFilter(this.getCard(this.cards[i]))) {
          _results.push(i);
        }
      }
      return _results;
    }).call(this);
    return this.order = permuteArray(order);
  };
  StudyQueue.prototype.inFilter = function(card) {
    var filters, label, _i, _len, _ref;
    if (!card) {
      return false;
    }
    if ((!this.showArchived) && card.archived) {
      return false;
    }
    if ((!this.filters) || this.filters.length === 0) {
      return true;
    }
    if (!card.labels) {
      return false;
    }
    log(this.filters);
    filters = this.filters;
    _ref = card.labels;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      label = _ref[_i];
      if (valInArray(toString(label), filters)) {
        return true;
      }
    }
    return false;
  };
  StudyQueue.prototype.requeueCurrentCard = function() {
    var addPosition, cardAt, offset;
    offset = this.offset + Math.round(3 * Math.random());
    this.incrementTries(this.currentCard().id);
    addPosition = offset + this.count;
    cardAt = this.order[this.count];
    if (addPosition >= this.order.length) {
      return this.order.push(cardAt);
    } else {
      return this.order.splice(addPosition, 0, cardAt);
    }
  };
  StudyQueue.prototype.incrementTries = function(cardId) {
    if (this.cardTries[cardId]) {
      return this.cardTries[cardId]++;
    } else {
      return this.cardTries[cardId] = 1;
    }
  };
  StudyQueue.prototype.showNextCard = function() {
    var card;
    this.count++;
    if (this.count >= this.order.length) {
      log("reached end. restart?");
      return this.onFinished();
    } else {
      card = this.currentCard();
      log("Showing: " + (card.front ? card.front.substr(0, 20) : "<blank>"));
      this.flipped = false;
      this.hideBack();
      return this.showFront();
    }
  };
  StudyQueue.prototype.removeCurrentCardFromRun = function() {
    this.order.splice(this.count, 1);
    this.runCount--;
    this.leftInRun--;
    this.updateStudyStatsView(this);
    this.count--;
    return this.showNextCard();
  };
  StudyQueue.prototype.flip = function(onFront) {
    this.flipped = !onFront;
    return this.onFlip(onFront);
  };
  StudyQueue.prototype.redisplayCurrentCard = function() {
    return this.showCard;
  };
  StudyQueue.prototype.currentCard = function() {
    var card;
    log("showing card " + this.count + " of " + this.order.length);
    if (this.count >= this.order.length) {
      return null;
    }
    return card = this.getCard(this.cards[this.order[this.count]]);
  };
  StudyQueue.prototype.getCard = function(cardObj) {
    if (cardObj.card && (cardObj.card.front || cardObj.card.back)) {
      return cardObj.card;
    } else {
      return cardObj;
    }
  };
  StudyQueue.prototype.showCard = function() {
    var card;
    card = this.currentCard();
    if (!card) {
      card = {
        front: "No cards to show with this filter",
        back: "No cards to show with this filter"
      };
    }
    log("showing card", card.front);
    this.beforeShowCard.call(card, card);
    this.showCardLabels(card);
    return this.showCardFields(card);
  };
  StudyQueue.prototype.showCardFields = function(card) {
    var back, front;
    front = this.backFirst ? card.back : card.front;
    back = this.backFirst ? card.front : card.back;
    log("showCardFields", front, back);
    $(this.cardFrontSel).html(multiline(this.formatCardText(front)));
    return $(this.cardBackSel).html(multiline(this.formatCardText(back)));
  };
  StudyQueue.prototype.updateStats = function() {
    var cardTries, index;
    this.leftInRun--;
    cardTries = this.cardTries[this.currentCard().id];
    index = cardTries ? Math.min(cardTries, 2) : 0;
    this.tries[index]++;
    return this.updateStudyStatsView(this);
  };
  StudyQueue.prototype.formatCardText = function(msg) {
    if (msg && $.trim(msg).length > 0) {
      return msg;
    } else {
      return this.blankMsg;
    }
  };
  return StudyQueue;
})();
permutedOrder = function(length) {
  var num;
  return permuteArray((function() {
    var _results;
    _results = [];
    for (num = 0; 0 <= length ? num <= length : num >= length; 0 <= length ? num++ : num--) {
      _results.push(num);
    }
    return _results;
  })());
};
permuteArray = function(array) {
  return array.sort(function() {
    return 0.5 - Math.random();
  });
};