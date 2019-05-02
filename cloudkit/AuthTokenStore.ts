export default class AuthTokenStore {
  putToken(containerIdentifier: string, authToken: string): void {
    const date = new Date()

    // set time to expire in 14 days
    date.setTime(date.getTime() + (14 * 24 * 60 * 60 * 1000))

    // set the cookie
    document.cookie = `${containerIdentifier}=${authToken}; expires=${date.toUTCString()}; path=/`
  }

  getToken(containerIdentifier: string): string {
    const value = '; ' + document.cookie
    const parts = value.split('; ' + containerIdentifier + '=')

    if (parts.length === 2) {
      return parts.pop()!.split(';').shift() || ''
    }

    return ''
  }
}
