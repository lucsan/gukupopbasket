
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

  const userBasket = {
    userCode: '',
    products: {
      'test': { code: 'test', quantity: 'test' },
    }
  }

  const userCode = 'uUid'

  describe('products', () => {

    it('should get product data from localStorage', () => {
      const prods = readProducts()
      expect(prods.length).toBe(3)
    })


    it('should render the products list', () => {
      renderProducts(readProducts())
      const products = document.getElementById('products')
      expect(products
        .childNodes[0]
        .childNodes[1]
        .childNodes[0]
        .innerText).toBe(productsList[1].name)
      document.getElementById('products').remove()    
    })

    it('should render the product details', () => {
      renderProducts(readProducts())
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

    it('should add items to the basket', () => {
      localStorage.removeItem(BASKET)
      const basket = updateBasket('NARU', 1)
      expect(basket.products['NARU'].code).toBe('NARU')
    })

    it('should increment the quantity if an item code already exists', () => {
      localStorage.removeItem(BASKET)
      updateBasket('NARU', 1)
      updateBasket('NARU', 2)
      const basket = readBasket() 
      expect(basket.products['NARU'].quantity).toBe(3)
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

    it('should check the basket for a specific product', () => {
      updateBasket('NARU', 1)
      let product = checkBasketForProduct('NARU')
      expect(product.code).toBe('NARU')
    })

    it('should update the productList view (shopping cart) with quantity', () => {
      updateBasket('NARU', 5)
      renderProducts(readProducts())
      const products = document.getElementById('products')

      expect(products
        .childNodes[0]
        .childNodes[1]
        .childNodes[1]
        .childNodes[1]
        .value).not.toBe(5)

      document.getElementById('products').remove()  
    })

    // it('should total the value of products in the basket', () => {
    //   updateBasket('NARU', 3, true)
    //   const basket = readBasket()
    //   calcTotal()
    //   expect(1).toBe(2)
    // })

  })









})