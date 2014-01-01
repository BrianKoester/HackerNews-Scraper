//***
// Scrape article and associated url from Hacker News website
//***

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var writeStream = fs.createWriteStream('hacker-news.csv');

// define header to csv file
var header = 'Article, (Url)';

// define url to be scraped
var url = 'https://news.ycombinator.com';

function isThereAWebsite(answer) {
    if (answer) {
        // console.log("website=",website);
        writeStream.write("(NO WEBSITE)" + '\n');
        answer = false;
    }
}


// request url, then load body of page
request(url, function(err, resp, body) {
    $ = cheerio.load(body);

    
    // search through each .title
    $('.title').each(function() {

        var noWebsite = true;

        
            // pull article text from 'a'
            $(this).find('a').each(function() {
                var title = $(this).text();

                // if .title text does not = 'More' write to csv file
                if (title !== 'More') {
                    writeStream.write(title + ',');
                } 
                else {
                    // else capture 'href' value to move to next page
                    var href = $(this).attr('href');
                }
            });


        
            // pull text from .comhead and write to csv file
            $(this).find('.comhead').each(function() {
                var website = $(this).text();
                writeStream.write(website + '\n');
                noWebsite = false;
            });


            console.log("noWebsite=", noWebsite);
            isThereAWebsite(noWebsite);

    });

});



writeStream.write(header + "\n\n");

// close writeStream after a 3 second delay
var delay=3000
    setTimeout(function() {
        writeStream.close();
    }, delay);
