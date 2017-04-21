var steps = [

  {
    slug: '0-basic',
    title: 'Let\'s get you signed up...',
    color: 'red',
    ckParameterName: 'scholar',
    groups: [{
        title: 'Please upload a profile image',
        ckParameterName: 'wwdcYearInfo',
        fields: [
          { name: 'profilePicture', type: 'file', accept: 'image/*', comment: 'This needs to be an image of you with a resolution of at least 250x250' }
        ]
      }, {
        title: 'Enter some basic details about yourself',
        fields: [
          { name: 'firstName', type: 'text', placeholder: 'First Name', class: 'form-width-50' },
          { name: 'lastName', type: 'text', placeholder: 'Last Name', class: 'form-width-50' },
          { name: 'email', type: 'email', placeholder: 'Email' },
          { name: 'birthday', type: 'date', placeholder: 'Date of Birth (dd/mm/yyyy)' }
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
    ckParameterName: 'scholar',
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
      ckParameterName: 'socialMediaReference',
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

  {
    slug: '2-application',
    title: 'Now for the fun part. Show us your WWDC 2017 submission!',
    color: 'green',
    ckParameterName: 'wwdcYearInfo',
    groups: [{
      title: 'What applicant group(s) do you fall under?',
      fields: [
        { name: 'appliedAs', type: 'radio', options: ['student', 'stem', 'both'] }
      ]
    }, {
      title: 'Please provide a screenshot of your acceptance email for this year to validate your profile',
      fields: [
        { name: 'acceptanceEmail', type: 'file', accept: 'image/*', class: 'form-file-wide' }
      ]
    }, {
      title: 'Upload some screenshots that showcase your playground submission',
      fields: [
        { name: 'screenshots', type: 'file', accept: 'image/*', class: 'form-file-wide', multiple: true, max: 5, min: 1 }
      ]
    }, {
      title: 'Is your submission available to view anywhere else? Let us know!',
      fields: [
        { name: 'videoLink', type: 'url', placeholder: 'YouTube URL', required: false },
        { name: 'githubAppLink', type: 'url', placeholder: 'GitHub URL', required: false }
      ]
    }, {
      title: 'You\'re good to go! Hit submit and we will review your profile as soon as possible!',
      fields: []
    }]
  }

]

// Initialize models of steps
for (var s = 0; s < steps.length; s++) {
  const step = steps[s]
  step.finished = false
  for (var g = 0; g < step.groups.length; g++) {
    const group = step.groups[g]
    for (var f = 0; f < group.fields.length; f++) {
      const field = group.fields[f]
      if (field.type === 'file') {
        field.model = [0]
      } else {
        field.model = ''
      }
      if (field.required != false) {
        field.required = true
      }
    }
  }
}

export default steps
