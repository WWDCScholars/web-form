export default ({ store, redirect }) => {
  const isAuthenticated = store.getters['api/isAuthenticated']
  if (isAuthenticated) {
    redirect('/link') // TODO: this is not right but works for now
  }
};
