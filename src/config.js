function buildConfig (name) {
  return Object.keys(process.env)
    .filter(key => key.startsWith(`VUE_APP_${name}_`))
    .reduce((a, c) => ({ ...a, [c.replace(`VUE_APP_${name}_`, '')]: process.env[c] }), {})
}

export const firebaseConfig = buildConfig('firebaseConfig')
export const ethereumConfig = buildConfig('ethereumConfig')
