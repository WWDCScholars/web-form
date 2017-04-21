const stephandling = {
  serializeSteps (steps) {
    var ret = {
      scholar: {},
      wwdcYearInfo: {},
      socialMediaReference: {}
    }

    for (var s = 0; s < steps.length; s++) {
      const step = steps[s]
      var currentParameterName = step.ckParameterName

      for (var g = 0; g < steps.groups.length; g++) {
        const group = steps.groups[g]
        if (group.ckParameterName) {
          currentParameterName = group.ckParameterName
        }

        for (var f = 0; f < group.fields.length; f++) {
          const field = group.fields[f]

          if (field.type === 'location') {
            const latLong = field.model.split(',').map((string) => {
              return !isNaN(string) ? parseInt(string) : undefined
            })
            ret[currentParameterName][field.name] = { value: { latitude: latLong[0], longitude: latLong[1] } }
          } else if (field.type === 'file') {
            if (field.model.length > 1) {
              var fileField = []
              for (var m = 0; m < field.model; m++) {
                const fileModel = field.model[m]
                fileField.push({ value: fileModel })
              }
              ret[currentParameterName][field.name] = fileField
            } else {
              ret[currentParameterName][field.name] = { value: field.model[0] }
            }
          } else {
            ret[currentParameterName][field.name] = { value: field.model }
          }
        }
      }
    }

    scholar.wwdcYearInfos = [wwdcYearInfo]
    scholar.socialMediaReference = socialMediaReference
    return scholar
  }
}

module.exports = stephandling
