# atharva.cc - Design Portfolio

A modern, performant personal design portfolio website built with Next.js, TypeScript, and Tailwind CSS.

**Live at:** [atharva.cc](https://atharva.cc)

## Features

- ⚡ **Fast Performance** - Optimized for speed with Next.js static generation, image optimization, and code splitting
- 🎨 **Modern Design** - Clean, responsive design with smooth animations
- 🌙 **Dark Mode** - Built-in dark mode support
- 📱 **Fully Responsive** - Works beautifully on all devices
- ♿ **Accessible** - Built with accessibility in mind
- 🚀 **SEO Optimized** - Meta tags and structured data for better search visibility

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization

### Update Your Information

1. **Metadata** - Already configured for atharva.cc in `app/layout.tsx`
2. **Hero Section** - Edit `components/Hero.tsx` to customize your introduction
3. **About Section** - Edit `components/About.tsx` with your bio and skills
4. **Projects** - Update the projects array in `components/Projects.tsx` with your work
5. **Contact** - Update social links in `components/Contact.tsx` (currently set to placeholder links)

### Add Your Images

1. Replace placeholder images in the `public/` directory
2. Update image paths in `components/Projects.tsx`
3. Add your profile picture if desired

### Styling

- Global styles: `app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Component styles: Inline Tailwind classes in component files

## Performance Optimizations

- Static Site Generation (SSG) for fast page loads
- Next.js Image component for optimized images
- Code splitting and lazy loading
- Font optimization
- Compressed assets
- Minimal JavaScript bundle

## Build for Production

```bash
npm run build
npm start
```

## Deployment

This project is configured for deployment on Vercel with the atharva.cc domain.

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your custom domain `atharva.cc` in Vercel project settings
4. Configure DNS records as instructed by Vercel

The site is optimized for fast loading and includes all necessary SEO and performance optimizations.

## License

MIT
