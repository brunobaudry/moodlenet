import { writeFile } from 'fs/promises'
import { resolve } from 'path'
import { currentRegistry, installDir } from './env.mjs'

console.log(`
installing config...
`)

const configFileName = `default.config.json`
await writeFile(resolve(installDir, configFileName), getConfigFileStr(), { encoding: 'utf8' })
await writeFile(resolve(installDir, '.env'), '', { encoding: 'utf8' })

function getConfigFileStr() {
  return JSON.stringify(
    {
      pkgs: {
        '@moodlenet/core': {
          npm_config_registry: currentRegistry,
        },
        '@moodlenet/arangodb': {
          connectionCfg: {
            url: 'http://localhost:8529',
          },
        },
        '@moodlenet/http-server': {
          port: 8080,
          domain: { name: 'localhost:8080', protocol: 'http' },
        },
        '@moodlenet/email-service': {
          nodemailerTransport: { jsonTransport: true },
        },
        '@moodlenet/authentication-manager': {
          rootPassword: 'root',
        },
      },
    },
    null,
    2,
  )
}