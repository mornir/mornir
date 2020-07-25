require('dotenv').config()
const Mustache = require('mustache')
const fs = require('fs')
const got = require('got')
const MUSTACHE_MAIN_DIR = './main.mustache'

const techs = [
  {
    name: 'Nuxt.js',
    website: 'https://nuxtjs.org',
    logo: 'nuxt.js',
    badgeColor: '00C58E',
  },
  {
    name: 'Tailwind%20CSS',
    website: 'https://tailwindcss.com',
    logo: 'tailwind-css',
    badgeColor: '38B2AC',
  },
  {
    name: 'Cypress',
    website: 'https://www.cypress.io',
    logo: 'cypress',
    badgeColor: '17202C',
  },
  {
    name: 'Netlify',
    website: 'https://www.netlify.com',
    logo: 'netlify',
    badgeColor: '00C7B7',
  },
]

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
        count: 3,
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
      techs,
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
