// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose') // 載入 mongoose

// require express-handlebars here
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')

mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoD

const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))


// routes setting
app.get('/', (req, res) => {

  // past the movie data into 'index' partial template
  res.render('index', { restaurant: restaurantList.results })
})



app.get('/restaurants/:restaurant_id', (req, res) => {

  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant: restaurant })
})

app.get('/search', (req, res) => {
  console.log('req.query', req.query)
  const keyword = req.query.keyword
  const restaurant = restaurantList.results.filter(restaurant => {
    return restaurant.name_en.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()) ||
      restaurant.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()) ||
      restaurant.category.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())

  })

  res.render('index', { restaurant: restaurant, keyword: keyword })
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})