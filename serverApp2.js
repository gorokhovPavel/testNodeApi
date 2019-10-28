const Koa = require('koa');
const Router = require('koa-router');
const {productsBySubcategory, productList, productById} = require('./controllers/products');
const {categoryList} = require('./controllers/categories');
const {productsByQuery} = require('./controllers/products');
const {login} = require('./controllers/login');

const app = new Koa();
app.use(require('koa-bodyparser')());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch(err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = err.message;
      return;
    }
    if (err.name === 'ValidationError') {
      ctx.status = 400;
      ctx.body = Object.keys(err.errors).map(key => ({ [key]: err.errors[key].message }));
    } else {
      ctx.status = 500;
      ctx.body = 'Internal server error';
      console.error(err);
    }
  }
});

const router = new Router({prefix: '/api'});

router.get('/categories', categoryList);
router.get('/products', productsBySubcategory, productList);
router.get('/products/:id', productById);
router.get('/products', productsByQuery);

router.post('/login', login);

app.use(router.routes());
module.exports = app;