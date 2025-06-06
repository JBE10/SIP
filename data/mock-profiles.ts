export const mockProfiles = [
  {
    id: "1",
    name: "Mauro Brero",
    age: 28,
    location: "Palermo, CABA",
    bio: "Fanático del fútbol y jugador de Boca Juniors amateur. Busco compañeros para jugar los fines de semana en las canchas de Palermo. También me gusta correr por los bosques.",
    sports: ["Fútbol", "Running", "Tenis"],
    distance: 2.5,
    profilePicture: "/images/profile1.png",
  },
  {
    id: "2",
    name: "Damian Dalla Vía",
    age: 26,
    location: "Belgrano, CABA",
    bio: "Estudiante de educación física. Me gusta entrenar en el gimnasio y jugar al tenis. Busco compañeros para actividades al aire libre y para mejorar mi técnica en tenis.",
    sports: ["Tenis", "Gimnasio", "Natación"],
    distance: 3.8,
    profilePicture: "/images/profile2.png",
  },
  {
    id: "3",
    name: "Elias Ojeda",
    age: 25,
    location: "Recoleta, CABA",
    bio: "Apasionado del básquet y el running. Entreno 4 veces por semana y busco compañeros para motivarnos mutuamente. Me encanta la competencia sana y superarme día a día.",
    sports: ["Básquet", "Running", "Ciclismo"],
    distance: 1.7,
    profilePicture: "/images/profile3.png",
  },
  {
    id: "4",
    name: "Tomas Brusco",
    age: 22,
    location: "Núñez, CABA",
    bio: "Entrenador personal y amante del fitness. Busco compañeros para entrenar en el gimnasio o hacer actividades al aire libre. Puedo ofrecer consejos sobre nutrición y entrenamiento.",
    sports: ["Gimnasio", "Crossfit", "Funcional"],
    distance: 4.2,
    profilePicture: "/images/profile4.png",
  },
  {
    id: "5",
    name: "Santiago López",
    age: 28,
    location: "Caballito, CABA",
    bio: "Jugador de pádel nivel intermedio. También disfruto del ciclismo los fines de semana por los bosques de Palermo. Busco gente con buena onda para compartir deportes y quizás un mate después.",
    sports: ["Pádel", "Ciclismo", "Natación"],
    distance: 5.1,
    profilePicture: "/images/profile5.jpeg",
  },
  {
    id: "6",
    name: "Martín Acosta",
    age: 29,
    location: "Villa Urquiza, CABA",
    bio: "Jugador de básquet de toda la vida. Busco equipo para jugar los domingos por la mañana o compañeros para entrenar. Nivel intermedio-avanzado, pero abierto a jugar con todos.",
    sports: ["Básquet", "Fútbol", "Running"],
    distance: 6.3,
    profilePicture: "/images/profile3.png",
  },
  {
    id: "7",
    name: "Lucas Giménez",
    age: 24,
    location: "Villa Crespo, CABA",
    bio: "Apasionado del fútbol desde chico. Juego como mediocampista y busco un equipo para partidos semanales. También me gusta el entrenamiento funcional y correr por las mañanas.",
    sports: ["Fútbol", "Funcional", "Running"],
    distance: 3.2,
    profilePicture: "/images/profile1.png",
  },
]

export const mockMatches = [
  {
    id: "1",
    user1Id: "current-user",
    user2Id: "1",
    timestamp: new Date().toISOString(),
  },
  {
    id: "2",
    user1Id: "current-user",
    user2Id: "3",
    timestamp: new Date().toISOString(),
  },
]

export const mockMessages = [
  {
    id: "1",
    matchId: "1",
    senderId: "current-user",
    receiverId: "1",
    content: "Hola! Vi que te gusta jugar al fútbol. ¿Te gustaría jugar este fin de semana?",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true,
  },
  {
    id: "2",
    matchId: "1",
    senderId: "1",
    receiverId: "current-user",
    content: "¡Hola! Sí, me encantaría. ¿Dónde jugaríamos?",
    timestamp: new Date(Date.now() - 3500000).toISOString(),
    read: true,
  },
  {
    id: "3",
    matchId: "1",
    senderId: "current-user",
    receiverId: "1",
    content: "Estaba pensando en las canchas de Palermo, cerca del lago. ¿Te queda bien?",
    timestamp: new Date(Date.now() - 3400000).toISOString(),
    read: true,
  },
  {
    id: "4",
    matchId: "1",
    senderId: "1",
    receiverId: "current-user",
    content: "Perfecto, me queda muy bien. ¿A qué hora?",
    timestamp: new Date(Date.now() - 3300000).toISOString(),
    read: true,
  },
  {
    id: "5",
    matchId: "2",
    senderId: "current-user",
    receiverId: "3",
    content: "Hola Elias! Vi que te gusta el básquet. Yo también juego. ¿Te gustaría entrenar juntos algún día?",
    timestamp: new Date(Date.now() - 2600000).toISOString(),
    read: true,
  },
  {
    id: "6",
    matchId: "2",
    senderId: "3",
    receiverId: "current-user",
    content: "¡Hola! Claro, me encantaría. ¿Dónde sueles entrenar?",
    timestamp: new Date(Date.now() - 2500000).toISOString(),
    read: false,
  },
]
