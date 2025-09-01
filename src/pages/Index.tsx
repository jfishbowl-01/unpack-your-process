import React from 'react';
import GolfScorecard from '@/components/GolfScorecard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Sample data for demonstration
const samplePlayer = {
  id: "player-1",
  name: "John Smith",
  handicapIndex: 12,
  courseHandicap: 14,
  class: "A",
  teeColor: "Blue",
  isPlayingSkins: true
};

const sampleCourse = {
  name: "Pebble Beach Golf Links",
  holes: [
    // Front 9
    { par: 4, handicapIndex: 5 },
    { par: 5, handicapIndex: 13 },
    { par: 4, handicapIndex: 3 },
    { par: 4, handicapIndex: 9 },
    { par: 3, handicapIndex: 17 },
    { par: 5, handicapIndex: 1 },
    { par: 3, handicapIndex: 15 },
    { par: 4, handicapIndex: 7 },
    { par: 4, handicapIndex: 11 },
    // Back 9
    { par: 4, handicapIndex: 4 },
    { par: 4, handicapIndex: 14 },
    { par: 3, handicapIndex: 18 },
    { par: 4, handicapIndex: 2 },
    { par: 5, handicapIndex: 8 },
    { par: 4, handicapIndex: 12 },
    { par: 4, handicapIndex: 6 },
    { par: 3, handicapIndex: 16 },
    { par: 5, handicapIndex: 10 }
  ]
};

const sampleTournament = {
  hasSkinsCompetition: true
};

const Index = () => {
  const handleScoreUpdate = (playerId: string, hole: number, score: number) => {
    console.log(`Player ${playerId} scored ${score} on hole ${hole}`);
  };

  return (
    <>
      <title>Digital Golf Scorecard - Track Your Round</title>
      <meta name="description" content="Professional digital golf scorecard with handicap calculations, scoring history, and tournament features. Perfect for serious golfers." />
      
      <main className="min-h-screen">
        <header className="text-center py-8">
          <Card className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm shadow-golf-card border-golf-green/30">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-golf-green-dark mb-2">
                ⛳ Digital Golf Scorecard
              </CardTitle>
              <p className="text-golf-earth text-lg">
                Professional scoring with automatic handicap calculations
              </p>
            </CardHeader>
          </Card>
        </header>

        <GolfScorecard
          player={samplePlayer}
          course={sampleCourse}
          tournament={sampleTournament}
          onScoreUpdate={handleScoreUpdate}
        />
      </main>
    </>
  );
};

export default Index;
