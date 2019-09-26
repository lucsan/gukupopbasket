
// window.onload = () => {
//   let o = document.createElement('div')
//   o.id = 'appOutput'
//   document.body.appendChild(o)  
// }


describe('app', () => {

  beforeAll(() => {
    let o = document.createElement('div')
    o.id = 'appOutput'
    document.body.appendChild(o)     
  })


  const productsList = [
    { code: 'GOKU', name: 'Goku POP', price: '5.00', cur: 'euro', sym: '€' },
    { code: 'NARU', name: 'Naruto POP', price: '20.00', cur: 'euro', sym: '€' },
    { code: 'LUF', name: 'Luffy POP', price: '7.50', cur: 'euro', sym: '€' },

  ]

  localStorage.setItem(PRODUCT_STORE, JSON.stringify(productsList))

  const userCode = 'uUid'

  describe('products', () => {

    it('should get product data from localStorage', () => {
      const prods = loadProducts()
      expect(prods.length).toBe(3)
    })


    it('should render the products list', () => {
      renderProducts(loadProducts())
      const products = document.getElementById('products')
      expect(products
        .childNodes[0]
        .childNodes[1]
        .childNodes[0]
        .innerText).toBe(productsList[1].name)
      document.getElementById('products').remove()    
    })

    it('should render the product details', () => {
      renderProducts(loadProducts())
      const products = document.getElementById('products')
      expect(products
        .childNodes[0]
        .childNodes[1]
        .childNodes[2]
        .innerText).not.toBe(undefined)
      document.getElementById('products').remove()     
    })

  
    it('should format price from price, and currency symbol', () => {
      const price = formatPrice(productsList[1])
      expect(price).toBe(`${productsList[1].price}${productsList[1].sym}`)
    })
  
    it('should render quantity controls', () => {
      let qControl = renderQuantityControls()
      expect(qControl.childNodes[0].innerText).toBe('+')
    })

  })

  describe('user', () => {

    it('should get the user basket', () => {
      const basket = readBasket()
      expect(basket).not.toBe(null || undefined)
    })

    it('should create a user basket if there isn\'t one', () => {
      localStorage.removeItem(BASKET)
      writeBasket({})
      const basket = readBasket()
      expect(basket).not.toBe(null || undefined)
    })

    // it('should check if the basket has a userCode (if not, they are not logged on)', () => {
    //   expect(1).toBe(2)
    // })

  })









})