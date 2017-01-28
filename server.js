const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

const mongourl = 'mongodb://cody:cody@ds119578.mlab.com:19578/test-api'

let db;
MongoClient.connect(mongourl, (err, database) => {
  if (err) return console.log(err);
  db = database
  app.listen(4000, () => console.log('listening on 4000'))
})


app.get('/todo',(req,res) => {
  db.collection('todo').find().toArray((err,results) =>{
    if (err) return console.log(err);
    return res.json(results)
  })
})

app.post('/todo', (req,res) => {
  db.collection('todo').save(req.body, (err,result) => {
    if (err) return console.log(err);
    console.log("saved to db!")
    res.redirect('/')
  })
})

app.put('/quotes', (req, res) => {
  db.collection('quotes').findOneAndUpdate(
    {name: 'Yoda'},
    {$set:{name:req.body.name,quote:req.body.quote}},
    {sort:{_id: -1},upsert:true},
    (err,result) => { 
      if (err) return res.send(err); 
      res.send(result)
    }
  )
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vadar quote got deleted')
  })
})