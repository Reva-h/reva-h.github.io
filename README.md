# Reva Hirave — Personal Website

Welcome! This repository contains the source code for my personal website and academic portfolio.

I am a fully funded MSE Computer Science student at CITP, Princeton University. My interests include technology policy, online platforms, and building practical systems that support healthier digital environments.

## About Me

- **Name:** Reva Hirave  
- **Current Role:** MSE CS Student, Princeton University (CITP)  
- **Location:** Princeton, NJ  
- **GitHub:** [reva-h](https://github.com/reva-h)  
- **LinkedIn:** [reva-hirave](https://www.linkedin.com/in/reva-hirave)

## What’s in this site

This website includes:

- A short bio and background
- Projects
- Publications
- Teaching
- CV and related materials

## Run locally

```bash
bundle install
JEKYLL_ENV=production bundle exec jekyll serve --livereload --port 4002 --config _config.yml,_config_dev.yml
```

The `_config_dev.yml` override makes generated links point at `127.0.0.1:4002` instead of the deployed site, so you can actually click around and see your changes. `JEKYLL_ENV=production` is required too — Jekyll's `serve` command silently overrides `site.url` to `http://localhost:<port>` whenever it thinks it's in "development" mode (the default), which ignores `_config_dev.yml` entirely and can break asset loading on networks that treat `localhost` and `127.0.0.1` differently (e.g. restricted/proxied WiFi).

Then open:

- http://127.0.0.1:4002

## Notes

- The generated site output is in `_site/`.
- Content is primarily managed through collections (`_projects`, `_publications`, `_teaching`) and pages in `_pages`.

---
If you find anything broken or unclear, feel free to open an issue or contact me.
