# Agent Builder Platform - Setup and Documentation

## Overview

The Agent Builder Platform is a comprehensive UI system for managing, testing, and monitoring AI agents. Built with **HeroUI React components**, **Astro**, and **Tailwind CSS**, it provides a modern, responsive, and accessible interface for agent management.

## Features

### 1. **Agent List Page** (`/agents/`)
- **HeroUI Components Used**: Table, Chip, Button, Input, Dropdown
- **Features**:
  - Display all agents in a sortable, filterable table
  - Search by name or description
  - Filter by status (Active, Testing, Inactive)
  - Visual success rate indicators with progress bars
  - Quick actions: Edit and Test buttons
  - Status badges with color coding

### 2. **Agent Builder Page** (`/agents/builder/`)
- **HeroUI Components Used**: Card, Input, Textarea, Select, Button, Chip, Divider
- **Features**:
  - Create new agents or edit existing ones
  - Configure basic information (name, description)
  - Select AI model (GPT-4, GPT-4 Turbo, Claude, etc.)
  - Write system instructions
  - Select tools and capabilities (22+ available tools)
  - Set agent status
  - Form validation
  - Responsive card-based layout

### 3. **Agent Test Page** (`/agents/test/`)
- **HeroUI Components Used**: Card, Select, Textarea, Button, Chip, Alert, Modal, Spinner
- **Features**:
  - Select agent from dropdown
  - View agent details (description, tools)
  - Input test queries
  - Run tests with loading states
  - Display results in modal with success/error states
  - Inline alerts for quick feedback
  - Reset functionality
  - Navigate to results page

### 4. **Agent Results Page** (`/agents/results/`)
- **HeroUI Components Used**: Table, Card, Chip, Button, Input, Dropdown, Modal
- **Features**:
  - Statistics dashboard (Total, Passed, Failed, Warnings, Success Rate)
  - Comprehensive results table
  - Search and filter capabilities
  - Status indicators with icons
  - Detailed result modal with input/output comparison
  - Execution time tracking
  - Color-coded status chips

## Installation

### Prerequisites
- Node.js 20+
- npm or yarn

### Setup Steps

1. **Navigate to the Astro site directory**:
   ```bash
   cd astro-site
   ```

2. **Install dependencies** (already includes HeroUI):
   ```bash
   npm install
   ```

   The following packages are installed:
   - `@heroui/react` - HeroUI React components
   - `framer-motion` - Required peer dependency for HeroUI animations

3. **Verify Tailwind configuration**:
   The `tailwind.config.mjs` already includes HeroUI plugin:
   ```javascript
   import { heroui } from "@heroui/react";
   
   export default {
     content: [
       './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
       './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
     ],
     darkMode: 'class',
     theme: {
       extend: {},
     },
     plugins: [heroui()],
   }
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Agent List: http://localhost:4321/Salesforce-GitHub-Test/agents/
   - Agent Builder: http://localhost:4321/Salesforce-GitHub-Test/agents/builder/
   - Agent Test: http://localhost:4321/Salesforce-GitHub-Test/agents/test/
   - Agent Results: http://localhost:4321/Salesforce-GitHub-Test/agents/results/

## Architecture

### File Structure

```
astro-site/
├── src/
│   ├── components/
│   │   ├── AgentListTable.tsx          # Agent list table component
│   │   ├── AgentBuilderForm.tsx        # Agent builder form component
│   │   ├── AgentTestSandbox.tsx        # Agent test sandbox component
│   │   └── AgentResultsTable.tsx       # Test results table component
│   ├── data/
│   │   └── agents.ts                   # Demo data and TypeScript interfaces
│   ├── layouts/
│   │   └── Layout.astro                # Main layout with navigation
│   └── pages/
│       └── agents/
│           ├── index.astro             # Agent list page
│           ├── builder.astro           # Agent builder page
│           ├── test.astro              # Agent test page
│           └── results.astro           # Test results page
├── tailwind.config.mjs                 # Tailwind config with HeroUI
└── package.json                        # Dependencies
```

### Component Architecture

All components follow these patterns:
- **React functional components** with TypeScript
- **HeroUI components** for UI elements
- **Astro client directives** (`client:visible`) for hydration
- **State management** with React hooks (useState, useMemo, useEffect)
- **Demo data** from centralized data file

### HeroUI Integration

Components are hydrated on the client using Astro's client directives:

```astro
---
import AgentListTable from '../../components/AgentListTable';
---

