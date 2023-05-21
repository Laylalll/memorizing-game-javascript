// DATA & FUNCTION /////////////////////////////////////////
const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

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

  getCardElement(index) { //取得牌背面元素 & index
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
view.displayCards(utility.getRandomNumberArray(52))

document.querySelectorAll('.card').forEach(
  card => card.addEventListener('click', function (event) {
    view.flipCard(card)
  })
)