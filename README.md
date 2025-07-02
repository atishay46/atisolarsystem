# 3D Solar System Simulator

This project is a browser-based 3D simulation of the solar system, built using Three.js and React (via Vite). It visualizes the Sun and 8 orbiting planets with real-time speed control and interactive camera.

## Features

- 3D representation of all 8 planets orbiting the Sun
- Realistic lighting, scaling, and orbital movement
- Interactive sliders to control the speed of each planet
- Mobile-responsive layout with clean UI
- Optional features implemented:
  - Pause/Resume animation button
  - Dark mode toggle
  - Planet hover labels
  - Background stars

## Technologies Used

- Three.js
- React
- Vite
- Tailwind CSS
- TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or above recommended)
- npm or pnpm

### Installation

1. Clone the repository or download the zip:
   ```
   git clone https://github.com/atishay46/atisolarsystem.git
   cd solar-system-simulator
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open the app in your browser:
   ```
   http://localhost:8080
   ```

### Build for Production

```
npm run build
```

### Preview Production Build

```
npm run preview
```

## Notes

- The planets are represented using Three.js spheres with unique colors and textures.
- The simulation is optimized for performance and works on all modern browsers and mobile devices.
- No external 3D model files are used; all geometry is procedurally generated.
