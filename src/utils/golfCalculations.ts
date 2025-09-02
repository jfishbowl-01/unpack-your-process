import { Player, Course, HoleScore, SkinResult, CornerResult, ClassResults } from '@/types/golf';

// Calculate course handicap from handicap index
export const calculateCourseHandicap = (handicapIndex: number, slopeRating: number, courseRating: number = 72): number => {
  return Math.round(handicapIndex * (slopeRating / 113));
};

// Determine player classification based on handicap
export const getPlayerClass = (handicapIndex: number, age?: number): 'A' | 'B' | 'C' | 'Senior' => {
  if (age && age >= 65) return 'Senior'; // Senior category takes precedence
  if (handicapIndex <= 12) return 'A';
  if (handicapIndex <= 18) return 'B';
  return 'C';
};

// Check if player gets a handicap stroke on specific hole
export const playerGetsStroke = (courseHandicap: number, holeHandicapIndex: number): boolean => {
  return courseHandicap >= holeHandicapIndex;
};

// Calculate Stableford points for a hole
export const calculateStablefordPoints = (grossScore: number, par: number, playerGetsStroke: boolean): number => {
  const effectiveScore = grossScore - (playerGetsStroke ? 1 : 0);
  const scoreToPar = effectiveScore - par;
  
  if (scoreToPar <= -2) return 4; // Eagle or better
  if (scoreToPar === -1) return 3; // Birdie
  if (scoreToPar === 0) return 2;  // Par
  if (scoreToPar === 1) return 1;  // Bogey
  return 0; // Double bogey or worse
};

// Calculate skins for a specific hole
export const calculateSkinForHole = (
  holeNumber: number, 
  allPlayerScores: Array<{ playerId: string; playerName: string; score: number | null; isPlayingSkins: boolean }>
): SkinResult => {
  // Filter players playing skins with valid scores
  const playersInSkins = allPlayerScores.filter(p => p.isPlayingSkins && p.score !== null);
  
  if (playersInSkins.length === 0) {
    return {
      hole: holeNumber,
      winners: []
    };
  }
  
  // Find minimum score
  const minScore = Math.min(...playersInSkins.map(p => p.score!));
  
  // Find all players with minimum score
  const winnersThisHole = playersInSkins.filter(p => p.score === minScore);
  
  // Calculate skin points (1 divided by number of winners)
  const skinPoints = winnersThisHole.length > 1 ? 1 / winnersThisHole.length : 1;
  
  return {
    hole: holeNumber,
    winners: winnersThisHole.map(winner => ({
      playerId: winner.playerId,
      playerName: winner.playerName,
      score: winner.score!,
      skinPoints
    }))
  };
};

// Calculate corners competition (3 consecutive holes) - Enhanced version based on VBA logic
export const calculateCorners = (
  allPlayerScores: Array<{ 
    playerId: string; 
    playerName: string; 
    scores: (number | null)[]; 
    isPlayingCorners: boolean 
  }>
): CornerResult[] => {
  const corners: CornerResult[] = [];
  
  // Define corners: holes 1-3, 4-6, 7-9, 10-12, 13-15, 16-18
  const cornerGroups = [
    [1, 2, 3],
    [4, 5, 6], 
    [7, 8, 9],
    [10, 11, 12],
    [13, 14, 15],
    [16, 17, 18]
  ];
  
  cornerGroups.forEach((holes, cornerIndex) => {
    const playersInCorners = allPlayerScores.filter(p => p.isPlayingCorners);
    const cornerResults: Array<{ playerId: string; playerName: string; totalScore: number }> = [];
    
    playersInCorners.forEach(player => {
      const holeScores = holes.map(hole => player.scores[hole - 1]).filter(score => score !== null);
      
      // Only include if all three holes have scores
      if (holeScores.length === 3) {
        const totalScore = holeScores.reduce((sum, score) => sum + score!, 0);
        cornerResults.push({
          playerId: player.playerId,
          playerName: player.playerName,
          totalScore
        });
      }
    });
    
    if (cornerResults.length > 0) {
      // Find minimum total score for this corner
      const minTotal = Math.min(...cornerResults.map(r => r.totalScore));
      const winnersThisCorner = cornerResults.filter(r => r.totalScore === minTotal);
      
      // Enhanced points calculation based on VBA logic
      // If more than 2 winners, points may be reduced or eliminated based on tournament rules
      let points: number;
      if (winnersThisCorner.length === 1) {
        points = 1; // Single winner gets full point
      } else if (winnersThisCorner.length === 2) {
        points = 0.5; // Two winners split the point
      } else {
        // More than 2 winners - split equally (can be adjusted based on tournament rules)
        points = 1 / winnersThisCorner.length;
      }
      
      corners.push({
        cornerNumber: cornerIndex + 1,
        holes,
        winners: winnersThisCorner.map(winner => ({
          ...winner,
          points
        }))
      });
    }
  });
  
  return corners;
};