<Layout title="Agents">
  <AgentListTable client:visible />
</Layout>
```

## Demo Data

The platform includes comprehensive demo data in `/src/data/agents.ts`:

- **8 sample agents** with different models, statuses, and capabilities
- **10 test results** showing passed, failed, and warning states
- **TypeScript interfaces** for type safety:
  - `Agent` - Agent configuration and metadata
  - `TestResult` - Test execution results

## Responsive Design

All pages are fully responsive:
- **Mobile**: Single column layout, hamburger menu
- **Tablet**: Optimized spacing and card layouts
- **Desktop**: Full table views with all columns

## Accessibility

HeroUI components provide built-in accessibility features:
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Focus management
- Color contrast compliance

## Customization

### Styling

HeroUI components can be customized via:

1. **Tailwind Classes**: Apply utility classes directly
   ```tsx
   <Button className="bg-blue-600 hover:bg-blue-700">
     Custom Button
   </Button>
   ```

2. **HeroUI Props**: Use component-specific props
   ```tsx
   <Chip color="success" variant="flat" size="sm">
     Active
   </Chip>
   ```

3. **Theme Configuration**: Modify `tailwind.config.mjs`
   ```javascript
   plugins: [heroui({
     themes: {
       light: {
         colors: {
           primary: { ... }
         }
       }
     }
   })],
   ```

### Adding New Tools

To add new tools to the agent builder:

1. Edit `/src/components/AgentBuilderForm.tsx`
2. Add tool to `availableTools` array:
   ```typescript
   const availableTools = [
     ...
     'new-tool-name',
   ];
   ```

### Adding New Models

To add new AI models:

1. Edit `/src/components/AgentBuilderForm.tsx`
2. Add model to `availableModels` array:
   ```typescript
   const availableModels = [
     ...
     { key: 'new-model', label: 'New Model' },
   ];
   ```

## Navigation Integration

The Agent Platform is integrated into the main navigation in `Layout.astro`:

```javascript
{
  title: 'Agent Platform',
  url: '/agents/',
  subitems: [
    { title: 'Agent List', url: '/agents/' },
    { title: 'Create Agent', url: '/agents/builder/' },
    { title: 'Test Agent', url: '/agents/test/' },
    { title: 'Test Results', url: '/agents/results/' }
  ]
}
```

## Building for Production

1. **Build the site**:
   ```bash
   npm run build
   ```

2. **Preview the build**:
   ```bash
   npm run preview
   ```

3. **Deploy**:
   The site is configured for GitHub Pages with base URL `/Salesforce-GitHub-Test/`

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

## Performance

- **Code splitting**: Components are loaded on demand
- **Tree shaking**: Unused code is removed
- **Optimized builds**: Production builds are minified and optimized
- **Client-side hydration**: Only interactive components are hydrated

## Troubleshooting

### Issue: Components not rendering

**Solution**: Ensure HeroUI is properly installed:
```bash
npm install @heroui/react framer-motion
```

### Issue: Styles not applying

**Solution**: Verify Tailwind config includes HeroUI content paths:
```javascript
content: [
  './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
]
```

### Issue: Build errors

**Solution**: Check that all imports are correct and TypeScript types are satisfied.

## Future Enhancements

Potential improvements:
- Real API integration (replace demo data)
- User authentication
- Agent versioning
- Collaborative editing
- Real-time test execution
- Advanced analytics dashboard
- Export/import agents
- Agent templates

## Support

For issues or questions:
- GitHub Issues: [Salesforce-GitHub-Test](https://github.com/laneauxc/Salesforce-GitHub-Test/issues)
- Documentation: This file

## License

Part of the Salesforce-GitHub-Test repository. See main README for license information.

---

**Built with**:
- [Astro](https://astro.build) - Static site framework
- [HeroUI](https://heroui.com) - React component library
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript
