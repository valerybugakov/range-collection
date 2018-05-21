export function invariant(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

export const compose = (...fns) =>
  fns.reduce((f, g) => (...args) => f(g(...args)))