// Calculate consolidated corners results (based on VBA FINAL_SKIN_WINNER logic)
export const calculateConsolidatedCorners = (cornerResults: CornerResult[]): Array<{ playerId: string; playerName: string; totalPoints: number }> => {
  const playerPoints: { [playerId: string]: { playerName: string; totalPoints: number } } = {};
  
  cornerResults.forEach(corner => {
    corner.winners.forEach(winner => {
      if (!playerPoints[winner.playerId]) {
        playerPoints[winner.playerId] = {
          playerName: winner.playerName,
          totalPoints: 0
        };
      }
      playerPoints[winner.playerId].totalPoints += winner.points;
    });
  });
  
  return Object.entries(playerPoints)
    .map(([playerId, data]) => ({
      playerId,
      playerName: data.playerName,
      totalPoints: Math.round(data.totalPoints * 100) / 100 // Round to 2 decimal places
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints); // Sort by total points descending
};

// Calculate class-based results
export const calculateClassResults = (
  players: Player[],
  playerScores: Array<{ playerId: string; grossScore: number; netScore: number; toPar: number }>
): ClassResults[] => {
  const classes: ('A' | 'B' | 'C' | 'Senior')[] = ['A', 'B', 'C', 'Senior'];
  
  return classes.map(playerClass => {
    const playersInClass = players.filter(p => p.class === playerClass);
    const classScores = playersInClass.map(player => {
      const scores = playerScores.find(ps => ps.playerId === player.id);
      return {
        playerId: player.id,
        playerName: player.name,
        isMember: player.isMember,
        grossScore: scores?.grossScore || 0,
        netScore: scores?.netScore || 0,
        toPar: scores?.toPar || 0,
        position: 0 // Will be calculated below
      };
    }).filter(p => p.netScore > 0); // Only include players with valid scores
    
    // Sort by net score (lowest first)
    classScores.sort((a, b) => a.netScore - b.netScore);
    
    // Assign positions (handle ties)
    let currentPosition = 1;
    for (let i = 0; i < classScores.length; i++) {
      if (i > 0 && classScores[i].netScore > classScores[i - 1].netScore) {
        currentPosition = i + 1;
      }
      classScores[i].position = currentPosition;
    }
    
    return {
      class: playerClass,
      players: classScores
    };
  }).filter(classResult => classResult.players.length > 0); // Only return classes with players
};

// Calculate total skins won by each player
export const calculateTotalSkins = (skinResults: SkinResult[]): Array<{ playerId: string; playerName: string; totalSkins: number }> => {
  const playerSkins: { [playerId: string]: { playerName: string; totalSkins: number } } = {};
  
  skinResults.forEach(skinResult => {
    skinResult.winners.forEach(winner => {
      if (!playerSkins[winner.playerId]) {
        playerSkins[winner.playerId] = {
          playerName: winner.playerName,
          totalSkins: 0
        };
      }
      playerSkins[winner.playerId].totalSkins += winner.skinPoints;
    });
  });
  
  return Object.entries(playerSkins)
    .map(([playerId, data]) => ({
      playerId,
      playerName: data.playerName,
      totalSkins: Math.round(data.totalSkins * 100) / 100 // Round to 2 decimal places
    }))
    .sort((a, b) => b.totalSkins - a.totalSkins); // Sort by total skins descending
};

// Enhanced class results with member recognition (based on VBA COMMUNITY_POT logic)
export const calculateEnhancedClassResults = (
  players: Player[],
  playerScores: Array<{ playerId: string; grossScore: number; netScore: number; toPar: number }>
): ClassResults[] => {
  const classes: ('A' | 'B' | 'C' | 'Senior')[] = ['A', 'B', 'C', 'Senior'];
  
  return classes.map(playerClass => {
    const playersInClass = players.filter(p => p.class === playerClass);
    const classScores = playersInClass.map(player => {
      const scores = playerScores.find(ps => ps.playerId === player.id);
      return {
        playerId: player.id,
        playerName: player.name,
        isMember: player.isMember,
        grossScore: scores?.grossScore || 0,
        netScore: scores?.netScore || 0,
        toPar: scores?.toPar || 0,
        position: 0 // Will be calculated below
      };
    }).filter(p => p.netScore > 0); // Only include players with valid scores
    
    // Sort by net score (lowest first) - same as VBA sorting logic
    classScores.sort((a, b) => {
      if (a.netScore !== b.netScore) {
        return a.netScore - b.netScore;
      }
      // Tie-breaker: gross score if net scores are equal
      return a.grossScore - b.grossScore;
    });
    
    // Assign positions (handle ties) - enhanced tie handling
    let currentPosition = 1;
    for (let i = 0; i < classScores.length; i++) {
      if (i > 0 && classScores[i].netScore > classScores[i - 1].netScore) {
        currentPosition = i + 1;
      }
      classScores[i].position = currentPosition;
    }
    
    return {
      class: playerClass,
      players: classScores
    };
  }).filter(classResult => classResult.players.length > 0); // Only return classes with players
};

// Generate winner announcements (based on VBA MsgBox logic)
export const generateWinnerAnnouncements = (classResults: ClassResults[]): Array<{ class: string; message: string }> => {
  return classResults.map(classResult => {
    const { class: playerClass, players } = classResult;
    const playerCount = players.length;
    
    if (players.length === 0) {
      return { class: playerClass, message: `No players in Class ${playerClass}` };
    }
    
    const firstPlace = players[0];
    const secondPlace = players[1];
    
    let message = `CLASS ${playerClass} = ${playerCount} players.\n\n`;
    
    // First place winner
    const firstPlaceMembership = firstPlace.isMember ? "AND IS CLUB MEMBER" : "BUT IS NOT CLUB MEMBER";
    message += `First Place winner is ${firstPlace.playerName} ${firstPlaceMembership}\n`;
    message += `GROSS SCORE = ${firstPlace.grossScore} and NET SCORE = ${firstPlace.netScore}\n\n`;
    
    // Second place winner (if exists)
    if (secondPlace) {
      const secondPlaceMembership = secondPlace.isMember ? "AND IS CLUB MEMBER" : "BUT IS NOT CLUB MEMBER";
      message += `Second Place winner is ${secondPlace.playerName} ${secondPlaceMembership}\n`;
      message += `GROSS SCORE = ${secondPlace.grossScore} and NET SCORE = ${secondPlace.netScore}\n\n`;
    }
    
    // Add tie-breaker information if first two have same net score
    if (secondPlace && firstPlace.netScore === secondPlace.netScore) {
      message += `TIE BREAKER => Decided by gross score\n`;
    }
    
    return { class: playerClass, message };
  });
};

// Tournament data management utilities (based on VBA data management functions)
export const validateTournamentData = (tournament: any): Array<{ field: string; message: string }> => {
  const errors: Array<{ field: string; message: string }> = [];
  
  if (!tournament.name || tournament.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Tournament name is required' });
  }
  
  if (!tournament.date) {
    errors.push({ field: 'date', message: 'Tournament date is required' });
  }
  
  if (!tournament.courseId) {
    errors.push({ field: 'courseId', message: 'Golf course selection is required' });
  }
  
  if (!tournament.players || tournament.players.length === 0) {
    errors.push({ field: 'players', message: 'At least one player is required' });
  }
  
  // Validate skins participants if skins competition is enabled
  if (tournament.hasSkinsCompetition) {
    const skinsPlayers = tournament.players?.filter((p: any) => p.isPlayingSkins) || [];
    if (skinsPlayers.length < 2) {
      errors.push({ field: 'skins', message: 'At least 2 players needed for skins competition' });
    }
  }
  
  // Validate corners participants if corners competition is enabled
  if (tournament.hasCornersCompetition) {
    const cornersPlayers = tournament.players?.filter((p: any) => p.isPlayingCorners) || [];
    if (cornersPlayers.length < 2) {
      errors.push({ field: 'corners', message: 'At least 2 players needed for corners competition' });
    }
  }
  
  return errors;
};

// Sort players alphabetically (based on VBA SORTING_PLAYERS)
export const sortPlayersAlphabetically = (players: Player[]): Player[] => {
  return [...players].sort((a, b) => a.name.localeCompare(b.name));
};

// Calculate tournament statistics
export const calculateTournamentStats = (tournament: any, results: any) => {
  const totalPlayers = tournament.players?.length || 0;
  const classACounts = tournament.players?.filter((p: any) => p.class === 'A').length || 0;
  const classBCounts = tournament.players?.filter((p: any) => p.class === 'B').length || 0;
  const classCCounts = tournament.players?.filter((p: any) => p.class === 'C').length || 0;
  const seniorCounts = tournament.players?.filter((p: any) => p.class === 'Senior').length || 0;
  const memberCount = tournament.players?.filter((p: any) => p.isMember).length || 0;
  const guestCount = totalPlayers - memberCount;
  const skinsPlayers = tournament.players?.filter((p: any) => p.isPlayingSkins).length || 0;
  const cornersPlayers = tournament.players?.filter((p: any) => p.isPlayingCorners).length || 0;
  
  return {
    totalPlayers,
    classBreakdown: {
      A: classACounts,
      B: classBCounts, 
      C: classCCounts,
      Senior: seniorCounts
    },
    memberBreakdown: {
      members: memberCount,
      guests: guestCount
    },
    competitionParticipation: {
      skins: skinsPlayers,
      corners: cornersPlayers
    }
  };
};