import React, { useState } from 'react';
import GolfScorecard from '@/components/GolfScorecard';
import TournamentDashboard from '@/components/TournamentDashboard';
import TournamentResults from '@/components/TournamentResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { sampleTournament, samplePlayers, sampleCourses, sampleResults, getCourseById } from '@/data/sampleData';
import { Player } from '@/types/golf';

type AppView = 'welcome' | 'dashboard' | 'scorecard' | 'results';

const Index = () => {
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  
  const course = getCourseById(sampleTournament.courseId);
  
  if (!course) {
    return <div>Course not found</div>;
  }

  const handleScoreUpdate = (playerId: string, hole: number, score: number) => {
    console.log(`Player ${playerId} scored ${score} on hole ${hole}`);
    // In a real app, this would update the backend/state
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'welcome':
        return (
          <>
            <title>Lakeland Golf Tournament Manager - Professional Golf Tournament Management</title>
            <meta name="description" content="Complete golf tournament management system with handicap calculations, skins competitions, corners games, and real-time scoring. Perfect for golf clubs and tournament organizers." />
            
            <main className="min-h-screen">
              {/* Hero Section */}
              <header className="text-center py-12">
                <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm shadow-golf-card border-golf-green/30">
                  <CardHeader>
                    <CardTitle className="text-5xl font-bold text-golf-green-dark mb-4">
                      🏌️ Lakeland Golf Tournament Manager
                    </CardTitle>
                    <p className="text-golf-earth text-xl mb-6">
                      Complete tournament management system with advanced scoring, handicap calculations, 
                      and special competitions
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-gradient-fairway p-4 rounded-lg">
                        <h3 className="font-bold text-golf-green-dark mb-2">🏆 Class-Based Competition</h3>
                        <p className="text-golf-earth">Automatic player classification by handicap with separate winners for Classes A, B, C, and Senior divisions</p>
                      </div>
                      <div className="bg-gradient-fairway p-4 rounded-lg">
                        <h3 className="font-bold text-golf-green-dark mb-2">🎯 Special Competitions</h3>
                        <p className="text-golf-earth">Skins game with automatic tie handling and Corners competition across 6 three-hole segments</p>
                      </div>
                      <div className="bg-gradient-fairway p-4 rounded-lg">
                        <h3 className="font-bold text-golf-green-dark mb-2">📱 Real-Time Scoring</h3>
                        <p className="text-golf-earth">Live leaderboards, instant handicap calculations, and mobile-friendly digital scorecards</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="golf" 
                      size="lg"
                      onClick={() => setCurrentView('dashboard')}
                      className="text-xl px-8 py-3"
                    >
                      🏌️ Enter Tournament Manager
                    </Button>
                    
                    <div className="mt-8 p-6 bg-golf-green/5 rounded-lg border border-golf-green/20">
                      <h3 className="font-bold text-golf-green-dark mb-3">🎮 Demo Features Available:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>✅ Live tournament dashboard with 10 sample players</div>
                        <div>✅ Class A, B, C, and Senior divisions</div>
                        <div>✅ 18-hole skins competition with tie handling</div>
                        <div>✅ 6-corner competition (3-hole segments)</div>
                        <div>✅ Digital scorecard with handicap calculations</div>
                        <div>✅ Complete tournament results and leaderboards</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </header>

              {/* Feature Showcase */}
              <section className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="shadow-golf-card">
                    <CardHeader>
                      <CardTitle className="text-golf-green-dark">📊 From Excel VBA to Mobile App</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <p className="text-golf-earth">
                        This system recreates the sophisticated tournament management originally built in Excel VBA, 
                        now modernized as a web application with mobile-friendly features.
                      </p>
                      <div className="space-y-2">
                        <div><strong>✓ Player Management:</strong> Handicap tracking and classification</div>
                        <div><strong>✓ Course Database:</strong> Multiple tee positions and slope ratings</div>
                        <div><strong>✓ Advanced Scoring:</strong> Net/gross calculations with proper stroke allocation</div>
                        <div><strong>✓ Competition Logic:</strong> Complex skins and corners algorithms</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-golf-card">
                    <CardHeader>
                      <CardTitle className="text-golf-green-dark">🎯 Built for Golf Enthusiasts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <p className="text-golf-earth">
                        Designed specifically for serious recreational golfers who want accurate, 
                        fair competition with minimal administrative overhead.
                      </p>
                      <div className="space-y-2">
                        <div><strong>✓ Member vs Guest:</strong> Track club membership status</div>
                        <div><strong>✓ Flexible Tees:</strong> Different tee selections per player</div>
                        <div><strong>✓ Smart Handicapping:</strong> Course handicap calculation from index</div>
                        <div><strong>✓ Fair Competition:</strong> Separate results by skill level</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </main>
          </>
        );
        
      case 'dashboard':
        return (
          <TournamentDashboard
            tournament={sampleTournament}
            course={course}
            onStartScoring={() => setCurrentView('scorecard')}
            onViewResults={() => setCurrentView('results')}
            onManageSettings={() => {
              // Would open settings in real app
              console.log('Opening tournament settings...');
            }}
          />
        );
        
      case 'scorecard':
        return (
          <div className="space-y-6">
            {!selectedPlayer && (
              <Card className="max-w-2xl mx-auto shadow-golf-card">
                <CardHeader>
                  <CardTitle className="text-center text-golf-green-dark">
                    Select Player to Enter Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sampleTournament.players.map(player => (
                      <Button
                        key={player.id}
                        variant="outline"
                        onClick={() => setSelectedPlayer(player)}
                        className="p-4 h-auto flex flex-col items-start"
                      >
                        <div className="font-bold">{player.name}</div>
                        <div className="text-xs text-left">
                          Class {player.class} • HCP: {player.handicapIndex} • {player.teeColor} tees
                        </div>
                      </Button>
                    ))}
                  </div>
                  <Button 
                    variant="secondary" 
                    onClick={() => setCurrentView('dashboard')}
                    className="w-full mt-4"
                  >
                    ← Back to Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {selectedPlayer && (
              <div>
                <div className="flex justify-center mb-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedPlayer(null)}
                  >
                    ← Choose Different Player
                  </Button>
                </div>
                <GolfScorecard
                  player={selectedPlayer}
                  course={course}
                  tournament={sampleTournament}
                  onScoreUpdate={handleScoreUpdate}
                />
              </div>
            )}
          </div>
        );
        
      case 'results':
        return (
          <TournamentResults
            results={sampleResults}
            tournamentName={sampleTournament.name}
            onBack={() => setCurrentView('dashboard')}
          />
        );
        
      default:
        return null;
    }
  };

  return renderCurrentView();
};

export default Index;
