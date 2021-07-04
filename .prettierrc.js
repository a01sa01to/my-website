module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  bracketSpacing: true,
  jsxBracketSameLine: false,
  importOrderSeparation: true,
  // ↓「/」を含まない、「./」を含まない、それ以外の順にimportをソートする
  importOrder: ['^(?!.*/).*$', '^(?!.*\\./).*$', '^(.*\\./).*$'],
}
