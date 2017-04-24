import moment from 'moment'

const stephandling = {
  serializeSteps (steps) {
    var ret = {
      scholar: {},
      wwdcYearInfo: {},
      socialMedia: {}
    }

    for (var s = 0; s < steps.length; s++) {
      const step = steps[s]
      var currentParameterName = step.ckParameterName

      for (var g = 0; g < step.groups.length; g++) {
        const group = step.groups[g]
        if (group.ckParameterName) {
          currentParameterName = group.ckParameterName
        }

        for (var f = 0; f < group.fields.length; f++) {
          const field = group.fields[f]

          if (!field.model) { // if model is empty
            continue
          }

          if (field.type === 'location') {
            const latLong = field.model.split(',').map((string) => {
              return !isNaN(string) ? parseFloat(string) : undefined
            })
            ret[currentParameterName][field.name] = { latitude: latLong[0], longitude: latLong[1] }
          } else if (field.type === 'file') {
            if (field.multiple === true) {
              var fileField = []
              for (var m = 0; m < field.model.length; m++) {
                const fileModel = field.model[m]
                if (!(fileModel instanceof File)) { continue }
                fileField.push(fileModel)
              }
              ret[currentParameterName][field.name] = fileField
            } else {
              if (!(field.model[0] instanceof File)) { continue }
              ret[currentParameterName][field.name] = field.model[0]
            }
          } else if (field.type === 'date') {
            ret[currentParameterName][field.name] = moment(field.model, field.date_format).valueOf()
          } else {
            ret[currentParameterName][field.name] = field.model
          }
        }

        currentParameterName = step.ckParameterName
      }
    }

    return ret
  },

  deserializeSteps (steps, scholarFields, socialMediaFields) {
    for (var s = 0; s < steps.length; s++) {
      let step = steps[s]

      for (var g = 0; g < step.groups.length; g++) {
        let group = step.groups[g]

        for (var f = 0; f < group.fields.length; f++) {
          const field = group.fields[f]

          // Find field in scholar default fields
          if (scholarFields[field.name]) {
            switch (field.type) {
              case 'location':
                let lf = scholarFields[field.name].value
                field.model = lf.latitude + ',' + lf.longitude
                break;
              case 'date':
                field.model = moment(scholarFields[field.name].value).format(field.date_format)
                break
              default:
                field.model = scholarFields[field.name].value
            }
          }

          // Find field in scholar social media fields
          else if (socialMediaFields[field.name]){
            field.model = socialMediaFields[field.name].value
          }
        }
      }
    }
  }
}

module.exports = stephandling
