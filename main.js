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
    if (!card.classList.contains('back')) {
      return
    }
    switch (this.currentStatus) {
      case GAME_STATE.FirstCardAwaits:
        view.flipCard(card)
        model.revealedCards.push(card)
        this.currentStatus = GAME_STATE.SecondCardAwaits
        break
      case GAME_STATE.SecondCardAwaits:
        view.flipCard(card)
        model.revealedCards.push(card)
        console.log('revealedCards:', model.revealedCards.map(card => card.dataset.index))
        console.log('currentStatus:', this.currentStatus)

        // 判斷兩張數字是否相同
        if (model.isRevealedCardsMatched()) { // 兩張牌數字相同
          this.currentStatus = GAME_STATE.CardsMatched // 進入 matched 狀態
          console.log('配對成功')
          model.revealedCards[0].classList.add('paired') // 維持翻開、卡片底色改變
          model.revealedCards[1].classList.add('paired') // 維持翻開、卡片底色改變
          model.revealedCards = []// 清空revealedCards
          this.currentStatus = GAME_STATE.FirstCardAwaits // 回到 firstCardAwaits 狀態
          return
        } else {
          console.log('配對失敗') // 兩張牌數字不同
          this.currentStatus = GAME_STATE.CardsMatchFailed // 進入 unmatched 狀態
          setTimeout(() => { // 延遲1秒動畫
            view.flipCard(model.revealedCards[0])// 翻回背面 
            view.flipCard(model.revealedCards[1])// 翻回背面 
            model.revealedCards = []// 清空revealedCards
          }, 1000)
          this.currentStatus = GAME_STATE.FirstCardAwaits // 回到 firstCardAwaits 狀態
        }
        break
    }
  }
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

  flipCard(card) {
    // 回傳正面
    if (card.classList.contains('back')) {
      card.classList.remove('back')
      return card.innerHTML = this.getCardContent(Number(card.dataset.index))
    }
    // 回傳背面
    card.classList.add('back')
    card.innerHTML = null
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