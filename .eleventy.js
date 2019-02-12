module.exports = function (eleventyConfig) {
  eleventyConfig.addLayoutAlias('default', 'layouts/default.njk');

  return {
    dir: {
      input: "./source", 
      output: "./build", 
      data: "_data" // Path relative to input 
    }
  }; 
};