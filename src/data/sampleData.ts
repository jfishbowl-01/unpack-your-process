import { Tournament, Player, Course, TournamentResults } from '@/types/golf';
import { calculateCourseHandicap, getPlayerClass, calculateSkinForHole, calculateCorners, calculateClassResults, calculateTotalSkins } from '@/utils/golfCalculations';

// Sample Golf Courses
export const sampleCourses: Course[] = [
  {
    id: 'pebble-beach',
    name: 'Pebble Beach Golf Links',
    holes: [
      // Front 9
      { number: 1, par: 4, handicapIndex: 5 },
      { number: 2, par: 5, handicapIndex: 13 },
      { number: 3, par: 4, handicapIndex: 3 },
      { number: 4, par: 4, handicapIndex: 9 },
      { number: 5, par: 3, handicapIndex: 17 },
      { number: 6, par: 5, handicapIndex: 1 },
      { number: 7, par: 3, handicapIndex: 15 },
      { number: 8, par: 4, handicapIndex: 7 },
      { number: 9, par: 4, handicapIndex: 11 },
      // Back 9
      { number: 10, par: 4, handicapIndex: 4 },
      { number: 11, par: 4, handicapIndex: 14 },
      { number: 12, par: 3, handicapIndex: 18 },
      { number: 13, par: 4, handicapIndex: 2 },
      { number: 14, par: 5, handicapIndex: 8 },
      { number: 15, par: 4, handicapIndex: 12 },
      { number: 16, par: 4, handicapIndex: 6 },
      { number: 17, par: 3, handicapIndex: 16 },
      { number: 18, par: 5, handicapIndex: 10 }
    ],
    tees: {
      red: { slope: 116, rating: 70.3 },
      white: { slope: 120, rating: 72.1 },
      blue: { slope: 126, rating: 74.8 },
      yellow: { slope: 122, rating: 73.2 }
    }
  },
  {
    id: 'stonegate-oaks',
    name: 'Stonegate Oaks Golf Club',
    holes: [
      // Front 9
      { number: 1, par: 4, handicapIndex: 7 },
      { number: 2, par: 3, handicapIndex: 15 },
      { number: 3, par: 5, handicapIndex: 1 },
      { number: 4, par: 4, handicapIndex: 11 },
      { number: 5, par: 4, handicapIndex: 5 },
      { number: 6, par: 3, handicapIndex: 17 },
      { number: 7, par: 4, handicapIndex: 9 },
      { number: 8, par: 5, handicapIndex: 3 },
      { number: 9, par: 4, handicapIndex: 13 },
      // Back 9
      { number: 10, par: 4, handicapIndex: 8 },
      { number: 11, par: 3, handicapIndex: 16 },
      { number: 12, par: 4, handicapIndex: 4 },
      { number: 13, par: 5, handicapIndex: 2 },
      { number: 14, par: 4, handicapIndex: 12 },
      { number: 15, par: 3, handicapIndex: 18 },
      { number: 16, par: 4, handicapIndex: 6 },
      { number: 17, par: 4, handicapIndex: 14 },
      { number: 18, par: 5, handicapIndex: 10 }
    ],
    tees: {
      red: { slope: 118, rating: 69.8 },
      white: { slope: 124, rating: 71.9 },
      blue: { slope: 130, rating: 74.2 },
      green: { slope: 135, rating: 76.1 }
    }
  }
];

