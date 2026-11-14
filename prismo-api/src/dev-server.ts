import { createServer } from 'node:http'
import { handleRequest } from './worker.ts'

const port = Number(process.env.PORT ?? '8787')
const host = process.env.HOST ?? '127.0.0.1'

createServer(async (incoming, outgoing) => {
  const url = new URL(incoming.url ?? '/', `http://${incoming.headers.host ?? `${host}:${port}`}`)
  const request = new Request(url, { method: incoming.method, headers: incoming.headers as HeadersInit })
  const response = await handleRequest(request, { FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN, INEGI_TOKEN: process.env.INEGI_TOKEN })
  outgoing.writeHead(response.status, Object.fromEntries(response.headers))
  outgoing.end(Buffer.from(await response.arrayBuffer()))
}).listen(port, host, () => { process.stdout.write(`Prismo API: http://${host}:${port}\n`) })
