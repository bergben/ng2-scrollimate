export default {
  entry: 'dist/ng2-scrollimate.js',
  dest: 'dist/bundles/ng2-scrollimate.umd.js',
  sourceMap: false,
  format: 'umd',
  moduleName: 'ng2-scrollimate',
  globals: {
    '@angular/core': 'ng.core'
  }
}