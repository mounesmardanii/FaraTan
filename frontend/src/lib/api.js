// src/lib/api.js
const base = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE || '')

export async function api(url, options = {}) {
  // اگر body آبجکت بود، خودمان JSON کنیم
  let body = options.body
  let headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    body = JSON.stringify(body)
  }

  const res = await fetch(base + url, { ...options, headers, body })

  const ct = res.headers.get('content-type') || ''
  const text = await res.text()
  const data = text && ct.includes('application/json') ? JSON.parse(text) : null
  if (!res.ok) {
    const snippet = (data ? JSON.stringify(data) : text || '').slice(0, 200)
    throw new Error(`${res.status} ${res.statusText} ${snippet}`)
  }
  return { status: res.status, data }
}
