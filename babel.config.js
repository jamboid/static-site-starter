module.exports = function (api) {
  api.cache(true);

  const presets = [
    ['@babel/preset-env', {
      "useBuiltIns": "entry",
      corejs: { version: 3, proposals: true }
    }]
  ];
  const plugins = [];

  return {
    presets,
    plugins
  };
}