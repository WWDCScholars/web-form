export default ({ store, redirect }) => {
  const hasProfile = store.getters['api/hasProfile']
  if (!hasProfile) {
    redirect('/link')
  }
};
