
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


  it('should get product data from localStorage', () => {
    const prods = loadProducts()
    expect(prods.length).toBe(3)
  })

  it('should get the user basket', () => {
    const basket = loadBasket()
    expect(basket).not.toBe(undefined)
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