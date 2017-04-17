export default [

  {
    slug: '0-basic',
    title: 'Let\'s begin with some basics',
    fields: [
      { name: 'firstName', type: 'text', placeholder: 'Tim' },
      { name: 'lastName', type: 'text', placeholder: 'Cook' },
      { name: 'acceptanceEmail', type: 'file', placeholder: '' },
      { name: 'email', type: 'text', placeholder: 'tim@apple.com' },
      { name: 'appliedAs', type: 'radio', options: [
        { name: 'student', text: 'Student' },
        { name: 'stem', text: 'Member or Alumni of a STEM Organization' },
        { name: 'both', text: 'Both' },
      ] }
    ]
  },

  {
    slug: '1-personal',
    title: 'Tell the world about yourself',
    fields: [
      { name: 'profilePic', type: 'file', comment: 'Profile pic should be 250x250 pixel' },
      { name: 'birthday', type: 'date', placeholder: 'yyyy-mm-dd' },
      { name: 'location', type: 'text', placeholder: 'San Francisco, USA' },
      { name: 'gender', type: 'radio', options: [
        { name: 'male', text: 'Male' },
        { name: 'female', text: 'Female' },
        { name: 'others', text: 'Others' },
        { name: 'donotwant', text: 'Do not want to disclose' }
      ] },
      { name: 'shortBio', type: 'textarea', placeholder: '', comment: 'Limit your shortBio to 300 characters' },
    ]
  },

  {
    slug: '2-app',
    title: 'Be proud and stand tall, show the world your winning project',
    fields: [
      { name: 'appSubmittedType', type: 'radio', options: [
        { name: 'playground', text: 'Playground' },
        { name: 'playgroundbook', text: 'Playground Book' }
      ] },
      { name: 'linkToPlayground', type: 'text', placeholder: 'github.com/me/myPlayground' },
      { name: 'screenshots', type: 'file', multiple: true },
      { name: 'videoLink', type: 'text', placeholder: 'youtube.com' }
    ]
  },

  {
    slug: '3-contact',
    title: 'Tell the world how they can connect with you',
    fields: [
      { name: 'iMessageAccount', type: 'text', placeholder: 'me@icloud.com or cellphone number', required: false },
      { name: 'githubAccount', type: 'text', placeholder: 'github.com/me', required: false },
      { name: 'twitterAccount', type: 'text', placeholder: 'twitter.com/me', required: false },
      { name: 'facebookAccount', type: 'text', placeholder: 'facebook.com/me', required: false },
      { name: 'linkedInAccount', type: 'text', placeholder: 'linkedin.com/me', required: false },
      { name: 'webseit', type: 'text', placeholder: 'my-website.me', required: false }
    ]
  },

  {
    slug: '4-account',
    title: 'Wrapping up submission',
    fields: [
      { name: 'appStoreAccountLink', type: 'text', placeholder: 'itunes.apple.com/us/developer/me', comment: 'Show your apps on the App Store; add your App Store developer link (DO NOT USE SHORT URL)', required: false },
      { name: 'password', type: 'password', comment: 'Password for your acccount' }
    ]
  }

]
