export type StoryArtwork = {
  src: string;
  alt: string;
  description: string;
  credit: string;
  source?: string;
  kind: 'photo' | 'diagram' | 'poster';
};

const archive = '/assets/mission-archive/';
const supplied = (file: string, alt: string, description: string): StoryArtwork => ({
  src: `${archive}${file}`,
  alt,
  description,
  credit: 'Supplied project image · original credit not included',
  kind: 'photo',
});
const nasa = (id: string, alt: string, description: string, kind: StoryArtwork['kind'] = 'photo'): StoryArtwork => ({
  src: `${archive}nasa-${id}.jpg`,
  alt,
  description,
  credit: `NASA image archive · ${id}`,
  source: `https://images.nasa.gov/details/${id}`,
  kind,
});

// Each entry matches one slide in order. Keep image paths unique across all stories.
const artwork: Record<string, StoryArtwork[]> = {
  'story-1': [
    supplied('supplied-lunar-rover-1.jpg', 'Apollo lunar rover and lunar module on the Moon.', 'The lunar rover sits beside the lander on the Moon.'),
    nasa('as15-88-11901', 'Apollo 15 Lunar Roving Vehicle photographed during an extravehicular activity.', 'The rover carried the crew and their equipment across the lunar surface.'),
    nasa('S71-38189', 'Artist concept of Apollo 15 astronauts unfolding the Lunar Roving Vehicle.', 'A NASA concept shows the rover being unfolded from its stowed position.'),
    supplied('supplied-lunar-rover-2.jpg', 'Apollo lunar rover on the lunar surface.', 'A lunar rover ready for an electric-powered traverse.'),
    nasa('as17-137-20979', 'Close view of the Apollo 17 lunar rover at Taurus-Littrow.', 'A close view of the rover frame and wire-mesh wheels on the Moon.'),
    nasa('S71-33433', 'Apollo 15 Hadley-Apennine landing site and planned rover traverses.', 'A map traces rover routes across the Apollo 15 landing area.'),
    nasa('as17-134-20473', 'Earth seen above the lunar rover antenna during an Apollo moonwalk.', 'Earth appears above the rover antenna used for television and communications.'),
    supplied('supplied-lunar-rover-3.jpg', 'Lunar rover parked on the Moon after its Apollo mission.', 'The rover remains on the lunar surface where the astronauts left it.'),
  ],
  'story-2': [
    nasa('PIA00381', 'Viking 1’s first photograph from the Martian surface.', 'Viking 1 returned this first view of rocks and soil on Mars.'),
    supplied('supplied-viking-lander.jpg', 'Viking lander spacecraft displayed on a test surface.', 'A Viking lander shows the cameras, legs, and science deck sent to Mars.'),
    nasa('PIA00395', 'Viking 1 surface sampler collector head.', 'The sampler head collected Martian soil for onboard experiments.'),
    nasa('PIA00384', 'Soil disturbed when Viking 1’s protective cover struck the Martian surface.', 'The disturbed soil gave Viking scientists a close look at the landing site.'),
    nasa('PIA03165', 'Viking 1 panoramic view of Chryse Planitia.', 'The lander’s panorama shows the landscape around its science laboratory.'),
    nasa('PIA00392', 'Meteorology instrument on Viking 1.', 'Viking instruments also measured Martian weather while the biology tests ran.'),
    nasa('PIA00563', 'First color image returned by Viking Lander 1.', 'Color observations helped scientists interpret the lander’s soil experiments.'),
    nasa('PIA00385', 'High-resolution image of the Viking 1 landing site.', 'Viking left a lasting set of images and unanswered questions about life on Mars.'),
  ],
  'story-3': [
    supplied('supplied-voyager.jpg', 'Voyager spacecraft travelling through deep space.', 'Voyager carries a small message from Earth into interstellar space.'),
    nasa('PIA17464', 'Voyager 1 launch in 1977.', 'Voyager began its long journey with a launch from Cape Canaveral.'),
    nasa('PIA17048', 'Artist concept of Voyager crossing the heliosphere boundary.', 'A concept illustrates Voyager passing beyond the Sun’s neighborhood.'),
    nasa('PIA14113', 'Illustration showing the Voyager Golden Record and spacecraft.', 'The Golden Record carries greetings and sounds selected on Earth.'),
    nasa('PIA25782', 'Radioisotope thermoelectric generator on Voyager.', 'Voyager’s radioisotope generators convert heat into electrical power.'),
    supplied('supplied-deep-space-network-dish.jpg', 'Large Deep Space Network radio antenna.', 'A giant radio dish listens for Voyager’s faint signal.'),
    nasa('PIA16484', 'Diagram locating an instrument on the Voyager spacecraft.', 'Engineers turn off some instruments to save power for the remaining science systems.', 'diagram'),
    nasa('PIA17046', 'Artist concept of Voyager travelling through interstellar space.', 'Voyager has crossed into the space between the stars.'),
    supplied('supplied-golden-record.jpg', 'The Voyager Golden Record being prepared by its engineering team.', 'The Golden Record carries a small collection of Earth’s sounds and images.'),
  ],
  'story-4': [
    nasa('PIA05180', 'Opportunity rover beside the lander that delivered it to Mars.', 'Opportunity began its mission as a small rover on a broad Martian plain.'),
    supplied('supplied-opportunity.jpg', 'Opportunity rover deck and solar panels on Mars.', 'Opportunity explored rocks and soil as a robotic field geologist.'),
    nasa('PIA07108', 'Opportunity rover during a Martian winter.', 'The solar arrays collected sunlight and charged the rover’s batteries.'),
    nasa('PIA21485', 'Dust moving through the Martian atmosphere during a storm.', 'Martian winds can move dust that blocks sunlight from reaching the rover.'),
    nasa('PIA20285', 'Opportunity examining a rock abrasion target on Mars.', 'Opportunity used its instruments to study Martian rocks and send results home.'),
    nasa('PIA22737', 'NASA view of the 2018 global dust storm on Mars.', 'The planet-wide storm darkened the sky and cut off sunlight to Opportunity.'),
    nasa('PIA21493', 'Opportunity panorama of the Rocheport area on Mars.', 'The rover kept exploring across the Martian landscape for years.'),
    nasa('PIA22908', 'Opportunity’s final panoramic view of Mars.', 'Opportunity’s long mission left a final panorama of the terrain it explored.'),
  ],
  'story-5': [
    supplied('supplied-ingenuity-1.jpg', 'Ingenuity helicopter flying over the Martian surface.', 'A small aircraft was sent to test powered flight on another planet.'),
    supplied('supplied-ingenuity-2.jpg', 'Ingenuity Mars Helicopter viewed on Earth before flight.', 'Ingenuity packed rotors, a camera, batteries, and a flight computer into a tiny body.'),
    nasa('PIA25211', 'NASA model of atmospheric density around Mars.', 'Mars’s thin atmosphere gives helicopter blades much less air to push against.'),
    nasa('PIA24812', 'Close view of Ingenuity’s upper swashplate rotor assembly.', 'The two rotor sets spin in opposite directions to help balance the helicopter.'),
    supplied('supplied-ingenuity-4.jpg', 'Ingenuity’s shadow across the Martian ground, seen from above.', 'The helicopter used its onboard navigation system to track its position over the ground.'),
    nasa('PIA23968', 'Mars helicopter base station mounted on Perseverance.', 'Ingenuity sent flight data to Perseverance, which relayed it onward.'),
    nasa('PIA25321', 'Ingenuity during a record-breaking flight on Mars.', 'Ingenuity far exceeded its original plan of five test flights.'),
    nasa('PIA26482', 'Ingenuity resting on Mars after a hard landing.', 'Damage during the final landing ended Ingenuity’s flights.'),
    supplied('supplied-ingenuity-3.jpg', 'Aerial view of the Martian terrain seen from Ingenuity.', 'Ingenuity’s flights opened a new way to explore hard-to-reach places on Mars.'),
  ],
};

export function artworkForSlide(storyId: string, slideIndex: number): StoryArtwork | undefined {
  return artwork[storyId]?.[slideIndex];
}
