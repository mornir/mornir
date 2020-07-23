const Mustache = require('mustache')
const fs = require('fs')
const got = require('got')
const MUSTACHE_MAIN_DIR = './main.mustache'

async function generateReadMe() {
  try {
    const articles = await got(
      'https://dev.to/api/articles?username=mornir&per_page=5'
    ).json()

    console.log(articles)

    const view = {
      articles: articles,
    }

    fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
      if (err) throw err
      const output = Mustache.render(data.toString(), view)
      fs.writeFileSync('README.md', output)
    })
  } catch (error) {
    console.error(error)
  }
}

generateReadMe()
