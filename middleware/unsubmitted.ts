export default ({ store, redirect }) => {
  const hasSubmitted = store.getters['api/hasSubmitted']
  if (hasSubmitted) {
    redirect('/thankyou')
  }
};
