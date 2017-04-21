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
                fileField.push(fileModel)
              }
              ret[currentParameterName][field.name] = fileField
            } else {
              ret[currentParameterName][field.name] = field.model[0]
            }
          } else {
            ret[currentParameterName][field.name] = field.model
          }
        }

        currentParameterName = step.ckParameterName
      }
    }

    return ret
  }
}

module.exports = stephandling
