const PRODUCT_STORE = 'ipresence_products'
const BASKET = 'ipresence_basket'
const OUTPUT = 'appOutput'

const app = () => {

  const main = () => {
    console.log('main')
    
    renderProducts(loadProducts())
  }
  
  return {
    main
  }
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
  let price = appTools().el('div', { classes: 'product-price', text: product.price } )

  
  li.appendChild(name)
  li.appendChild(price)
  return li
}


const appTools = () => {

  const el = (tag, params = {}) => {
    const { id, classes, text } = params
    let e = document.createElement(tag)
    if (id) e.id = id
    if (classes) e.className = classes
    if (text) e.innerText = text
    return e
  }  

  return {
    el
  }
}


