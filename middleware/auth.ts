export default ({ $cloudKit, redirect }) => {
  if ($cloudKit.user === undefined) {
    redirect('/');
  }
};
