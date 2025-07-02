
import { useEffect, useRef, useState } from 'react';
import { ControlPanel } from './ControlPanel';
import { initThreeJS, animateScene, updatePlanetSpeeds, pauseAnimation, resumeAnimation, focusOnPlanet } from '../utils/threeJSScene';

export const SolarSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [planetSpeeds, setPlanetSpeeds] = useState({
    mercury: 1,
    venus: 1,
    earth: 1,
    mars: 1,
    jupiter: 1,
    saturn: 1,
    uranus: 1,
    neptune: 1
  });

  useEffect(() => {
    if (canvasRef.current) {
      const scene = initThreeJS(canvasRef.current);
      animateScene();

      const handleResize = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleSpeedChange = (planet: string, speed: number) => {
    setPlanetSpeeds(prev => ({ ...prev, [planet]: speed }));
    updatePlanetSpeeds({ ...planetSpeeds, [planet]: speed });
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resumeAnimation();
    } else {
      pauseAnimation();
    }
    setIsPaused(!isPaused);
  };

  const handlePlanetFocus = (planet: string) => {
    setSelectedPlanet(planet);
    focusOnPlanet(planet);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3 md:p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Solar System Explorer
          </h1>
          <div className="flex gap-2 md:gap-4">
            <button
              onClick={handlePauseResume}
              className="px-4 md:px-6 py-1.5 md:py-2 text-sm md:text-base bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>
        </div>
      </div>

      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none"
        style={{ background: 'linear-gradient(to bottom, #0f0f23, #1a0b2e, #000000)' }}
      />

      {/* Control Panel */}
      <ControlPanel
        planetSpeeds={planetSpeeds}
        onSpeedChange={handleSpeedChange}
        onPlanetFocus={handlePlanetFocus}
        selectedPlanet={selectedPlanet}
      />

      {/* Planet Info Overlay - Mobile responsive */}
      {selectedPlanet && (
        <div className="absolute bottom-4 md:bottom-20 left-2 md:left-6 right-2 md:right-auto bg-black/70 backdrop-blur-md border border-blue-500/20 rounded-xl p-3 md:p-4 text-white max-w-xs mx-auto md:mx-0">
          <h3 className="text-lg md:text-xl font-semibold text-blue-400 capitalize mb-2">{selectedPlanet}</h3>
          <p className="text-sm text-gray-300">
            Orbital Speed: {planetSpeeds[selectedPlanet as keyof typeof planetSpeeds]}x
          </p>
          <button
            onClick={() => setSelectedPlanet(null)}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
