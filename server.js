const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb')
var ObjectId = mongodb.ObjectID

const uri= "mongodb://localhost:27017/dbcrud.crud"

MongoClient.connect(uri, (err, client) =>{
    if (err) return console.log(err)
    db= client.db('dbcrud')

    app.listen(3000, () =>{
        console.log('server running on port 3000')
    })
})

app.use(bodyParser.urlencoded({ extended: true}))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/', (req, res) => {
    var cursor = db.collection('crud').find()
})

app.get('/show', (req,res) => {
    db.collection('crud').find().toArray((err, results) =>{
        if (err) return console.log(err)
        res.render('show.ejs', {crud: results})
    })
})

app.post('/show', (req, res) => {
    db.collection('crud').save(req.body, (err, result) =>{
        if (err) return console.log(err)

        console.log('Salvo no Banco de Dados')
        res.redirect('/show')
    })
})

app.route('/edit/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('crud').find(ObjectId(id)).toArray((err, result) => {
        console.log(result)
        if (err) return res.send(err)
        res.render('edit.ejs', { crud: result})
    })
})
.post((req, res) =>{
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname

    db.collection('crud').updateOne({_id: ObjectId(id)}, {
        $set: { 
            name: name,
            surname: surname
        }
    }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/show')
        console.log('Atualizado no Banco de Dados')
    })
})
app.route('/delete/:id')
.get((req, res) => {
    var id = req.params.id
    var ObjectId = mongodb.ObjectID
    db.collection('crud').deleteOne({_id: ObjectId(id)}, (err, result) =>{
        if (err) return res.send(500, err)
        console.log('Deletado do Banco de Dados!')
        res.redirect('/show')
    })
})