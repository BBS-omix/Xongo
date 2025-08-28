# Dingl AI Investment Presentation Website

## Overview

This is a modern, interactive website designed to present Dingl AI's investment opportunity to both technical and non-technical investors. The platform showcases an AI-powered enterprise workflow automation solution that connects, extracts, verifies, routes, and generates data with human-grade outcomes and audit-grade control.

The website features a comprehensive investment deck presentation with interactive charts, multi-language support (English/Turkish), and adjustable complexity levels to cater to different investor backgrounds. Key sections include problem-solution analysis, market opportunity, persona stories, business model, unit economics, roadmap, and financial projections.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast hot module replacement
- **Tailwind CSS** with custom design system for modern, responsive styling
- **shadcn/ui** component library providing consistent, accessible UI components
- **Recharts** for interactive data visualizations and financial charts
- **TanStack Query** for efficient state management and data fetching
- **Wouter** as a lightweight client-side routing solution

### Backend Architecture
- **Express.js** server with TypeScript for API endpoints and middleware
- **Modular route system** with centralized route registration
- **Custom error handling** middleware for graceful error responses
- **Request logging** middleware for monitoring API performance
- **Development-optimized** with Vite integration for seamless full-stack development

### State Management
- **React Context API** for global presentation settings (language, complexity)
- **TanStack Query** for server state management and caching
- **Local component state** for UI interactions and form handling

### Data Layer
- **Drizzle ORM** configured for PostgreSQL with type-safe database operations
- **Zod schemas** for runtime validation and type inference
- **Memory storage** implementation for development/testing environments
- **Database migrations** support through Drizzle Kit

### Styling System
- **CSS Custom Properties** for theme management and design tokens
- **Utility-first approach** with Tailwind CSS classes
- **Component variants** using class-variance-authority for consistent styling
- **Responsive design** with mobile-first approach
- **Dark mode support** built into the design system

### Development Tooling
- **TypeScript** for static type checking across the entire codebase
- **ESM modules** for modern JavaScript module system
- **Path aliases** for clean import statements
- **PostCSS** with Autoprefixer for CSS processing

## External Dependencies

### Core Framework Dependencies
- **React ecosystem**: React, ReactDOM, React Hook Form for form management
- **Vite**: Build tool with plugins for React and development enhancements
- **Express.js**: Node.js web framework for server-side logic

### UI and Styling
- **Radix UI**: Accessible, unstyled UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Icon library for consistent iconography
- **Recharts**: Charting library for data visualization

### Database and ORM
- **Drizzle ORM**: Type-safe ORM for PostgreSQL integration
- **Neon Database**: Serverless PostgreSQL for cloud deployment
- **Drizzle Kit**: Database migration and development tools

### State Management and Data Fetching
- **TanStack Query**: Server state management and caching
- **Zod**: Schema validation library for type-safe data handling

### Development and Build Tools
- **TypeScript**: Static type checking and enhanced developer experience
- **Replit integration**: Platform-specific tooling for deployment and development