export default [

  {
    slug: '0-basic',
    title: 'Let\'s get you signed up...',
    color: 'red',
    groups: [{
        title: 'Please upload a profile image',
        fields: [
          { name: 'profileImage', type: 'file', comment: 'It\'s important that this is an image of you' }
        ]
      }, {
        title: 'Enter some basic details about yourself',
        fields: [
          { name: 'firstName', type: 'text', placeholder: 'First Name', class: 'form-width-50' },
          { name: 'lastName', type: 'text', placeholder: 'Last Name', class: 'form-width-50' },
          { name: 'email', type: 'email', placeholder: 'Email' },
          { name: 'dateOfBirth', type: 'date', placeholder: 'Date of Birth (dd/mm/yyyy)' }
        ]
      }, {
        title: 'Gender',
        fields: [
          { name: 'gender', type: 'radio', options: ['male', 'female', 'other'] }
        ]
      }]
  },

  {
    slug: '1-about',
    title: 'A little more information to help you connect...',
    color: 'red2',
    groups: [{
      title: 'Describe yourself in less than 300 characters',
      fields: [
        { name: 'shortBio', type: 'textarea', maxCharacters: 300 }
      ]
    }, {
      title: 'Tell us where you\'re from',
      fields: [
        { name: 'location', type: 'location', placeholder: 'Hometown / Nearest City' }
      ]
    }, {
      title: 'Where else can people find you?',
      fields: [
        { name: 'website', type: 'url', placeholder: 'Personal Website URL', required: false },
        { name: 'github', type: 'url', placeholder: 'GitHub URL', required: false },
        { name: 'twitter', type: 'url', placeholder: 'Twitter URL', required: false },
        { name: 'facebook', type: 'url', placeholder: 'Facebook URL', required: false },
        { name: 'linkedin', type: 'url', placeholder: 'LinkedIn URL', required: false },
        { name: 'imessage', type: 'text', placeholder: 'iMessage Number or Email', required: false }
      ]
    }]
  },

  // {
  //   slug: '2-app',
  //   title: 'Be proud and stand tall, show the world your winning project',
  //   fields: [
  //     { name: 'appSubmittedType', type: 'radio', options: [
  //       { name: 'playground', text: 'Playground' },
  //       { name: 'playgroundbook', text: 'Playground Book' }
  //     ] },
  //     { name: 'linkToPlayground', type: 'text', placeholder: 'github.com/me/myPlayground' },
  //     { name: 'screenshots', type: 'file', multiple: true },
  //     { name: 'videoLink', type: 'text', placeholder: 'youtube.com' }
  //   ]
  // },
  //
  // {
  //   slug: '3-contact',
  //   title: 'Tell the world how they can connect with you',
  //   fields: [
  //     { name: 'iMessageAccount', type: 'text', placeholder: 'me@icloud.com or cellphone number', required: false },
  //     { name: 'githubAccount', type: 'text', placeholder: 'github.com/me', required: false },
  //     { name: 'twitterAccount', type: 'text', placeholder: 'twitter.com/me', required: false },
  //     { name: 'facebookAccount', type: 'text', placeholder: 'facebook.com/me', required: false },
  //     { name: 'linkedInAccount', type: 'text', placeholder: 'linkedin.com/me', required: false },
  //     { name: 'webseit', type: 'text', placeholder: 'my-website.me', required: false }
  //   ]
  // },
  //
  // {
  //   slug: '4-account',
  //   title: 'Wrapping up submission',
  //   fields: [
  //     { name: 'appStoreAccountLink', type: 'text', placeholder: 'itunes.apple.com/us/developer/me', comment: 'Show your apps on the App Store; add your App Store developer link (DO NOT USE SHORT URL)', required: false },
  //     { name: 'password', type: 'password', comment: 'Password for your acccount' }
  //   ]
  // }

]
