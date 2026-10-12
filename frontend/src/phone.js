// Indian mobile numbers: exactly 10 digits
export function cleanPhone(value) {
  return value.replace(/\D/g, '').slice(0, 10)
}

export function isValidPhone(value) {
  return /^[0-9]{10}$/.test(value)
}