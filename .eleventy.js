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

  let markdownIt = require("markdown-it");

  const md = new markdownIt({
    html: true
  });
  
  eleventyConfig.addShortcode("prototypeHeader", function(config ) {
    if(!config.title) {
      config.title = 'Add prototype title'; 
    }

    let notesLink = "";

    if(config.notes) {
      notesLink = `<a class="cp_PageHeader__notesLink" href="#notes">Notes</a>`
    }

    return `
    <header class="cp_PageHeader--proto cp_PageHeader">
      <div class="cp_PageHeader__inner--proto cp_PageHeader__inner">
        <h1 class="cp_PageHeader__name--proto cp_PageHeader__name"><span class="cp_PageHeader__preTitle"></span> ${config.title}</h1>
        <a class="cp_PageHeader__logo--proto cp_PageHeader__logo" href="/"><img class="ob_Image" src="/assets/img/good_logo_white.svg" width="687" height="388" alt="Good"> <span>Prototypes</span></a> 
      </div>
    </header>
    `; 
  }); 

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


  eleventyConfig.addPairedShortcode("markdown", (content) => {
    return md.render(content);
  });

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);
 
  return {
    dir: {
      input: "./source", 
      output: "./build", 
      data: "_data" // Path relative to input 
    }
  }; 
};