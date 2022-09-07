import * as dotenv from 'dotenv'
dotenv.config()
import Mustache from 'mustache'
import { readFileSync, writeFileSync } from 'node:fs'
import got from 'got'

const MUSTACHE_MAIN_DIR = './main.mustache'

const lastRefresh = new Date().toLocaleDateString('en-GB', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'short',
  timeZone: 'Europe/Zurich',
})

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
    name: 'Sanity',
    website: 'https://www.sanity.io',
    logo: '',
    badgeColor: 'fa1607',
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
    const [articles, steam] = await Promise.all([fetchArticles(), fetchGames()])

    const games = steam.response.games

    const view = {
      articles,
      games,
      showGames: !!games.length,
      techs,
      lastRefresh,
    }

    const content = readFileSync(MUSTACHE_MAIN_DIR)
    const output = Mustache.render(content.toString(), view)
    writeFileSync('README.md', output)
  } catch (error) {
    console.error(error)
  }
}

generateReadMe()
