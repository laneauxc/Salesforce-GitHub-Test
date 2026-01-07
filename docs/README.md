# GitHub Pages Documentation

This directory contains the source files for the GitHub Pages documentation site.

## Structure

```
docs/
├── _config.yml           # Jekyll configuration
├── _layouts/             # Custom page layouts
│   └── default.html      # Main layout with navigation
├── assets/               # Static assets
│   └── css/
│       └── custom.css    # Custom styling
├── index.md              # Homepage
├── features/             # Features documentation
│   ├── index.md
│   ├── feature1.md
│   └── feature2.md
├── bugfixes/             # Bug fixes documentation
│   ├── index.md
│   ├── invoice-fix.md
│   ├── security-patch.md
│   └── bugfix-description.md
└── support/              # Support resources
    ├── index.md
    └── support-update.md
```

## Setup

GitHub Pages is configured to build from the `docs` directory using Jekyll. The site will be automatically deployed when changes are pushed to the main branch via the GitHub Actions workflow.

## Local Development

To test the site locally:

1. Install Jekyll and dependencies:
   ```bash
   gem install jekyll bundler
   ```

2. Navigate to the docs directory:
   ```bash
   cd docs
   ```

3. Serve the site locally:
   ```bash
   jekyll serve
   ```

4. Open your browser to `http://localhost:4000/Salesforce-GitHub-Test/`

## Adding New Documentation

1. Create a new markdown file in the appropriate directory (features/, bugfixes/, or support/)
2. Add front matter to the file:
   ```yaml
   ---
   layout: default
   title: Your Page Title
   ---
   ```
3. Add your content in Markdown format
4. Update the corresponding index.md file to link to your new page
5. Commit and push your changes

## Theme

This site uses the Cayman theme with custom styling for enhanced navigation and readability. The navigation menu is defined in `_config.yml` and rendered in `_layouts/default.html`.

## Integration with Other Repositories

This documentation structure is designed to be easily integrated with other repository documentation. Each repository can maintain its own documentation in a similar structure, which can then be aggregated into a central documentation site using Jekyll's include and collection features.