// Sample Players (Lakeland Golf Members and Guests)
export const samplePlayers: Player[] = [
  // Class A Players (Low Handicaps)
  {
    id: 'player-1',
    name: 'Harry Mitchell', // Tournament organizer
    handicapIndex: 8.5,
    courseHandicap: 10,
    class: 'A',
    teeColor: 'blue',
    isMember: true,
    isPlayingSkins: true,
    isPlayingCorners: true
  },
  {
    id: 'player-2', 
    name: 'Mike Thompson',
    handicapIndex: 6.2,
    courseHandicap: 7,
    class: 'A',
    teeColor: 'blue',
    isMember: true,
    isPlayingSkins: true,
    isPlayingCorners: false
  },
  {
    id: 'player-3',
    name: 'Steve Wilson',
    handicapIndex: 11.8,
    courseHandicap: 14,
    class: 'A',
    teeColor: 'white',
    isMember: true,
    isPlayingSkins: true,
    isPlayingCorners: true
  },
  
  // Class B Players (Mid Handicaps)
  {
    id: 'player-4',
    name: 'Bob Carter',
    handicapIndex: 15.3,
    courseHandicap: 18,
    class: 'B',
    teeColor: 'white',
    isMember: true,
    isPlayingSkins: true,
    isPlayingCorners: true
  },
  {
    id: 'player-5',
    name: 'Jim Davis',
    handicapIndex: 16.7,
    courseHandicap: 19,
    class: 'B',
    teeColor: 'white',
    isMember: true,
    isPlayingSkins: false,
    isPlayingCorners: true
  },
  {
    id: 'player-6',
    name: 'Paul Anderson',
    handicapIndex: 13.9,
    courseHandicap: 16,
    class: 'B',
    teeColor: 'white',
    isMember: false, // Guest
    isPlayingSkins: true,
    isPlayingCorners: false
  },
  
  // Class C Players (Higher Handicaps)
  {
    id: 'player-7',
    name: 'Dave Roberts',
    handicapIndex: 22.1,
    courseHandicap: 25,
    class: 'C',
    teeColor: 'white',
    isMember: true,
    isPlayingSkins: true,
    isPlayingCorners: true
  },
  {
    id: 'player-8',
    name: 'Mark Johnson',
    handicapIndex: 19.4,
    courseHandicap: 22,
    class: 'C',
    teeColor: 'red',
    isMember: true,
    isPlayingSkins: false,
    isPlayingCorners: false
  },
  
  // Senior Players
  {
    id: 'player-9',
    name: 'Frank Miller',
    handicapIndex: 14.6,
    courseHandicap: 17,
    class: 'Senior', // Age takes precedence over handicap for classification
    teeColor: 'red',
    isMember: true,
    isPlayingSkins: true,
    isPlayingCorners: true
  },
  {
    id: 'player-10',
    name: 'George Taylor',
    handicapIndex: 18.2,
    courseHandicap: 21,
    class: 'Senior',
    teeColor: 'red',
    isMember: true,
    isPlayingSkins: true,
    isPlayingCorners: false
  }
];

// Sample Tournament
export const sampleTournament: Tournament = {
  id: 'lakeland-july-4th-2025',
  name: 'Lakeland Golf 4th of July Tournament',
  date: '2025-07-04',
  courseId: 'pebble-beach',
  players: samplePlayers,
  hasSkinsCompetition: true,
  hasCornersCompetition: true,
  isStablefordScoring: false, // Traditional stroke play
  status: 'in_progress'
};

