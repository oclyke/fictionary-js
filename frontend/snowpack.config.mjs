import * as fs from 'fs'
import * as path from 'path'
import {
  fileURLToPath,
} from 'url'

function getIndex () {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const data = fs.readFileSync(path.resolve(__dirname, '../index.json'), 'utf8')
  const info = JSON.parse(data)
  return info
}

function makeConfig () {
  const PRODUCTION = process.env.NODE_ENV !== 'development'
  
  const info = getIndex()

  const config = {
    optimize: {
      // entrypoints: 'auto',
      bundle: true,
      minify: true,
      target: 'es2018',
    },
    mount: {
      src: { url: '/!/dist' },
      public: {url: '/', static: true},
    },
    buildOptions: {
      out: 'dist',
    },
    env: {
      REPO_URL: info.repoURL,
      RELEASE_URL: info.releaseURL,
      FRONTEND_MAJOR: info.frontend.major,
      GQL_ENDPOINT: 'http://localhost:4000/graphql',
      SESSION_ENDPOINT: 'ws://localhost:8042',
    },
    routes: [
      {match: 'routes', src: '.*', dest: '/index.html'} // fallback route for SPA https://www.snowpack.dev/guides/routing
    ]
  }

  // apply production-only configuration
  if (PRODUCTION) {
    console.log(info)
    config.buildOptions['baseUrl'] = path.join(info.frontend.host, info.frontend.basename)
    config.env.FRONTEND_BASENAME = info.frontend.basename
    config.env.GQL_ENDPOINT = info.api.gqlEndpoint
    config.env.SESSION_ENDPOINT = info.api.sessionEndpoint
  }

  return config
}

const config = makeConfig()
console.log('NODE_ENV: ', process.env.NODE_ENV)
console.log('using config: ', config)

export default config
