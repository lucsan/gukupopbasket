const PRODUCT_STORE = 'ipresence_products'
const BASKET = 'ipresence_basket'
const OUTPUT = 'appOutput'
const DISPATCH = 'ipresence_dispatch'



const app = () => {

  const main = () => {
    console.log('main')
    
    renderProducts(readProducts())
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
  }
  if (action == 'less') {   
    updateBasket(code, -1)
    renderProducts(pList) 
  }
  if (action == 'change') {
    if (isNaN(value)) return
    updateBasket(code, value, true)
    
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

const renderProducts = (pList) => {
  let pl = document.getElementById('productsList')
  if (pl) pl.remove()
  let l = appTools().el('ul', {id: 'productsList' })
  pList.map(p => {
    l.appendChild(renderProductDetails(p))
  })

  let p = appTools().el('div', { id: 'products' })
  let o = document.getElementById('appOutput')   
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
  let totalLine = appTools().el('div', { classes: 'line-total', text: 'total' })

  li.appendChild(name)
  li.appendChild(quantity)
  li.appendChild(price)
  li.appendChild(totalLine)
  return li
}

const calcTotal = () => {
  
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


