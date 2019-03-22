const dvx = require('@devexteam/dvx-wrapper');
dvx
  .js('src/assets/js/app.js', 'public/assets/js')
  .sw('src/assets/js/sw.js')
  .css('src/assets/scss/app.scss', 'public/assets/css')
  .html({
    title: 'EDPwa',
    template: 'src/views/pug/index.pug',
    excludeAssets: [
      /assets\/css\/.*.js/,
    ]
  }, 'public')
  .favicon('src/assets/img/dist/icons/favicon.png')
  .purifycss([]);




