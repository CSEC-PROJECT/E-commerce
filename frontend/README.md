# E-commerce Frontend

## Description
A modern, responsive, and dynamic frontend for a full-stack e-commerce platform. Built with React 19, Vite, and Tailwind CSS. The interface features a beautiful, accessible UI built with Shadcn UI, comprehensive client-side routing, product browsing, a cart system, user authentication flows, and a robust admin dashboard with finance analytics.

## Features
- **Modern Tech Stack**: Uses the latest versions of React (v19), Vite, and Tailwind CSS (v4).
- **Dynamic Routing**: Client-side routing managed by `react-router-dom`.
- **Component Library**: Utilizing Radix UI primitives and Shadcn UI for rich, accessible, customizable components.
- **E-commerce Core**:
  - Landing / Home page and About sections.
  - Interactive Products browsing pagination layout.
  - Dynamic user Cart management system.
  - Comprehensive Product Details page.
- **Authentication Flows**: Layouts and pages for user Login and Signup.
- **Admin Dashboard capabilities**:
  - Admin Products management.
  - Add Product & Product Preview pages.
  - Finance Analytics dashboard visualization (using Recharts).
- **Responsive Design**: Mobile-friendly, pixel-perfect user interface inspired by premium Figma designs.

## Project Structure
```text
frontend/
├── public/                # Static public assets
├── src/
│   ├── assets/            # Images, icons, and local visual assets
│   ├── components/        # Reusable UI building blocks
│   │   ├── Auth/          # Authentication related components
│   │   ├── Common/        # Global layout components (NavBar, Footer)
│   │   ├── carts/         # Shopping cart widget/features
│   │   ├── home/          # Home page specific sections
│   │   └── ui/            # Form and UI components (Shadcn UI base components)
│   ├── data/              # Static Mock data items (products, categories JSONs)
│   ├── lib/               # Utility functions (e.g., standard Tailwind styling utils)
│   ├── pages/             # Application route pages (Home, Products, Admin, etc.)
│   ├── App.jsx            # Main app component wrapping and Routes configuration
│   └── main.jsx           # React app mount entry point
├── components.json        # Shadcn UI tracking mechanism configuration
├── eslint.config.js       # ESLint configurations and rulesets for static analysis
├── package.json           # Dependencies, devDependencies, and helper scripts
├── index.css              # Global styles including core Tailwind utility imports
└── vite.config.js         # Vite compiler runtime configuration
```

## Getting Started

### Prerequisites
Make sure you have installed on your local machine:
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

### Installation
1. Move into the `frontend` folder from the root of the project:
   ```bash
   cd frontend
   ```
2. Install the necessary NPM dependencies:
   ```bash
   npm install
   ```

### Running Locally
To launch the application for standard development:
```bash
npm run dev
```
The React frontend will be hosted dynamically by Vite with Hot Module Replacement (HMR). It usually runs at `http://localhost:5173`. Check your terminal for the exact local URL it assigns.

### Building for Production
Once you're ready to deploy, run:
```bash
npm run build
```
This generates a `dist` folder encapsulating all compressed, production-ready static assets that can be distributed upon any standard Web Server.
To test the production build locally, run:
```bash
npm run preview
```

## Useful Commands
- `npm run dev`: Starts the development server.
- `npm run build`: Bundles the application for production deployment.
- `npm run preview`: Previews the distributed production build locally.
- `npm run lint`: Analyzes the codebase using ESLint to spot potential bugs.

## Primary Technologies
- [React](https://react.dev/) (v19) 
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (v4)
- [React Router](https://reactrouter.com/)
- [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/) (for Analytics visualization)
- [Lucide React](https://lucide.dev/) (for typography/icons)
- [@fontsource-variable/geist](https://fontsource.org/fonts/geist) (for uniform project styling)
