const axios = require('axios');
const cheerio = require('cheerio');
const Handlebars = require('handlebars');
const fs = require('fs');

const rssUrl = 'https://viblo.asia/rss/authors/monmen.rss';

const updateREADME = () => {
    axios
        .get(rssUrl)
        .then((response) => {
            const rssData = response.data;
            const $ = cheerio.load(rssData, { xmlMode: true });
            const items = [];
            $('item').each((index, element) => {
                const title = $(element).find('title').text();
                const link = $(element).find('link').text();
                let publishedDate = $(element).find('pubDate').text();
                publishedDate = publishedDate.split(' ')[0];
                items.push({ title, link, publishedDate });
            });
            const template = Handlebars.compile(
                fs.readFileSync('README.template.md', 'utf8')
            );
            // Get updatedAt in format yyyy-MM-dd
            const updatedAt = new Date().toISOString().split('T')[0];
            const recentItems = items.splice(0, 5);
            const combinedData = template({ recentItems, items, updatedAt });
            fs.writeFileSync('README.md', combinedData);
        })
        .catch((error) => {
            console.error(error);
        });
};

updateREADME();
