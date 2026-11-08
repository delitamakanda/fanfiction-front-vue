export const validateEmail = (email: string) => {
  const trimmedEmail = email.trim()
  if (!trimmedEmail) {
    return []
  }
  const errors = []

  const emailRegex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/
  const isValidEmail = emailRegex.test(trimmedEmail)
  if (!isValidEmail) {
    errors.push('Invalid email address')
  }
  return errors
}

export const validatePassword = (password: string) => {
  if (!password) {
    return []
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  const errors = []

  const isPasswordValid = passwordRegex.test(password)
  if (!isPasswordValid) {
    errors.push(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    )
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  return errors
}

export const validateConfirmPassword = (password: string, confirmPassword: string) => {
  if (confirmPassword !== password) {
    return ['Passwords do not match']
  }
  return []
}
