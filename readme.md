📝 Hand built ES6 basket.

Running on github pages: - 
tests - https://lucsan.github.io/gukupopbasket/SpecRunner.html
app - https://lucsan.github.io/gukupopbasket/app.html

I consider this to be a viable MVP or first flush prototype. It is fully functional, but requires further dispay (css) and platform specifics before it can be progressed.

⚙ Setup: First run the tests (SpecRunner.html) this will generate the products list db in localStorage. Drag and drop app.html into a browser.

I chose to code entierly in the browser for convienience and speed.

The DOM is written from javascript.

LocalStorage is used as the product database, this could easily be replaced with an XHR call.

Refactoring work has begun, and some functions moved into a tools class, however, further refactoring of the code would be dependant on the target platform, for example, it is a trivial task to extact some of the functions and deploy them server side via node. Candidate functions for this would be product list and dynmaic data (ie: price, discounts), alternatly they could be updated via XHR and a webworker. Again, the code could be pre-compiled through Typescript should ES5 be required by the paltform, or arround the calculation functions.

I have implemented bulma (mainly to see what it's got and what it can do) and a minimal css, which I hope, demonstaites the flexibility of the basket engine structure.

Discounts are hardcoded and would in future refactors be lifted up, abstracted and provided via the platform mechanism, (ie: node, XHR, webservice, etc)

The basic structure, framework, if you like, is single input, single output functions (functional programming), the next step would be to curry the calculation functions. Other functions (mainly render...) handle the DOM. Further work would be to extract the DOM handlers to their own container function and file, after which they could easily be replaced by a library such as React or Vue if so desired.