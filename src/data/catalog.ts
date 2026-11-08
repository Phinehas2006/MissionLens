import type { Exhibit, Story } from '../types/mission';
import rawStories from './stories.json';

export const stories = rawStories as Story[];

export const exhibits: Exhibit[] = [
  {
    storyId: 'story-1', title: 'Lunar Roving Vehicle', year: 'Apollo 15 · 1971', destination: 'The Moon',
    intro: 'A battery-powered electric car gave Apollo 15 astronauts room to explore farther from their lunar lander.',
    model: '/models/Curiosity.glb', modelLabel: 'Curiosity 3D model · supplied as Curiosity.glb', facts: [
      { label: 'Mesh wheels', detail: 'The lightweight wheels used wire mesh and metal cleats for grip on the lunar surface.', x: 32, y: 63 },
      { label: 'Seats & controls', detail: 'Two astronauts rode side by side and steered the electric rover with a hand controller.', x: 52, y: 40 },
      { label: 'Antenna', detail: 'The rover carried antennas and a TV camera so the crew could share parts of their work with Earth.', x: 70, y: 24 },
    ], science: 'The rover helped the crew travel over 17 miles, collect lunar samples, and set up experiments during three traverses.',
    source: 'https://www.nasa.gov/specials/apollo50th/missions.html', sourceLabel: 'NASA Apollo 15 mission overview',
  },
  {
    storyId: 'story-2', title: 'Viking 1 Lander', year: 'Viking 1 · 1976', destination: 'Mars',
    intro: 'Viking 1 combined a camera, robotic arm, and a set of biology and chemistry experiments on the Martian surface.',
    model: '/models/Viking Lander.glb', modelLabel: 'Workspace model · source metadata not provided', facts: [
      { label: 'Camera mast', detail: 'The cameras returned the first pictures from the surface of Mars.', x: 48, y: 14 },
      { label: 'Sampler arm', detail: 'A robotic arm scooped Martian soil and delivered samples to onboard instruments.', x: 23, y: 57 },
      { label: 'Instrument deck', detail: 'Experiments examined soil chemistry and searched for signs of biological activity.', x: 70, y: 56 },
    ], science: 'Viking carried out the first direct experiments looking for life on Mars. The results did not establish that life existed; scientists still debate one experiment.',
    source: 'https://science.nasa.gov/mission/viking-1/', sourceLabel: 'NASA Viking 1 mission and science overview',
  },
  {
    storyId: 'story-3', title: 'Voyager 1', year: 'Voyager 1 · 1977', destination: 'Interstellar space',
    intro: 'This deep-space probe used a large dish antenna to send measurements home and carries Earth’s Golden Record.',
    model: '/models/Voyager.glb', modelLabel: 'Workspace model · source metadata not provided', facts: [
      { label: 'High-gain antenna', detail: 'The dish focuses radio signals between Voyager and Earth’s Deep Space Network.', x: 58, y: 22 },
      { label: 'Science boom', detail: 'Sensors on long booms measure particles, magnetic fields, and plasma around the spacecraft.', x: 23, y: 50 },
      { label: 'Golden Record', detail: 'A copper record carries sounds, greetings, and images selected to represent Earth.', x: 75, y: 70 },
    ], science: 'Voyager’s instruments measure the magnetic field and particles in interstellar space. Radioisotope power and careful energy-saving keep a small set of systems operating.',
    source: 'https://science.nasa.gov/mission/voyager/spacecraft/', sourceLabel: 'NASA Voyager spacecraft overview',
  },
  {
    storyId: 'story-4', title: 'Opportunity', year: 'Mars Exploration Rover · 2004–2018', destination: 'Mars',
    intro: 'Opportunity was a solar-powered field geologist that studied rocks and soil across the Meridiani Planum region.',
    model: '/models/Mars Exploration Rover - Opportunity (MER-B).glb', modelLabel: 'Workspace model · source metadata not provided', facts: [
      { label: 'Solar arrays', detail: 'Large solar panels converted sunlight into electricity and charged the rover batteries.', x: 51, y: 18 },
      { label: 'Panoramic cameras', detail: 'The mast cameras made color panoramas and helped the team choose destinations.', x: 46, y: 42 },
      { label: 'Rock tools', detail: 'Instruments on the robotic arm examined rocks at close range.', x: 72, y: 67 },
    ], science: 'Opportunity found geological evidence that ancient water had altered rocks at its landing site. Designed for about 90 sols, it operated for nearly 15 years.',
    source: 'https://science.nasa.gov/mission/mer-opportunity/', sourceLabel: 'NASA Opportunity mission overview',
  },
  {
    storyId: 'story-5', title: 'Ingenuity', year: 'Mars Helicopter · 2021–2024', destination: 'Mars',
    intro: 'A small rotorcraft demonstrated powered, controlled flight in the thin Martian atmosphere and flew 72 times.',
    model: '/models/25043_Ingenuity_v3.glb', modelLabel: 'Workspace model · source metadata not provided', facts: [
      { label: 'Counter-rotating rotors', detail: 'Two rotor sets spin in opposite directions to provide lift while balancing torque.', x: 50, y: 16 },
      { label: 'Solar panel', detail: 'A solar panel charged batteries that powered flight and overnight survival heaters.', x: 68, y: 43 },
      { label: 'Navigation camera', detail: 'Onboard cameras and sensors helped the helicopter navigate without real-time piloting from Earth.', x: 34, y: 75 },
    ], science: 'Ingenuity proved that powered flight is possible in Mars’s thin air. It was a technology demonstration that far exceeded its five-flight plan.',
    source: 'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/', sourceLabel: 'NASA Ingenuity mission overview',
  },
];

export const scienceDetails = [
  { label: 'Electric mobility', icon: '01', text: 'Apollo 15’s rover used batteries and four electric drive motors. It let the crew carry more samples and explore beyond walking distance.', diagram: 'Battery → electric motors → four wheels', source: exhibits[0].source },
  { label: 'Searching soil', icon: '02', text: 'Viking’s sampler arm delivered soil to biology and chemistry instruments. Its biology experiments produced results that were not a clear demonstration of Martian life.', diagram: 'Soil scoop → onboard experiments → measurements', source: exhibits[1].source },
  { label: 'Listening to space', icon: '03', text: 'Voyager sends faint radio signals toward Earth. Large Deep Space Network antennas receive the signals, while onboard instruments sample the environment around the spacecraft.', diagram: 'Voyager radio → Deep Space Network → scientists', source: exhibits[2].source },
  { label: 'Reading rocks', icon: '04', text: 'Opportunity used cameras and instruments on its robotic arm to study rocks. Their minerals preserved clues about water in Mars’s ancient past.', diagram: 'Drive → image → inspect rock → test minerals', source: exhibits[3].source },
  { label: 'Flying on Mars', icon: '05', text: 'Ingenuity’s fast-spinning rotor blades generated lift in air far thinner than Earth’s. Its onboard computer and sensors handled each flight autonomously.', diagram: 'Fast rotors + thin air + onboard control = flight', source: exhibits[4].source },
];
