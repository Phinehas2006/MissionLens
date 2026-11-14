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

const frenchArtwork: Record<string, [string, string][]> = {
  'story-1': [
    ['Rover lunaire Apollo et module lunaire sur la Lune.', 'Le rover lunaire est posé près du module sur la Lune.'], ['Véhicule lunaire Apollo 15 photographié pendant une sortie extravéhiculaire.', 'Le rover transportait l’équipage et son matériel sur la surface lunaire.'], ['Illustration des astronautes d’Apollo 15 dépliant le Lunar Roving Vehicle.', 'Cette illustration de la NASA montre le rover déplié après son rangement.'], ['Rover lunaire Apollo sur la surface de la Lune.', 'Un rover lunaire prêt à parcourir le terrain grâce à son moteur électrique.'], ['Vue rapprochée du rover lunaire Apollo 17 à Taurus-Littrow.', 'On distingue le châssis et les roues en treillis métallique du rover.'], ['Site d’atterrissage Hadley-Apennine et parcours prévus pour Apollo 15.', 'Une carte indique les trajets du rover autour du site d’atterrissage.'], ['La Terre au-dessus de l’antenne du rover pendant une sortie lunaire Apollo.', 'La Terre apparaît au-dessus de l’antenne qui servait aux images télévisées et aux communications.'], ['Rover lunaire stationné sur la Lune après la mission Apollo.', 'Le rover est toujours sur la surface lunaire, là où les astronautes l’ont laissé.']
  ],
  'story-2': [
    ['Première photographie de Viking 1 depuis la surface martienne.', 'Viking 1 a transmis cette première vue des roches et du sol de Mars.'], ['Atterrisseur Viking présenté sur une surface d’essai.', 'On distingue les caméras, les pieds et la plateforme scientifique envoyés sur Mars.'], ['Tête de collecte du bras d’échantillonnage de Viking 1.', 'Le collecteur prélevait du sol martien pour les expériences embarquées.'], ['Sol remué par la chute du couvercle protecteur de Viking 1.', 'Le sol perturbé a permis aux scientifiques d’étudier de près le site d’atterrissage.'], ['Vue panoramique de Chryse Planitia par Viking 1.', 'Le panorama montre le paysage autour du laboratoire scientifique de l’atterrisseur.'], ['Instrument météorologique de Viking 1.', 'Les instruments de Viking mesuraient aussi la météo martienne pendant les expériences biologiques.'], ['Première image en couleur transmise par Viking 1.', 'Les observations en couleur ont aidé à interpréter les expériences sur le sol.'], ['Image haute résolution du site d’atterrissage de Viking 1.', 'Viking a laissé de nombreuses images et des questions sans réponse sur la vie sur Mars.']
  ],
  'story-3': [
    ['Sonde Voyager dans l’espace lointain.', 'Voyager emporte un petit message de la Terre vers l’espace interstellaire.'], ['Lancement de Voyager 1 en 1977.', 'Voyager a commencé son long voyage en décollant de Cap Canaveral.'], ['Illustration du passage de Voyager au-delà de l’héliosphère.', 'Cette illustration montre Voyager quittant le voisinage du Soleil.'], ['Illustration du Golden Record et de la sonde Voyager.', 'Le Golden Record contient des salutations et des sons choisis sur Terre.'], ['Générateur thermoélectrique à radio-isotope de Voyager.', 'Les générateurs à radio-isotope transforment la chaleur en électricité.'], ['Grande antenne radio du Deep Space Network.', 'Une immense antenne capte le faible signal de Voyager.'], ['Schéma indiquant un instrument de la sonde Voyager.', 'Les ingénieurs éteignent certains instruments pour économiser l’énergie des systèmes encore actifs.'], ['Illustration de Voyager dans l’espace interstellaire.', 'Voyager a franchi la frontière vers l’espace entre les étoiles.'], ['Le Golden Record de Voyager préparé par l’équipe technique.', 'Le disque transporte une petite sélection de sons et d’images de la Terre.']
  ],
  'story-4': [
    ['Rover Opportunity près de l’atterrisseur qui l’a amené sur Mars.', 'Opportunity a commencé sa mission comme un petit rover sur une vaste plaine martienne.'], ['Plateforme et panneaux solaires du rover Opportunity sur Mars.', 'Opportunity étudiait les roches et le sol comme un géologue de terrain robotisé.'], ['Rover Opportunity pendant un hiver martien.', 'Les panneaux solaires captaient la lumière et rechargeaient les batteries du rover.'], ['Poussière en mouvement dans l’atmosphère martienne pendant une tempête.', 'Les vents martiens déplacent la poussière qui peut bloquer la lumière du Soleil.'], ['Opportunity examinant une roche sur Mars.', 'Le rover utilisait ses instruments pour étudier les roches et transmettre ses résultats.'], ['Vue de la tempête mondiale de poussière sur Mars en 2018.', 'La tempête a assombri le ciel et privé Opportunity de lumière solaire.'], ['Panorama d’Opportunity dans la région de Rocheport sur Mars.', 'Le rover a continué d’explorer le paysage martien pendant des années.'], ['Dernier panorama martien d’Opportunity.', 'Le long voyage d’Opportunity s’est achevé sur un panorama du terrain exploré.']
  ],
  'story-5': [
    ['Hélicoptère Ingenuity en vol au-dessus de la surface martienne.', 'Un petit aéronef a été envoyé pour tester le vol propulsé sur une autre planète.'], ['Hélicoptère martien Ingenuity photographié sur Terre avant son vol.', 'Ingenuity réunissait rotors, caméra, batteries et ordinateur de vol dans un minuscule appareil.'], ['Modèle de la densité atmosphérique de Mars.', 'L’atmosphère mince de Mars offre beaucoup moins d’air aux pales pour créer de la portance.'], ['Vue rapprochée de l’assemblage supérieur du rotor d’Ingenuity.', 'Les deux ensembles de pales tournent en sens opposés pour stabiliser l’hélicoptère.'], ['Ombre d’Ingenuity sur le sol martien, vue d’en haut.', 'Le système de navigation embarqué suivait la position de l’hélicoptère au-dessus du sol.'], ['Station de base de l’hélicoptère martien installée sur Perseverance.', 'Ingenuity envoyait ses données de vol à Perseverance, qui les relayait vers la Terre.'], ['Ingenuity pendant un vol record sur Mars.', 'Ingenuity a largement dépassé son objectif initial de cinq vols d’essai.'], ['Ingenuity posé sur Mars après un atterrissage difficile.', 'Les dégâts subis lors de son dernier atterrissage ont mis fin aux vols d’Ingenuity.'], ['Vue aérienne du terrain martien prise par Ingenuity.', 'Les vols d’Ingenuity ont ouvert une nouvelle façon d’explorer des zones difficiles d’accès.']
  ]
};

export function artworkForLocale(storyId: string, slideIndex: number, locale: 'en' | 'fr'): StoryArtwork | undefined {
  const item = artworkForSlide(storyId, slideIndex);
  const copy = frenchArtwork[storyId]?.[slideIndex];
  if (locale !== 'fr' || !item || !copy) return item;
  const credit = item.source ? `Archives d’images NASA · ${item.source.split('/').pop()}` : 'Image fournie avec le projet · crédit d’origine absent';
  return { ...item, alt: copy[0], description: copy[1], credit };
}
