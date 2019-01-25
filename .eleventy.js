module.exports = function (eleventyConfig) {
  eleventyConfig.addLayoutAlias('default', 'layouts/default.njk');
  eleventyConfig.addLayoutAlias("home", "layouts/homepage.njk");
  eleventyConfig.addLayoutAlias("work", "layouts/work.njk");
  eleventyConfig.addLayoutAlias("workList", "layouts/workList.njk");
  
  return {
    dir: {
      input: "./source", // Equivalent to Jekyll's source property
      output: "./_site" // Equivalent to Jekyll's destination property
    }
  };
};