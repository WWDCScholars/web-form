export default function({ store, redirect }) {
  const isAuthenticated = store.getters['api/isAuthenticated']
  if (!isAuthenticated) {
    redirect('/')
  }
}
