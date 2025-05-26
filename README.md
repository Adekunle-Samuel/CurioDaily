
# CurioDaily – Daily Facts PWA

A beautiful, responsive Progressive Web App that delivers fascinating facts daily with an engaging visual experience.

## ✨ Features

- **Today Screen**: Full-bleed fact cards with 3D flip animation (front: captivating blurb, back: detailed explanation + sources)
- **Topic Picker**: Interactive modal to choose from Science, History, Arts, Space, and Random categories
- **Bookmark Library**: Masonry grid layout of saved facts with quick share functionality
- **Onboarding**: Smooth 3-step carousel for topic selection, notifications, and theme preferences
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark/Light Mode**: Automatic theme detection with manual toggle
- **Accessibility**: Focus rings, reduced motion support, proper alt text

## 🎨 Visual Design

- **Color Palette**: Sky, Amber, and Slate with gentle gradients
- **Typography**: Large headline fonts (24-40px clamp) with system font stack
- **Animations**: Y-axis 180° flip using react-spring, fallback to fade for reduced motion
- **Glass Morphism**: Subtle backdrop blur and glass-like shadows

## 🛠 Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Spring** for smooth animations
- **Shadcn/UI** for consistent components
- **PWA Ready** (service worker hooks included)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd curio-daily
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

### Preview Production Build

```bash
npm run preview
```

## 📱 PWA Features (Stubbed)

The app includes hooks for PWA functionality:

- Service Worker registration
- Push notification handlers
- IndexedDB integration for offline storage
- App manifest for installation

*Note: These are currently stubbed for the visual layer. Backend integration required for full functionality.*

## 🎯 Project Structure

```
src/
├── components/
│   ├── FactCard.tsx       # 3D flip card component
│   ├── TopicPicker.tsx    # Modal for topic selection
│   ├── BookmarkGrid.tsx   # Masonry layout for saved facts
│   ├── Layout.tsx         # Main app layout with navigation
│   └── Onboarding.tsx     # 3-step welcome flow
├── hooks/
│   ├── useTheme.ts        # Theme management
│   └── useBookmarks.ts    # Local storage for saved facts
├── theme.ts               # Design system constants
└── App.tsx               # Main application component

public/
└── facts.json            # Mock data for facts
```

## 🎨 Customization

### Colors
Modify the color palette in `tailwind.config.ts`:

```typescript
colors: {
  sky: { /* Your sky palette */ },
  // Add custom colors
}
```

### Animations
Animations use react-spring. Modify spring configs in `FactCard.tsx`:

```typescript
const { transform } = useSpring({
  config: { mass: 5, tension: 500, friction: 80 }
});
```

### Typography
Font sizes use clamp() for responsive scaling:

```css
.hero-text {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
}
```

## 📊 Performance

- **Lazy Loading**: Components load on demand
- **Image Optimization**: WebP with fallbacks
- **Code Splitting**: Route-based chunks
- **Tree Shaking**: Unused code elimination

## ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and structure
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **Color Contrast**: WCAG AA compliant
- **Focus Management**: Visible focus indicators

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

### Environment Variables

Create `.env.local` for local development:

```env
VITE_API_URL=https://your-api-endpoint.com
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built with ❤️ for curious minds everywhere
