// const HTML = "";

// const cheerio = require('cheerio')

// const $ = cheerio.load(HTML);
// let a = $('table tr:nth-child(2) table:nth-child(2) tr td:nth-child(2)').text();
// console.log('a', a)


var Crawler = require("crawler");
 
var c = new Crawler({
    // maxConnections : 10,
    rateLimit: 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            // console.log($("title").text());
            // let a = $('table tr:nth-child(2) table:nth-child(2) tr td:nth-child(2)').text();
            let a = $('td.formcontent tr:nth-child(2) tr table tr')
            let book = {};
            a.each(function(i, elem) {
              // b[i] = $(this).text();
              // console.log('b', b)
              let row = [];
              let b = $('td', this).each(function(i,elem) {
                row[i] = $(this).text().trim();
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
            // console.log('book', book)
        }
        done();
    }
});

tasks = [];

for (let i = 0; i < 100; i++) {
  // c.queue('http://opac.nlai.ir/opac-prod/bibliographic/5419799');
  tasks[i] = `http://opac.nlai.ir/opac-prod/bibliographic/${i}`
}
c.queue(tasks);