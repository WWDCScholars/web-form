export default ({ store, redirect }) => {
  const hasProfile = store.getters['api/hasProfile']
  if (hasProfile) {
    const firstStep = store.getters['steps/firstStep']
    redirect({
      name: 'step-slug',
      params: { slug: firstStep.slug }
    })
  }
};
