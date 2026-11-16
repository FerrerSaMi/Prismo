import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const apiUrl = 'http://127.0.0.1:8787/api/v1/health'
const apiDirectory = fileURLToPath(new URL('../prismo-api/', import.meta.url))
const frontendDirectory = fileURLToPath(new URL('../prismo/', import.meta.url))

async function existingApi() {
  let response
  try {
    response = await fetch(apiUrl, { signal: AbortSignal.timeout(1500) })
  } catch (error) {
    if (error instanceof TypeError && error.cause?.code === 'ECONNREFUSED') return false
    throw new Error('El puerto 8787 está ocupado o no responde. Revisa qué proceso lo usa antes de iniciar Prismo.', { cause: error })
  }
  const health = await response.json().catch(() => null)
  if (response.ok && health?.status === 'ok' && health?.version === '1') return true
  throw new Error('El puerto 8787 responde, pero no es la API de Prismo. Libera ese puerto antes de iniciar el proyecto.')
}

async function main() {
  const apiRunning = await existingApi()
  if (apiRunning) process.stdout.write('API de Prismo ya iniciada en 127.0.0.1:8787; se reutilizará.\n')

  const services = [
    ...(!apiRunning ? [{ name: 'API', cwd: apiDirectory, args: ['--env-file-if-exists=.dev.vars', 'src/dev-server.ts'] }] : []),
    { name: 'Frontend', cwd: frontendDirectory, args: ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1'] },
  ]
  let closing = false
  const children = []

  function shutdown(code) {
    if (closing) return
    closing = true
    process.exitCode = code
    for (const child of children) if (child.exitCode === null) child.kill()
  }

  process.on('SIGINT', () => shutdown(0))
  process.on('SIGTERM', () => shutdown(0))

  for (const service of services) {
    const child = spawn(process.execPath, service.args, { cwd: service.cwd, stdio: 'inherit' })
    children.push(child)
    child.on('error', error => {
      process.stderr.write(`${service.name}: ${error.message}\n`)
      shutdown(1)
    })
    child.on('exit', code => shutdown(code ?? 1))
  }
}

main().catch(error => {
  process.stderr.write(`No se pudo iniciar Prismo: ${error.message}\n`)
  process.exitCode = 1
})
