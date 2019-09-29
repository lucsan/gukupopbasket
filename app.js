const PRODUCT_STORE = 'ipresence_products'
const BASKET = 'ipresence_basket'
const OUTPUT = 'appOutput'
const DISPATCH = 'ipresence_dispatch'
const PRODUCTS = 'products'



const app = () => {

  const main = () => {
    console.log('main')
    let output = document.getElementById(OUTPUT)
    output.className = 'columns'
    let p = appTools().el('div', { id: 'products', classes: 'column is-two-thirds' })
    let pt = appTools().el('div', { text: 'Shopping Cart', classes: 'title product-title' })
    let ct = appTools().el('div', { classes: 'column-products-titles' })
    let nt = appTools().el('span', { text: 'Product', classes: 'product-title' })
    let qt = appTools().el('span', { text: 'Quantity', classes: 'quantity-title' })
    let prt = appTools().el('span', { text: 'Price', classes: 'price-title' })
    let tt = appTools().el('span', { text: 'Total', classes: 'total-title' })
    p.appendChild(pt)
    ct.appendChild(nt)
    ct.appendChild(qt)
    ct.appendChild(prt)
    ct.appendChild(tt)
    p.appendChild(ct)
    output.appendChild(p)
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
  pList.map(p => { l.appendChild(renderProductDetails(p)) }) 
  let p = document.getElementById(PRODUCTS)    
  p.appendChild(l)  
}

const renderProductDetails = (product) => {
  const { cur, sym, price } = product
  let userQuantity = 0
  let userProduct = checkBasketForProduct(product.code)
  if (userProduct) userQuantity = (userProduct.quantity - 0)
  if (!product.quantity) product.quantity = 0
  let li = appTools().el('li', { id: `${product.code}`, classes: 'columns' })
  let imageEl = appTools().el('img', { src: 'unknown', classes: 'product-image' })
  let nameEl = appTools().el('div', { classes: 'product-name', text: product.name } )
  let codeEl = appTools().el('div', { text: `Product code ${product.code}`, classes: 'product-code' })
  let priceEl = appTools().el('div', { classes: 'product-price', text: appTools().formatPrice({ cur, sym, price }) } )
  let quantityEl = renderQuantityControls(product.code, (userQuantity + (product.quantity - 0)))
  let totalLineEl = appTools().el('div', { classes: 'line-total', text: appTools().formatPrice({ cur, sym, price: calcTotal(product.code)}) })

  li.appendChild(imageEl)
  nameEl.appendChild(codeEl)
  li.appendChild(nameEl)
  li.appendChild(quantityEl)
  li.appendChild(priceEl)
  li.appendChild(totalLineEl)
  return li
}

const renderTotal = (productCode) => {
  let pe = document.querySelector(`#productsList li#${productCode} .line-total`)
  const { cur, sym } = checkProductsForProduct(productCode)
  pe.innerText = appTools().formatPrice({ cur, sym, price: calcTotal(productCode) })
}

const calcTotal = (productCode) => {
  const product = checkProductsForProduct(productCode)
  const basketItem = checkBasketForProduct(productCode)
  if (!basketItem) return 0
  return (product.price - 0) * (basketItem.quantity - 0)
}

const renderQuantityControls = (productCode, quantity) => {
  if (!quantity) quantity = 0
  let more = appTools().el('span', { text: '➕', classes: 'adjust' })
  let less = appTools().el('span', { text: '➖', classes: 'adjust' })
  let quant = appTools().el('input', { value: `${quantity}` })
  let control = appTools().el('div', { classes: 'product-quantity' })
  more.addEventListener('click', () => { dispatch({ code: productCode, action: 'more' } ) })
  less.addEventListener('click', () => { dispatch({ code: productCode, action: 'less' } ) })
  quant.addEventListener('keyup', () => { dispatch({ code: productCode, action: 'change', value: quant.value } ) })
  
  control.appendChild(less)
  control.appendChild(quant)
  control.appendChild(more)
  return control
}

const renderSummary = () => {
  let cur = ''
  let sym = ''
  let oe = document.getElementById(OUTPUT)
  let ose = document.getElementById('orderSummary')
  if (ose) ose.remove()
  let swe = appTools().el('div', { id: 'orderSummary', classes: 'column' })
  let ste = appTools().el('div', { classes: 'title order-title', text: 'Order Summary' })
  swe.appendChild(ste)

  const basket = readBasket()
  for (let p in basket.products) {
    const product = checkProductsForProduct(p)
    cur = product.cur
    sym = product.sym
    const name = product.name
    const item = basket.products[p]
    const total = appTools().formatPrice({ cur, sym, price: calcTotal(p) })
    let text = `${item.quantity} x ${name} = ${total}`
    let pe = appTools().el('div', { text })
    swe.appendChild(pe)
  }

  oe.appendChild(swe)

  const discountedBasket = calcDiscounts()
  const de = appTools().el('div', { id: 'discounts' })
  const dte = appTools().el('div', { text: 'Discounts', classes: 'discounts-title' })
  de.appendChild(dte)

  let dbo = 0
  let dmo = 0
  for (let p in discountedBasket.products) {
    if (discountedBasket.products[p].discountQuantity) {
      dbo = renderBogofs(de, p, discountedBasket)
    }
    if (discountedBasket.products[p].discountPrice) {
      dmo = renderDiscountMargin(de, p, discountedBasket)
    }
  }

  const bte = appTools().el('div', { text: 'TOTAL COST', classes: 'total-cost-title' })
  const be = appTools().el('div', { })
  be.appendChild(bte)    
  let totalText = calcBasket(discountedBasket, (dbo + dmo - 0))
  const btote = appTools().el('div', { id: 'basketTotal', text: appTools().formatPrice({ cur, sym, price: totalText }) })
  be.appendChild(btote)

  const ce = appTools().el('button', { text: 'Checkout', classes: 'button' })
  swe.appendChild(de)
  swe.appendChild(be)
  swe.appendChild(ce)
}

const calcBasket = (basket, discount) => {
  let tot = 0
  for (let p in basket.products) {
    const { price } = checkProductsForProduct(p)
    tot += price * basket.products[p].quantity
  }
  tot -= discount
  return tot
}

const renderBogofs = (el, p, basket) => {
  let { cur, sym, price, name } = checkProductsForProduct(p)
  let oprice = basket.products[p].quantity * price
  let dprice = basket.products[p].discountQuantity * price
  let discountValue = oprice - dprice
  let text = 'bogof ' + name + ' ' + appTools().formatPrice({ cur, sym, price: discountValue })
  el.appendChild(appTools().el('div', { text }))
  return discountValue
}

const renderDiscountMargin = (el, p, basket) => {
  const { cur, sym, price, name } = checkProductsForProduct(p)
  let d = price - basket.products[p].discountPrice
  let discountValue = d * basket.products[p].quantity
  let text = 'special ' + name + ' ' + appTools().formatPrice({ cur, sym, price: discountValue }) 
  el.appendChild(appTools().el('div', { text }))
  return discountValue
}

const calcDiscounts = () => {
  const basket = readBasket()
  for (let p in basket.products) {
    if (p == 'GOKU' && basket.products[p].quantity > 1) {
      bogofs(basket, p)
    }
    if (p == 'NARU' && basket.products[p].quantity > 2) {
      naruVolumeDiscount(basket, p)
    }
  }
  return basket
}

const bogofs = (basket, code) => {
  let q = basket.products[code].quantity
  let dm = q % 2
  let dq = Math.floor(q / 2)
  basket.products[code].discountQuantity = dq + dm
}

const naruVolumeDiscount = (basket, code) => {
  basket.products[code].discountPrice = 19
}




const appTools = () => {

  const formatPrice = (data) => {
    const { price, cur, sym } = data
    let displayPrice = ''
    let p = `${price}`
    let s = p.split('.')
    if (!s[1]) p = `${p}.00`
    if (s[1] && s[1].length == 1) p = `${p}0`
    if (cur == 'euro') displayPrice = `${p}${sym}`
    if (cur == 'gbp') displayPrice = `${sym} ${p}`
    return displayPrice
  }

  const el = (tag, params = {}) => {
    const { id, classes, text, value, src, data } = params
    let e = document.createElement(tag)
    if (id) e.id = id
    if (classes) e.className = classes
    if (text) e.innerText = text
    if (value) e.value = value
    if (data) e.setAttribute(`data-${data.name}`, data.value)
    if (src) e.setAttribute('src', src)
    return e
  }  

  return {
    el,
    formatPrice
  }
}


