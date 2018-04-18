export default ({ $cloudKit, redirect }) => {
  if ($cloudKit.user !== undefined) {
    redirect('/step/0-basic');
  }
};
