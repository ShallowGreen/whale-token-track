module.exports = {
  extends: [require.resolve('uniubi-lint/typescript/node')],
  rules: {
    'import/no-cycle': 0,
  },
};