// Sample Tournament Results (with realistic golf scores)
export const sampleResults: TournamentResults = {
  tournamentId: sampleTournament.id,
  classResults: [
    {
      class: 'A',
      players: [
        {
          playerId: 'player-2',
          playerName: 'Mike Thompson',
          isMember: true,
          grossScore: 78,
          netScore: 71,
          toPar: -1,
          position: 1
        },
        {
          playerId: 'player-1',
          playerName: 'Harry Mitchell',
          isMember: true,
          grossScore: 82,
          netScore: 72,
          toPar: 0,
          position: 2
        },
        {
          playerId: 'player-3',
          playerName: 'Steve Wilson',
          isMember: true,
          grossScore: 87,
          netScore: 73,
          toPar: 1,
          position: 3
        }
      ]
    },
    {
      class: 'B',
      players: [
        {
          playerId: 'player-6',
          playerName: 'Paul Anderson',
          isMember: false,
          grossScore: 89,
          netScore: 73,
          toPar: 1,
          position: 1
        },
        {
          playerId: 'player-4',
          playerName: 'Bob Carter',
          isMember: true,
          grossScore: 92,
          netScore: 74,
          toPar: 2,
          position: 2
        },
        {
          playerId: 'player-5',
          playerName: 'Jim Davis',
          isMember: true,
          grossScore: 95,
          netScore: 76,
          toPar: 4,
          position: 3
        }
      ]
    },
    {
      class: 'C',
      players: [
        {
          playerId: 'player-8',
          playerName: 'Mark Johnson',
          isMember: true,
          grossScore: 97,
          netScore: 75,
          toPar: 3,
          position: 1
        },
        {
          playerId: 'player-7',
          playerName: 'Dave Roberts',
          isMember: true,
          grossScore: 102,
          netScore: 77,
          toPar: 5,
          position: 2
        }
      ]
    },
    {
      class: 'Senior',
      players: [
        {
          playerId: 'player-9',
          playerName: 'Frank Miller',
          isMember: true,
          grossScore: 91,
          netScore: 74,
          toPar: 2,
          position: 1
        },
        {
          playerId: 'player-10',
          playerName: 'George Taylor',
          isMember: true,
          grossScore: 96,
          netScore: 75,
          toPar: 3,
          position: 2
        }
      ]
    }
  ],
  skinResults: [
    // Sample skins results showing various scenarios
    { hole: 1, winners: [{ playerId: 'player-2', playerName: 'Mike Thompson', score: 4, skinPoints: 1 }] },
    { hole: 2, winners: [{ playerId: 'player-1', playerName: 'Harry Mitchell', score: 4, skinPoints: 0.5 }, { playerId: 'player-3', playerName: 'Steve Wilson', score: 4, skinPoints: 0.5 }] },
    { hole: 3, winners: [{ playerId: 'player-6', playerName: 'Paul Anderson', score: 3, skinPoints: 1 }] },
    { hole: 4, winners: [{ playerId: 'player-4', playerName: 'Bob Carter', score: 4, skinPoints: 1 }] },
    { hole: 5, winners: [{ playerId: 'player-9', playerName: 'Frank Miller', score: 2, skinPoints: 1 }] },
    { hole: 6, winners: [{ playerId: 'player-7', playerName: 'Dave Roberts', score: 5, skinPoints: 1 }] },
    { hole: 7, winners: [{ playerId: 'player-2', playerName: 'Mike Thompson', score: 2, skinPoints: 1 }] },
    { hole: 8, winners: [{ playerId: 'player-1', playerName: 'Harry Mitchell', score: 4, skinPoints: 1 }] },
    { hole: 9, winners: [{ playerId: 'player-3', playerName: 'Steve Wilson', score: 4, skinPoints: 1 }] },
    { hole: 10, winners: [{ playerId: 'player-6', playerName: 'Paul Anderson', score: 3, skinPoints: 1 }] },
    { hole: 11, winners: [{ playerId: 'player-4', playerName: 'Bob Carter', score: 4, skinPoints: 0.33 }, { playerId: 'player-9', playerName: 'Frank Miller', score: 4, skinPoints: 0.33 }, { playerId: 'player-1', playerName: 'Harry Mitchell', score: 4, skinPoints: 0.33 }] },
    { hole: 12, winners: [{ playerId: 'player-2', playerName: 'Mike Thompson', score: 3, skinPoints: 1 }] },
    { hole: 13, winners: [{ playerId: 'player-7', playerName: 'Dave Roberts', score: 4, skinPoints: 1 }] },
    { hole: 14, winners: [{ playerId: 'player-3', playerName: 'Steve Wilson', score: 5, skinPoints: 1 }] },
    { hole: 15, winners: [{ playerId: 'player-6', playerName: 'Paul Anderson', score: 3, skinPoints: 1 }] },
    { hole: 16, winners: [{ playerId: 'player-1', playerName: 'Harry Mitchell', score: 4, skinPoints: 1 }] },
    { hole: 17, winners: [{ playerId: 'player-9', playerName: 'Frank Miller', score: 3, skinPoints: 1 }] },
    { hole: 18, winners: [{ playerId: 'player-4', playerName: 'Bob Carter', score: 5, skinPoints: 1 }] }
  ],
  cornerResults: [
    {
      cornerNumber: 1,
      holes: [1, 2, 3],
      winners: [{ playerId: 'player-2', playerName: 'Mike Thompson', totalScore: 12, points: 1 }]
    },
    {
      cornerNumber: 2,
      holes: [4, 5, 6],
      winners: [{ playerId: 'player-1', playerName: 'Harry Mitchell', totalScore: 13, points: 1 }]
    },
    {
      cornerNumber: 3,
      holes: [7, 8, 9],
      winners: [{ playerId: 'player-3', playerName: 'Steve Wilson', totalScore: 12, points: 0.5 }, { playerId: 'player-6', playerName: 'Paul Anderson', totalScore: 12, points: 0.5 }]
    },
    {
      cornerNumber: 4,
      holes: [10, 11, 12],
      winners: [{ playerId: 'player-9', playerName: 'Frank Miller', totalScore: 11, points: 1 }]
    },
    {
      cornerNumber: 5,
      holes: [13, 14, 15],
      winners: [{ playerId: 'player-4', playerName: 'Bob Carter', totalScore: 13, points: 1 }]
    },
    {
      cornerNumber: 6,
      holes: [16, 17, 18],
      winners: [{ playerId: 'player-1', playerName: 'Harry Mitchell', totalScore: 14, points: 1 }]
    }
  ],
  lastUpdated: new Date('2025-07-04T16:30:00')
};

// Helper function to get course by ID
export const getCourseById = (courseId: string): Course | undefined => {
  return sampleCourses.find(course => course.id === courseId);
};