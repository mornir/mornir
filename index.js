require('dotenv').config()
const Mustache = require('mustache')
const fs = require('fs')
const got = require('got')
const MUSTACHE_MAIN_DIR = './main.mustache'

async function fetchArticles() {
  return got('https://dev.to/api/articles?username=mornir&per_page=5').json()
}

async function fetchGames() {
  return got(
    'http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001',
    {
      searchParams: {
        key: process.env.STEAM_KEY,
        steamid: process.env.STEAM_ID,
        format: 'json',
      },
    }
  ).json()
}

async function generateReadMe() {
  try {
    const [articles, games] = await Promise.all([fetchArticles(), fetchGames()])

    const view = {
      articles,
      games: games.response.games,
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
