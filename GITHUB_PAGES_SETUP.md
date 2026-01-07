# GitHub Pages Setup Guide

This repository is configured with GitHub Pages to provide accessible documentation. This guide explains the setup and how to enable it.

## What Has Been Set Up

✅ **Complete GitHub Pages structure** in the `docs/` directory  
✅ **Navigation menu** with organized sections  
✅ **Custom Jekyll theme** (Cayman) with enhanced styling  
✅ **GitHub Actions workflow** for automatic deployment  
✅ **Organized documentation** across Features, Bug Fixes, and Support sections  

## Enabling GitHub Pages

To enable GitHub Pages for this repository, follow these steps:

### Step 1: Enable GitHub Pages in Repository Settings

1. Go to your repository on GitHub: `https://github.com/laneauxc/Salesforce-GitHub-Test`
2. Click on **Settings** (top navigation)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Source**: Deploy from a branch
   - **Branch**: `main` (or your default branch)
   - **Folder**: `/docs`
5. Click **Save**

### Step 2: Verify Deployment

After enabling GitHub Pages:
- GitHub will automatically build and deploy your site
- The workflow defined in `.github/workflows/pages.yml` will run
- Your site will be available at: `https://laneauxc.github.io/Salesforce-GitHub-Test/`
- Initial deployment may take 2-5 minutes

### Step 3: Access Your Documentation Site

Once deployed, your documentation will be accessible at:

**🌐 Site URL:** `https://laneauxc.github.io/Salesforce-GitHub-Test/`

The site includes:
- **Home Page**: Overview and quick links
- **Features**: Documentation for new features and enhancements
- **Bug Fixes**: Information about resolved issues and patches
- **Support**: Resources for support teams

## Site Structure

```
https://laneauxc.github.io/Salesforce-GitHub-Test/
├── /                      (Home page)
├── /features/             (Features overview)
│   ├── feature1.html      (Order Tracking API)
│   └── feature2.html      (Audit Logging)
├── /bugfixes/             (Bug fixes overview)
│   ├── invoice-fix.html   (Invoice calculation fix)
│   ├── security-patch.html (Authentication patch)
│   └── bugfix-description.html (Dashboard fixes)
└── /support/              (Support resources)
    └── support-update.html (Support documentation)
```

## Navigation Menu

The site includes a persistent navigation menu in the header with links to:
- Home
- Features
- Bug Fixes
- Support
- View on GitHub

## Adding New Documentation

To add new documentation:

1. **Create a new markdown file** in the appropriate directory:
   - `docs/features/` for new features
   - `docs/bugfixes/` for bug fixes
   - `docs/support/` for support resources

2. **Add front matter** at the top of the file:
   ```yaml
   ---
   layout: default
   title: Your Page Title
   ---
   ```

3. **Write your content** in Markdown format

4. **Update the section index** (`index.md`) to include a link to your new page

5. **Commit and push** your changes - the site will automatically rebuild

## Integration with Other Repositories

This setup is designed to be **easily integrated** with other repository documentation:

### Per-Repository Documentation Pattern

Each repository can maintain its own `docs/` directory with a similar structure:

```
repository-name/
└── docs/
    ├── _config.yml
    ├── index.md
    ├── features/
    ├── bugfixes/
    └── support/
```

### Aggregating Multiple Repositories

To create a central documentation hub:

1. **Option A: Manual Aggregation**
   - Create a central documentation repository
   - Add submodules or copy documentation from other repos
   - Use Jekyll collections to organize multi-repo docs

2. **Option B: Automated Aggregation**
   - Use GitHub Actions to fetch documentation from multiple repos
   - Build a unified site with cross-repository navigation
   - Example workflow in `.github/workflows/aggregate-docs.yml`

3. **Option C: Jekyll Remote Theme**
   - Share the same theme across repositories
   - Each repo maintains its own GitHub Pages
   - Link between sites via cross-repository navigation

## Customization

### Changing the Theme

Edit `docs/_config.yml`:
```yaml
theme: jekyll-theme-minimal  # or other supported theme
```

### Updating Navigation

Edit the navigation menu in `docs/_layouts/default.html` or `docs/_config.yml`.

### Adding Custom Styles

Add CSS to `docs/assets/css/custom.css` for additional styling.

## Local Development

To test changes locally before pushing:

```bash
# Install Jekyll
gem install jekyll bundler

# Navigate to docs directory
cd docs

# Serve the site locally
jekyll serve --baseurl ''

# Open browser to http://localhost:4000
```

## Troubleshooting

### Site Not Building

1. Check the **Actions** tab for build errors
2. Verify Jekyll syntax in markdown files
3. Ensure all front matter is properly formatted

### Broken Links

- Use relative paths: `[Link](../page.html)` instead of absolute URLs
- The `baseurl` in `_config.yml` is automatically handled by Jekyll

### Theme Issues

- Ensure the theme is [supported by GitHub Pages](https://pages.github.com/themes/)
- Custom themes may require additional configuration

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Cayman Theme](https://github.com/pages-themes/cayman)

## Support

For issues or questions about this documentation site, please [open an issue](https://github.com/laneauxc/Salesforce-GitHub-Test/issues) on GitHub.
