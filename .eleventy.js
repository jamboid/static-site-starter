const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt, sizes) {
  src = './source/_assets/img/' + src;

  let metadata = await Image(src, {
    widths: [600, 1000, 1600], 
    formats: ["jpeg"], 
    urlPath: "../assets/img/processed/",
    outputDir: "source/_assets/img/processed/", 
    sharpJpegOptions: {
      quality:70
    }
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addLayoutAlias('default', 'layouts/default.njk');
  eleventyConfig.addLayoutAlias('pageindex', 'layouts/pageindex.njk');

  // Shortcodes for responsive images
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);

  // Shortcode for Markdown content
  eleventyConfig.addShortcode("animVideo", function(videoSrc, looped ) {
    let loop = '';
    
    if(looped) {
      loop = 'loop';
    }

    return `
    <video data-anim="video" muted playsinline preload="auto" width="700" height="700" ${loop}>
      <source src="${videoSrc}" type="video/mp4">
    </video>
    `
  });

  // Shortcode for Markdown content
  let markdownIt = require("markdown-it");

  const md = new markdownIt({
    html: true
  });

  eleventyConfig.addPairedShortcode("markdown", (content) => {
    return md.render(content);
  });

  
 
  return {
    dir: {
      input: "./source", 
      output: "./build", 
      data: "_data" // Path relative to input 
    }
  }; 
};