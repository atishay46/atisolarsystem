
import { Slider } from "./ui/slider";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

interface ControlPanelProps {
  planetSpeeds: Record<string, number>;
  onSpeedChange: (planet: string, speed: number) => void;
  onPlanetFocus: (planet: string) => void;
  selectedPlanet: string | null;
}

const planets = [
  { name: 'mercury', label: 'Mercury', color: '#8C7853' },
  { name: 'venus', label: 'Venus', color: '#FFC649' },
  { name: 'earth', label: 'Earth', color: '#6B93D6' },
  { name: 'mars', label: 'Mars', color: '#CD5C5C' },
  { name: 'jupiter', label: 'Jupiter', color: '#D8CA9D' },
  { name: 'saturn', label: 'Saturn', color: '#FAD5A5' },
  { name: 'uranus', label: 'Uranus', color: '#4FD0E7' },
  { name: 'neptune', label: 'Neptune', color: '#4B70DD' }
];

export const ControlPanel = ({ planetSpeeds, onSpeedChange, onPlanetFocus, selectedPlanet }: ControlPanelProps) => {
  return (
    <div className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 z-10 w-72 md:w-80 max-h-[80vh]">
      <Card className="bg-black/30 backdrop-blur-md border-blue-500/20 p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Orbital Speed Controls
        </h2>
        
        <ScrollArea className="max-h-[60vh] pr-2">
          <div className="space-y-3 md:space-y-4">
            {planets.map((planet) => (
              <div key={planet.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => onPlanetFocus(planet.name)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-400 ${
                      selectedPlanet === planet.name ? 'text-blue-400' : 'text-white'
                    }`}
                  >
                    <div 
                      className="w-3 h-3 rounded-full shadow-lg" 
                      style={{ 
                        backgroundColor: planet.color,
                        boxShadow: `0 0 8px ${planet.color}40`
                      }}
                    />
                    {planet.label}
                  </button>
                  <span className="text-xs text-gray-400 min-w-[30px] text-right">
                    {planetSpeeds[planet.name]}x
                  </span>
                </div>
                
                <Slider
                  value={[planetSpeeds[planet.name]]}
                  onValueChange={(value) => onSpeedChange(planet.name, value[0])}
                  min={0.1}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4 md:mt-6 pt-4 border-t border-blue-500/20">
          <p className="text-xs text-gray-400 text-center">
            Click on planet names to focus camera
          </p>
        </div>
      </Card>
    </div>
  );
};
