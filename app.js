const PRODUCT_STORE = 'ipresence_products'
const BASKET = 'ipresence_basket'
const OUTPUT = 'appOutput'
const DISPATCH = 'ipresence_dispatch'



const app = () => {

  const main = () => {
    console.log('main')
    
    renderProducts(loadProducts())
  }
  
  return {
    main
  }
}

document.addEventListener(DISPATCH, (event) => {
  const d = event.detail
  if (action == 'more') {  } // update basket

  console.log(d)
  

})

const dispatch = (detail) => {
  document.dispatchEvent(
    new CustomEvent(
      DISPATCH,
      { detail: detail }
    )
  )
}




const loadProducts = () => {
  return JSON.parse(localStorage.getItem(PRODUCT_STORE))
}

const loadBasket = () => {
  return JSON.stringify(localStorage.getItem(BASKET))
}

const renderProducts = (pList) => {

  let l = appTools().el('ul')

  pList.map(p => {
    l.appendChild(renderProductDetails(p))
  })

  let p = appTools().el('div', { id: 'products' })
  let o = document.getElementById('appOutput')   
  p.appendChild(l) 
  o.appendChild(p)  
}

const renderProductDetails = (product) => {

  let li = appTools().el('li', { id: 'productsList' })

  let name = appTools().el('div', { classes: 'product-name', text: product.name } )
  let price = appTools().el('div', { classes: 'product-price', text: formatPrice(product) } )
  let quantity = renderQuantityControls(product.code)
  let totalLine = appTools().el('div', { classes: 'line-total', text: 'total' })

  li.appendChild(name)
  li.appendChild(quantity)
  li.appendChild(price)
  li.appendChild(totalLine)
  return li
}

const formatPrice = (product) => {
  const { price, cur, sym } = product
  let displayPrice = ''
  if (cur == 'euro') displayPrice = `${price}${sym}`
  if (cur == 'gbp') displayPrice = `${sym} ${price}`
  return displayPrice
}

const renderQuantityControls = (productCode) => {
  let more = appTools().el('span', { text: '+' })
  let less = appTools().el('span', { text: '-' })
  let quant = appTools().el('input', { value: '0' })
  let control = appTools().el('div', { classes: 'product-quantity' })
  more.addEventListener('click', () => { dispatch({ code: productCode, action: 'more' } ) })
  less.addEventListener('click', () => { dispatch({ code: productCode, action: 'less' } ) })
  quant.addEventListener('click', () => { dispatch({ code: productCode, action: 'change', value: quant.value } ) })
  
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


