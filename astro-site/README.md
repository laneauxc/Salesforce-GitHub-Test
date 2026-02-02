# Salesforce GitHub Test Documentation

This is the documentation site for the Salesforce GitHub Test repository, built with Astro, React, and Tailwind CSS. It includes two modern UI screens for creating prompts and building agents visually.

## 🚀 Features

- **Documentation Site**: Comprehensive documentation with navigation and search
- **Chat Prompts Landing Screen**: Interactive prompt creation interface
- **Agent Builder Canvas**: Visual node-based workflow editor with drag-and-drop

## 📦 Tech Stack

- **Astro 5.x**: Modern static site builder
- **React 18**: UI component library
- **Tailwind CSS 3**: Utility-first CSS framework
- **TypeScript**: Type-safe development

## 🛠️ Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:4321/Salesforce-GitHub-Test/` to view the site.

### Build

Build for production:

```bash
npm run build
```

The built site will be in the `dist/` directory.

### Preview

Preview the production build:

```bash
npm run preview
```

## 📄 Pages and Routes

### Documentation Pages
- `/` - Home page
- `/features/` - Features overview
- `/bugfixes/` - Bug fixes documentation
- `/support/` - Support documentation

### Application Screens

**To access the UI screens:**
- Click "UI Screens" in the sidebar navigation, then select either "Chat Prompts" or "Agent Builder"
- Or click the links in the "🚀 Interactive UI Screens" section on the homepage

- `/chat-prompts/` - **Chat Prompts Landing Screen**
  - Left sidebar navigation with Create, Manage, and Optimize sections
  - Centered prompt creation card
  - Suggestion chips for quick prompts
  - Interactive input with submit functionality
  
- `/agent-builder/` - **Agent Builder Canvas Screen**
  - Node palette with Core, Tools, Logic, and Data categories
  - Drag-and-drop canvas for building agent workflows
  - Visual node connections with SVG edges
  - Top controls (Evaluate, Code, Publish)
  - Bottom controls (Zoom, Center, Undo, Redo)

## 🗂️ Project Structure

```
/
├── public/              # Static assets (images, fonts)
├── src/
│   ├── components/      # React components
│   │   ├── SidebarNav.tsx        # Navigation sidebar
│   │   ├── PromptCreateCard.tsx  # Prompt creation UI
│   │   ├── NodePalette.tsx       # Draggable node palette
│   │   ├── Canvas.tsx            # Agent builder canvas
│   │   ├── NodeCard.tsx          # Individual node component
│   │   ├── EdgeRenderer.tsx      # SVG edge/connection renderer
│   │   ├── TopControls.tsx       # Top action buttons
│   │   └── BottomControls.tsx    # Bottom toolbar controls
│   ├── layouts/         # Page layouts
│   │   └── Layout.astro          # Main documentation layout
│   ├── pages/           # Site pages (file-based routing)
│   │   ├── index.astro           # Home page
│   │   ├── chat-prompts.astro    # Chat prompts screen
│   │   ├── agent-builder.astro   # Agent builder screen
│   │   ├── features/             # Feature documentation
│   │   ├── bugfixes/             # Bug fix documentation
│   │   └── support/              # Support documentation
│   └── styles/          # Global styles
│       ├── global.css            # Cyberpunk-themed documentation styles
│       └── tailwind.css          # Tailwind base styles
├── astro.config.mjs     # Astro configuration
├── tailwind.config.mjs  # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## 🎨 Component Overview

### Chat Prompts Screen Components

**SidebarNav**
- Displays three sections: Create, Manage, Optimize
- Supports selected state highlighting
- Icon + label layout for each item

**PromptCreateCard**
- Centered creation module with chat bubble icon
- "+ Create" button to navigate to Agent Builder
- Input field with placeholder and submit button
- Suggestion chips that populate the input when clicked

### Agent Builder Screen Components

**NodePalette**
- Four node categories: Core, Tools, Logic, Data
- Draggable node items with HTML5 drag API
- Visual hover states and cursor feedback

**Canvas**
- Drop zone for creating new nodes
- Grid background pattern
- Initial setup with Start and My agent nodes
- Drag existing nodes to reposition them

**NodeCard**
- Rounded card design with icon and labels
- Selection state with blue outline
- Draggable (except Start node)
- Dynamic positioning

**EdgeRenderer**
- SVG-based connection rendering
- Straight lines between nodes
- Arrow markers on connections

**TopControls**
- Evaluate, Code, and Publish buttons
- Positioned at top-right of canvas

**BottomControls**
- Zoom in/out, Center view, Undo, Redo
- Floating toolbar at bottom-center

## 🔧 Key Features Implementation

### Drag and Drop
- Node palette items are draggable using `draggable` attribute
- Canvas accepts drops via `onDrop` and `onDragOver` handlers
- Existing nodes can be repositioned by dragging
- Real-time position updates during drag

### State Management
- React `useState` for local component state
- Node and edge arrays managed in Canvas component
- Selection tracking for visual feedback

### Navigation
- Programmatic navigation between screens
- Back button on Agent Builder to return to Chat Prompts
- "+ Create" button navigates to Agent Builder

### Styling
- Tailwind CSS utility classes for rapid styling
- Clean, minimal modern design
- Responsive layout considerations
- Consistent color scheme and spacing

## 📸 Screenshots

### Chat Prompts Landing Screen
![Chat Prompts](https://github.com/user-attachments/assets/fd8173f8-c1e9-48e2-a9c3-bfc973b1fd7a)

### Agent Builder Canvas Screen
![Agent Builder](https://github.com/user-attachments/assets/2cfbc180-0478-433c-8273-17bd0521ba3c)

## 🧪 Testing

The application has been tested with:
- Page loading and rendering
- Drag and drop functionality
- Navigation between screens
- Input interaction
- Suggestion chip interaction

## 🚀 Deployment

This site is configured for GitHub Pages deployment:
- Base URL: `/Salesforce-GitHub-Test`
- Site URL: `https://laneauxc.github.io`

Build and deploy:
```bash
npm run build
# Deploy dist/ directory to GitHub Pages
```

## 📚 Learn More

- [Astro Documentation](https://docs.astro.build)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
