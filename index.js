// const HTML = "";

// const cheerio = require('cheerio')

// const $ = cheerio.load(HTML);
// let a = $('table tr:nth-child(2) table:nth-child(2) tr td:nth-child(2)').text();
// console.log('a', a)


var Crawler = require("crawler");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const mongo = MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });
 
var c = new Crawler({
    maxConnections : 100,

    preRequest: function(options, done) {
      // 'options' here is not the 'options' you pass to 'c.queue', instead, it's the options that is going to be passed to 'request' module 
      console.log(new Date(),'Request Sent:',options.uri);
      // when done is called, the request will start
      done();
    },
    // rateLimit: 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {      
        if(error){
            console.log('in error :D:D:D:D');
            mongo.then(db=>{
              var dbo = db.db("nlai");
              dbo.collection("losts").insertOne(book, function(err, res) {
                // if (err) throw err;
                console.log(new Date(),'book inserted :', uri);
                // db.close();
              });
            });
            // console.log(error);
        }else{
            var $ = res.$;
            let uri = res.options.uri
            console.log(new Date(),"Response Recieved:", uri);
            const id = uri.split('/');
            // console.log('id :', id[id.length-1]);
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            // console.log($("title").text());
            // let a = $('table tr:nth-child(2) table:nth-child(2) tr td:nth-child(2)').text();
            let a = $('td.formcontent tr:nth-child(2) tr table tr');
            let book = {};
            book._id=id[id.length-1];
            let empty = true;
            a.each(function(i, elem) {
              // b[i] = $(this).text();
              // console.log('b', b)
              let row = [];
              let b = $('td', this).each(function(i,elem) {
                row[i] = $(this).text().trim();
                empty = false;
                // console.log('this.text()', $(this).text())
                // console.log('row[',i,']', row[i])
              })
              if (row[0] in book) {
                book[row[0]].push(row[2]);
              }
              else {
                book[row[0]]= [row[2]];
              }
            });
            mongo.then(db=>{
              var dbo = db.db("nlai");
              if (empty) {
                dbo.collection("empty").insertOne(book, function(err, res) {
                  // if (err) throw err;
                  console.log(new Date(),'Empty Book Logged :', uri);
                  // db.close();
                });
              } else {
                dbo.collection("books").insertOne(book, function(err, res) {
                  // if (err) throw err;
                  console.log(new Date(),'book inserted :', uri);
                  // db.close();
                });
              }
            });
            // console.log('book', book)
        }
        done();
    }
});

tasks = [];

// c.queue('http://opac.nlai.ir/opac-prod/bibliographic/60000000');
for (let i = 0; i < 10; i++) {
  tasks[i] = `http://opac.nlai.ir/opac-prod/bibliographic/${i}`
  // tasks[i] = `http://localhost:15000/${i}`
  
}
c.queue(tasks);


c.on('drain',function(){
  // For example, release a connection to database.
  mongo.then(db=>{
    db.close();// close connection to MySQL
  });
})