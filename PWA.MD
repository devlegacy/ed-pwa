Demo

# Publish


# PWA Demo

# Publish

```bash
  npm start webpack.build.app
  git subtree push --prefix public origin gh-pages
  rm -R ./public/
```

````bash
  git branch -D gh-pages
  git checkout -b gh-pages
  npm run build:prod
  rm -R node_modules/
  rm -R src/
  rm .browserslistrc .csscomb.json .editorconfig .gitattributes .gitignore .htaccess dvx.json package.json package-lock.json PWA.MD README.MD webpack.dvx.js

  mv ./public/* ./
  rm -R ./public/

  git add .
  git commit -m "Pre publish"
  git push -u origin gh-pages
```
