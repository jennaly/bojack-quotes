//VARIABLES
const { response } = require('express');
const express = require('express');
const bodyParser = require('body-parser');
const { FindCursor } = require('mongodb');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const PORT = 3001;
require("dotenv").config();


MongoClient.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true})
    .then(client => {
        console.log("Connected to Database");
        const db = client.db('Bojack-Quotes');
        const quotesCollection = db.collection('quotes');
        app.set('view engine', 'ejs')
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(express.static('public'))
        app.use(bodyParser.json())

        app.get('/', (req, res) => {
            quotesCollection.find().toArray()
                .then(results => {
                    console.log(results);
                    res.render('index.ejs', {quotes: results})
                })
                .catch(error => console.error(error));
        })

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    console.log(result);
                    res.redirect('/')
                })
                .catch(error => console.error(error));
        })

        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                {name: 'Sara Lynn'},
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
           )
           .then(result => {
               console.log(result);
               res.redirect('/')
           }) 
           .catch(error => console.error(error));
        })

        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                {name: req.body.name}
            )
            .then(result => {
                if (result.deletedCount === 0) {
                    return res.json('No quote to delete')
                }
                res.json('Deleted Bojack\'s quote')
            })
            .catch(error => console.error(error))
        })

        app.listen(process.env.PORT || PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        })

    })
    .catch(error => console.error(error))