const PRODUCT_STORE = 'ipresence_products'
const BASKET = 'ipresence_basket'
const OUTPUT = 'appOutput'
const DISPATCH = 'ipresence_dispatch'



const app = () => {

  const main = () => {
    console.log('main')
    
    renderProducts(readProducts())
    renderSummary()
  }
  
  return {
    main
  }
}

document.addEventListener(DISPATCH, (event) => {
  const  { action, code, value } = event.detail
  const pList = readProducts()
  if (action == 'more') {   
    updateBasket(code, 1)
    renderProducts(pList)
    renderSummary()
    return
  }
  if (action == 'less') {   
    updateBasket(code, -1)
    renderProducts(pList)
    renderSummary()
    return
  }
  if (action == 'change') {
    if (isNaN(value)) return
    updateBasket(code, value, true)
    renderTotal(code)
    renderSummary()
    return
  }

  console.error('Unkown or unspecified action', event.detail)
})

const dispatch = (detail) => {
  document.dispatchEvent(
    new CustomEvent(
      DISPATCH,
      { detail: detail }
    )
  )
}

const readProducts = () => {
  return JSON.parse(localStorage.getItem(PRODUCT_STORE))
}

const readBasket = () => {
  return JSON.parse(localStorage.getItem(BASKET))
}

const writeBasket = (data) => {
  localStorage.setItem(BASKET, JSON.stringify(data))
}

const updateBasket = (productCode, quantity, isNewQuantity = false) => {
  if (!productCode && quantity) return 'error'
  let basket = createBasket(readBasket())
  let newQuantity = calcProductQuantity(basket, productCode, quantity, isNewQuantity)
  basket.products[productCode] =  { code: productCode, quantity: newQuantity } 
  writeBasket(basket)
  return basket
}

const calcProductQuantity = (basket, productCode, quantity, isNewQuantity) => {
  if (!quantity) return 0
  const p = basket.products[productCode]
  if (p == undefined) return quantity
  if (isNewQuantity) return quantity
  return (p.quantity - 0) + (quantity - 0)
}

const createBasket = (basket) => {
  if (!basket) basket = {}
  if (!basket.products) basket.products = {}
  return basket
}

const checkBasketForProduct = (productCode) => {
  const basket = readBasket()
  if (!basket.products) return
  return basket.products[productCode]
}

const checkProductsForProduct = (productCode) => {
  const products = readProducts()
  return products.find(p => p.code == productCode)
}

const renderProducts = (pList) => {
  let pl = document.getElementById('productsList')
  if (pl) pl.remove()
  let l = appTools().el('ul', {id: 'productsList' })
  pList.map(p => {
    l.appendChild(renderProductDetails(p))
  })

  let p = appTools().el('div', { id: 'products' })
  let o = document.getElementById(OUTPUT)   
  p.appendChild(l) 
  o.appendChild(p)  
}

const renderProductDetails = (product) => {
  let userQuantity = 0
  let userProduct = checkBasketForProduct(product.code)
  if (userProduct) userQuantity = (userProduct.quantity - 0)
  if (!product.quantity) product.quantity = 0
  let li = appTools().el('li', { id: `${product.code}` })
  let name = appTools().el('div', { classes: 'product-name', text: product.name } )
  let price = appTools().el('div', { classes: 'product-price', text: formatPrice(product) } )
  let quantity = renderQuantityControls(product.code, (userQuantity + (product.quantity - 0)))
  let totalLine = appTools().el('div', { classes: 'line-total', text: formatTotal(product, calcTotal(product.code)) })

  li.appendChild(name)
  li.appendChild(quantity)
  li.appendChild(price)
  li.appendChild(totalLine)
  return li
}

const renderTotal = (productCode) => {
  let pe = document.querySelector(`#productsList li#${productCode} .line-total`)
  pe.innerText = formatTotal(checkProductsForProduct(productCode), calcTotal(productCode))
}

const calcTotal = (productCode) => {
  const product = checkProductsForProduct(productCode)
  const basketItem = checkBasketForProduct(productCode)
  if (!basketItem) return 0
  return (product.price - 0) * (basketItem.quantity - 0)
}

const formatTotal = (product, value) => {
  const { cur, sym } = product
  let displayPrice = ''
  if (cur == 'euro') displayPrice = `${value}.00${sym}`
  if (cur == 'gbp') displayPrice = `${sym} ${value}.00`
  return displayPrice  
}

const formatPrice = (product) => {
  const { price, cur, sym } = product
  let displayPrice = ''
  if (cur == 'euro') displayPrice = `${price}${sym}`
  if (cur == 'gbp') displayPrice = `${sym} ${price}`
  return displayPrice
}

const renderQuantityControls = (productCode, quantity) => {
  if (!quantity) quantity = 0
  let more = appTools().el('span', { text: '+' })
  let less = appTools().el('span', { text: '-' })
  let quant = appTools().el('input', { value: `${quantity}` })
  let control = appTools().el('div', { classes: 'product-quantity' })
  more.addEventListener('click', () => { dispatch({ code: productCode, action: 'more' } ) })
  less.addEventListener('click', () => { dispatch({ code: productCode, action: 'less' } ) })
  quant.addEventListener('keyup', () => { dispatch({ code: productCode, action: 'change', value: quant.value } ) })
  
  control.appendChild(more)
  control.appendChild(quant)
  control.appendChild(less)
  return control
}

const renderSummary = () => {
  let oe = document.getElementById(OUTPUT)
  let ose = document.getElementById('orderSummary')
  if (ose) ose.remove()
  let swe = appTools().el('div', { id: 'orderSummary' })
  let ste = appTools().el('div', { classes: 'title, order-title', text: 'Order Summary' })
  swe.appendChild(ste)

  const basket = readBasket()

  for (let p in basket.products) {
    const product = checkProductsForProduct(p)
    const item = basket.products[p]
    const total = formatTotal(product, calcTotal(p))
    let text = `${item.quantity} x ${product.name} = ${total}`
    let pe = appTools().el('div', { text })
    swe.appendChild(pe)
  }

  oe.appendChild(swe)

  const de = appTools().el('div', { text: 'Discounts' })

  const be = appTools().el('div', { text: 'Basket Total' })
  
  const ce = appTools().el('div', { text: 'Checkout', classes: '' })

  swe.appendChild(de)
  swe.appendChild(be)
  swe.appendChild(ce)

}

const calcBasket = () => {
  
}

const calcDiscounts = () => {
  
}


const appTools = () => {

  const el = (tag, params = {}) => {
    const { id, classes, text, value, data } = params
    let e = document.createElement(tag)
    if (id) e.id = id
    if (classes) e.className = classes
    if (text) e.innerText = text
    if (value) e.value = value
    if (data) e.setAttribute(`data-${data.name}`, data.value)
    return e
  }  

  return {
    el
  }
}


