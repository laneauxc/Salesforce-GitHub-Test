# Salesforce GitHub Test Documentation - Astro Site

This is a modern documentation site built with [Astro](https://astro.build), replacing the previous Jekyll implementation.

## 🚀 Features

- **Modern Static Site Generator**: Built with Astro for blazing-fast performance
- **Responsive Design**: Beautiful OpenAI-inspired theme that works on all devices
- **Easy to Maintain**: Simple markdown-based content management
- **SEO Optimized**: Includes sitemap generation and proper meta tags
- **GitHub Pages Ready**: Automated deployment via GitHub Actions

## 📁 Project Structure

```
astro-site/
├── public/
│   └── assets/
│       ├── images/     # Logo and images
│       └── js/         # Legacy JavaScript files
├── src/
│   ├── layouts/
│   │   └── Layout.astro    # Main layout with navigation
│   ├── pages/
│   │   ├── index.astro     # Homepage
│   │   ├── features/       # Feature documentation
│   │   ├── bugfixes/       # Bug fix documentation
│   │   └── support/        # Support documentation
│   └── styles/
│       └── global.css      # Global styles
├── astro.config.mjs        # Astro configuration
└── package.json
```

## 🧞 Commands

All commands are run from the `astro-site` directory:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |

## 🌐 Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

### Manual Deployment

1. Ensure you're in the `astro-site` directory
2. Run `npm run build`
3. The built site will be in the `dist/` directory
4. Push changes to trigger the GitHub Actions workflow

### GitHub Pages Configuration

The site is configured to be deployed to:
- **URL**: `https://laneauxc.github.io/Salesforce-GitHub-Test/`
- **Base Path**: `/Salesforce-GitHub-Test`

This is configured in `astro.config.mjs`.

## 📝 Adding Content

### Adding a New Page

1. Create a new `.astro` file in the appropriate directory under `src/pages/`
2. Use the Layout component:

```astro
---
import Layout from '../../layouts/Layout.astro';
---

<Layout title="Your Page Title" description="Your description">
  <!-- Your content here -->
</Layout>
```

3. Update the navigation in `src/layouts/Layout.astro` if needed

### Styling

- Global styles are in `src/styles/global.css`
- The theme uses CSS variables for easy customization
- The design follows an OpenAI-inspired aesthetic with ConvoPro brand accents

## 🎨 Design System

The site uses a modern design system with:
- **Clean Typography**: Optimized for readability
- **Responsive Layout**: Mobile-first approach
- **Sidebar Navigation**: Easy access to all documentation
- **Search Functionality**: Quick content discovery (placeholder for now)
- **Accessible**: WCAG compliant design

## 📦 Technology Stack

- **Astro** - Static Site Generator
- **@astrojs/mdx** - MDX support for advanced markdown
- **@astrojs/sitemap** - Automatic sitemap generation
- **Font Awesome** - Icon library

## 🔄 Migrating from Jekyll

This site replaces the previous Jekyll implementation with a modern Astro build. Key improvements:

1. **Faster Builds**: Astro builds are significantly faster than Jekyll
2. **Better DX**: Modern JavaScript tooling and hot module reloading
3. **Zero JavaScript by Default**: Better performance with opt-in interactivity
4. **Modern Styling**: Updated CSS with better responsive design
5. **Easier Maintenance**: Simpler file structure and configuration

## 📄 License

This documentation is part of the Salesforce GitHub Test repository.
