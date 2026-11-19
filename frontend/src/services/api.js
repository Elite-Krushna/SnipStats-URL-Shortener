// The address of our backend server
const API_URL = 'http://localhost:3000'

// Sends a long URL to the backend and returns the short link details.
// Throws an Error with a readable message if anything goes wrong.
export async function shortenUrl(url) {
  let response

  try {
    response = await fetch(`${API_URL}/api/shorten`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
  } catch {
    // fetch itself failed: the server is off or unreachable
    throw new Error(
      'Cannot reach the server. Make sure the backend is running on port 3000.'
    )
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.')
  }

  return data // { code, shortUrl, originalUrl }
}
// ---------- Dashboard data ----------

async function getJson(path) {
  let response
  try {
    response = await fetch(`${API_URL}${path}`)
  } catch {
    throw new Error(
      'Cannot reach the server. Make sure the backend is running on port 3000.'
    )
  }
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.')
  }
  return data
}

export const getStats = () => getJson('/api/stats')
export const getLinks = (limit = 50) => getJson(`/api/links?limit=${limit}`)
export const getActivity = (days = 7) => getJson(`/api/stats/activity?days=${days}`)