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

  getCardElement(index) {
    // index
    // 0~12 => 黑桃1~13
    // 13~25 => 紅心1~13
    // 26~38 => 方塊1~13
    // 39~51 => 梅花1~13
    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]
    let rawHtml = `
      <div class="card">
        <p>${number}</p>
        <img src="${symbol}" alt="">
        <p>${number}</p>
      </div>
    `
    return rawHtml
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
    const array = Array.from(Array(count).keys())
    for (let index = array.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1))
        ;[array[index], array[randomIndex]] = [array[randomIndex], array[index]]
    }
    return array
  }
}


// EXECUTING /////////////////////////////////////////
view.displayCards(utility.getRandomNumberArray(52))