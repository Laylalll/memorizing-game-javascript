// DATA & FUNCTION /////////////////////////////////////////
const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]
const GAME_STATE = {
  FirstCardAwaits: 'FirstCardAwaits',
  SecondCardAwaits: 'SecondCardAwaits',
  CardsMatchFailed: 'CardsMatchFailed',
  CardsMatched: 'CardsMatched',
  GameFinished: 'GameFinished'
}

const model = {
  score: 0,
  triedTimes: 0,
  revealedCards: [],
  isRevealedCardsMatched() {
    return model.revealedCards[0].dataset.index % 13 === model.revealedCards[1].dataset.index % 13
  }
}

const controller = {
  currentStatus: GAME_STATE.FirstCardAwaits,
  generateCards() { //遊戲呼叫初始化
    view.displayCards(utility.getRandomNumberArray(52))
  },
  dispatchCardAction(card) {
    if (!card.classList.contains('back')) { //錯誤處理：正面向上的牌，不能在點擊
      return
    }
    switch (this.currentStatus) {
      case GAME_STATE.FirstCardAwaits: //在FirstCardAwaits狀態的時候
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentStatus = GAME_STATE.SecondCardAwaits
        break
      case GAME_STATE.SecondCardAwaits: //在SecondCardAwaits狀態的時候
        view.renderTriedTimes(++model.triedTimes) //++為前綴，會先進行遞增，再將遞增後的結果回傳
        view.flipCards(card)
        model.revealedCards.push(card)
        // 判斷兩張數字是否相同
        if (model.isRevealedCardsMatched()) {
          // 配對成功
          this.currentStatus = GAME_STATE.CardsMatched
          view.renderScore(model.score += 10)
          view.pairCards(...model.revealedCards) // 維持翻開、卡片底色改變
          model.revealedCards = []
          if (model.score === 260) { // 判斷是否完成遊戲
            this.currentStatus = GAME_STATE.GameFinished
            view.showGameFinished()
            return
          }
          this.currentStatus = GAME_STATE.FirstCardAwaits
        } else {
          // 配對失敗
          this.currentStatus = GAME_STATE.CardsMatchFailed
          view.appendWrongAnimation(...model.revealedCards)
          // 延遲1秒後resetCards
          setTimeout(this.restCards, 1000)
        }
        break
    }
    console.log('revealedCards:', model.revealedCards.map(card => card.dataset.index))
    console.log('currentStatus:', this.currentStatus)
  },

  restCards() {
    view.flipCards(...model.revealedCards)// 翻回背面
    model.revealedCards = []
    // console.log(this) //因為當成參數傳入 setTimeout()，所以 this 指向的對象變成 setTimeout
    controller.currentStatus = GAME_STATE.FirstCardAwaits //原本的 this 改成 controller
  },

}


view = {
  displayCards(indexes) {
    const cardsTable = document.querySelector('#cards')
    const cards = indexes
    const rawHtml = cards.map(index => this.getCardElement(index)).join('')
    cardsTable.innerHTML = rawHtml
  },

  getCardContent(index) { //取得牌正面元素
    // index
    // 0~12 => 黑桃1~13
    // 13~25 => 紅心1~13
    // 26~38 => 方塊1~13
    // 39~51 => 梅花1~13
    const number = this.transformNumber((index % 13) + 1) //運算 number + 特殊數字轉換
    const symbol = Symbols[Math.floor(index / 13)] //運算花色
    let rawHtml = `
        <p>${number}</p>
        <img src="${symbol}" alt="">
        <p>${number}</p>
    `
    return rawHtml
  },

  getCardElement(index) { //取得牌背面元素 & card index
    return `<div class="card back" data-index=${index}></div>`
  },

  transformNumber(number) {
    switch (number) {
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      case 1:
        return 'A'
      default:
        return number
    }
  },

  flipCards(...cards) {
    // console.log(card.dataset.index)
    cards.map(card => {
      // 回傳正面
      if (card.classList.contains('back')) {
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
        return
      }
      // 回傳背面
      card.classList.add('back')
      card.innerHTML = null
    })
  },

  pairCards(...cards) {
    cards.map(card => { card.classList.add('paired') })
  },

  renderTriedTimes(times) {
    document.querySelector('.tried').textContent = `You've tried ${times} times.`
  },

  renderScore(score) {
    document.querySelector('.score').textContent = `Score:${score}`
  },

  appendWrongAnimation(...cards) {
    cards.map(card => {
      card.classList.add('wrong')
      card.addEventListener('animationend', (event) => {
        event.target.classList.remove('wrong')
      }, { once: true })
    })
  },

  showGameFinished() {
    // 創建元素 + 加入元素 + 插入節點
    const div = document.createElement('div')
    div.classList.add('completed')
    div.innerHTML = `
      <p>Complete</p>
      <p>Score:${model.score}</p>
      <p>You've tried:${model.triedTimes}times</p>
    `
    const header = document.querySelector('#header')
    header.before(div)
  }

}

const utility = {
  getRandomNumberArray(count) {
    const array = Array.from(Array(count).keys()) //建立指定元素數量(0~51)的陣列
    //從底牌開始，將它抽出，與前面任一張牌交換，(此動作重複執行到倒數第二張牌)
    for (let index = array.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1))
        ;[array[index], array[randomIndex]] = [array[randomIndex], array[index]]
    }
    return array
  }
}


// EXECUTING /////////////////////////////////////////
controller.generateCards()

document.querySelectorAll('.card').forEach(
  card => card.addEventListener('click', function (event) {
    controller.dispatchCardAction(card)
  })
)