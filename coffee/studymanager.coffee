#root = global  ? window
class StudyQueue
  constructor: (params) ->
    @showArchived = false
    @blankMsg = "(this side is blank)"
    @cards = new Array()
    @backFirst = false
    @cardFrontSel = ""
    @cardBackSel = ""
    @filters = new Array()
    @order = new Array()
    @tries = [0,0,0]
    @cardTries = new Object()
    @offset = 3  #base tries before show card again
    @flipped = false
    _.extend(this, params)
  beforeRestart: -> null
  beforeShowCard: -> null
  getCards: -> null  #function should be a fn returning array of cards from datastore
  showCardLabels: -> null
  onFlip: -> null
  onFinished: -> null
  updateStudyStatsView: -> null
  restart: (params) ->
    _.extend(this, params)
    @beforeRestart()
    log("restarting...")
    if not params or not params.cards
        cards = @getCards()
        @cards = cards if cards
    @reorder()
    @resetCounts()
    @updateStudyStatsView(this)
    if @order.length == 0
        showMsg "No cards to show with this filter"
        log "no cards to show with this filter"
        return

    @count = -1
    @flipped = false
    @showNextCard()

  result: (right) ->
    if right then @updateStats() else @requeueCurrentCard()
    @showNextCard()

  #refresh cards without restarting
  #useful when a card has been added to set or updated
  clearFilters: ->
    @filters = new Array()
    @showArchived = false
  refreshCards: (params) ->
    log "refreshing cards"
    @cards = @getCards()

  resetCounts: () ->
      @cardTries = new Object()
      @runCount = @leftInRun = @order.length
      @tries = [0,0,0]

  reorder: () ->
      order = (i for i in [0..@cards.length-1] when @inFilter(@getCard(@cards[i])))
      @order = permuteArray(order)

  #also resets count in card
  inFilter: (card) ->
    return false if not card
    return false if (not @showArchived) and card.archived
    return true if (not @filters) or @filters.length == 0
    return false if not card.labels #since is a filter
    log @filters
    filters = @filters
    for label in card.labels when valInArray(toString(label), filters)
      return true
    return false;

  requeueCurrentCard: () ->
    offset = @offset + Math.round(3 * Math.random());
    @incrementTries(@currentCard().id)
    addPosition = offset + @count
    cardAt = @order[@count]
    #log("show " + cardAt + " next after: ", offset) #THIS CAUSING ERROR - FIX IF UNCOMMENT
    if (addPosition >= @order.length) then @order.push(cardAt) else
      @order.splice(addPosition, 0, cardAt)

  incrementTries: (cardId) ->
    if @cardTries[cardId]
      @cardTries[cardId]++
    else
      @cardTries[cardId] = 1

  showNextCard: ->
    @count++;
    if @count >= @order.length
      log("reached end. restart?")
      @onFinished()
    else
      card = @currentCard()
      log "Showing: #{if card.front then card.front.substr(0,20) else "<blank>"}"
      @flipped = false
      @hideBack()
      #@showCard()
      @showFront()

  removeCurrentCardFromRun: ->
    @order.splice @count, 1
    @runCount--
    @leftInRun--
    @updateStudyStatsView(this)
    @count--
    @showNextCard()

  flip: (onFront) ->
      @flipped = !onFront
      @onFlip(onFront)

  redisplayCurrentCard: ->
    @showCard

  currentCard: ->
    log "showing card #{@count} of #{@order.length}"
    return null if @count >= @order.length
    card = @getCard(@cards[@order[@count]])


  getCard: (cardObj) ->
    if cardObj.card && (cardObj.card.front || cardObj.card.back)
        cardObj.card
    else
        cardObj

  showCard: ->
    #cardDebug(card)
    card = @currentCard()
    card = {front: "No cards to show with this filter", back: "No cards to show with this filter"} if !card
    log("showing card", card.front)
    @beforeShowCard.call card, card
    @showCardLabels card
    @showCardFields card

  showCardFields: (card) ->
      front = if @backFirst then card.back else card.front
      back = if @backFirst then card.front else card.back
      log "showCardFields", front, back
      $(@cardFrontSel).html(multiline(@formatCardText(front)))
      $(@cardBackSel).html(multiline(@formatCardText(back)))

  updateStats: () ->
      @leftInRun--
      cardTries = @cardTries[@currentCard().id]
      index = if cardTries then Math.min(cardTries, 2) else 0
      @tries[index]++
      @updateStudyStatsView(this)

  formatCardText: (msg) ->
      if (msg and $.trim(msg).length > 0) then msg else @blankMsg

permutedOrder = (length) ->
    permuteArray (num for num in [0..length])

permuteArray = (array) ->
    return array.sort(()-> return 0.5 - Math.random() )