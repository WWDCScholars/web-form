import { Validator } from 'vee-validate'

const validateImageMin = {
  getMessage(field, args) {
    const width = args[0]
    const height = args[1]
    return 'The image size has to be at least ' + width + 'x' + height + ' pixels'
  },
  validate(file, args) {
    const width = args[0]
    const height = args[1]
    const URL = window.URL || window.webkitURL
    return new Promise(resolve => {
      const image = new Image()
      image.onerror = () => resolve({ valid: false })
      image.onload = () => resolve({
        valid: image.width >= Number(width) && image.height >= Number(height)
      })

      image.src = URL.createObjectURL(file[0])
    })
  }
}

Validator.extend('dimensions_min', validateImageMin)

export default { validateImageMin }
