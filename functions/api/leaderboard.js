// ═══════════════════════════════════════════════════════════════════
//  ARCADE LEADERBOARD, tiny shared high-score API (global, for everyone)
//
//  A Cloudflare Pages Function. This is a port of the old leaderboard.php,
//  which ran on LiteSpeed shared hosting and kept scores in a JSON file next
//  to itself. Pages is static-only and has no PHP and no writable disk, so the
//  JSON file becomes a KV entry. The wire format is unchanged.
//
//    GET  /api/leaderboard?game=jungle        -> top 10 for that game
//    GET  /api/leaderboard                    -> all games' top 10
//    POST /api/leaderboard {game,tag,score}   -> submit, returns top 10
//
//  One behavioural difference worth stating: the PHP version held an exclusive
//  flock() across the read-modify-write, so concurrent submissions could not
//  clobber each other. KV has no such lock, so two submissions landing in the
//  same instant can cost one of them. For a arcade board of ten entries that
//  trade is fine; it is noted here rather than papered over.
// ═══════════════════════════════════════════════════════════════════

const GAMES = ['jungle', 'snake', 'breakout']
const MAX = 10
const SCORE_CAP = 9999999
const KEY = 'board'

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })

/** The whole board, shape: { [game]: [{tag,score,t}, ...] }. */
async function readAll(env) {
  if (!env.LEADERBOARD) return {}
  const raw = await env.LEADERBOARD.get(KEY)
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

// A single entry point, branching on method, so there is no ambiguity between
// a catch-all handler and the method-specific ones.
export async function onRequest(context) {
  const { request } = context
  if (request.method === 'GET') return handleGet(context)
  if (request.method === 'POST') return handlePost(context)
  return json({ error: 'method' }, 405)
}

async function handleGet({ request, env }) {
  const all = await readAll(env)
  const game = new URL(request.url).searchParams.get('game') || ''
  if (game !== '') return json((all[game] || []).slice(0, MAX))
  const out = {}
  for (const g of GAMES) out[g] = (all[g] || []).slice(0, MAX)
  return json(out)
}

async function handlePost({ request, env }) {
  let body = null
  try {
    body = await request.json()
  } catch {
    /* fall through to the validation below */
  }

  const game = (body && body.game) || ''
  // Same normalisation the PHP did: strip anything but alphanumerics and
  // spaces, uppercase, cap at 6 characters.
  const tag = String((body && body.tag) || '')
    .replace(/[^A-Za-z0-9 ]/g, '')
    .toUpperCase()
    .slice(0, 6)
    .trim()
  const score = Math.trunc(Number((body && body.score) || 0)) || 0

  if (!GAMES.includes(game) || tag === '' || score <= 0 || score > SCORE_CAP) {
    return json({ error: 'invalid' }, 400)
  }
  if (!env.LEADERBOARD) return json({ error: 'store' }, 500)

  const all = await readAll(env)
  const board = Array.isArray(all[game]) ? all[game] : []
  board.push({ tag, score, t: Math.floor(Date.now() / 1000) })
  board.sort((a, b) => b.score - a.score)
  all[game] = board.slice(0, MAX)

  await env.LEADERBOARD.put(KEY, JSON.stringify(all))
  return json(all[game])
}
