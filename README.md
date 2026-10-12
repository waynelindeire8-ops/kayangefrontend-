# Kayange UI (frontend)

Static site (HTML/CSS/JS). Talks to the API in `../backend` over HTTPS.

    src/templates, src/static   editable source
    routes.json                 URL -> page map (generated from the Flask routes)
    build.py                    renders src -> dist
    dist/                       what you deploy (already built once with a PLACEHOLDER api url)

## Build
    pip install jinja2
    python build.py --api-base https://api.yourdomain.com

## Deploy to Cloudflare Pages
Direct upload:
    npx wrangler pages deploy dist --project-name kayange-ui
Or connect the Git repo: build command `pip install jinja2 && python build.py`, output directory `dist`,
environment variable `API_BASE_URL=https://api.yourdomain.com`.
Then add a custom domain such as `app.yourdomain.com` to the Pages project.

## Local preview
    npx wrangler pages dev dist      # http://localhost:8788 (honours _redirects)
and run the backend with `FRONTEND_ORIGINS=http://localhost:8788 COOKIE_SECURE=0`.

## Notes
- Pages with a record id (`/patients/12/edit`) share one HTML file; the id is read from the URL (`static/js/config.js`).
- To point the UI at another API without rebuilding, edit `dist/env.js`.
