// Enhanced input validation utilities
export const inputValidators = {
  alpha: {
    validate: (value) => {
      if (value <= 0 || value >= 1) {
        return 'Alpha must be between 0 and 1 (exclusive)'
      }
      return null
    },
    suggestion: 'Common values: 0.05 (95% confidence), 0.01 (99% confidence)'
  },
  
  proportion: {
    validate: (value) => {
      if (value < 0 || value > 1) {
        return 'Proportion must be between 0 and 1'
      }
      return null
    },
    suggestion: 'Use 0.5 if unknown (most conservative estimate)'
  },
  
  effectSize: {
    validate: (value) => {
      if (value <= 0) {
        return 'Effect size must be positive'
      }
      return null
    },
    suggestion: 'Small: 0.2, Medium: 0.5, Large: 0.8 (Cohen\'s conventions)'
  }
}

export const getInputSuggestion = (inputName, value) => {
  const validator = inputValidators[inputName]
  return validator ? validator.suggestion : null
}

export const validateInput = (inputName, value) => {
  const validator = inputValidators[inputName]
  return validator ? validator.validate(value) : null
}
