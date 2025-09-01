import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TournamentResults as ResultsType, ClassResults, SkinResult, CornerResult } from '@/types/golf';
import { Trophy, Medal, Star, Target } from 'lucide-react';

interface TournamentResultsProps {
  results: ResultsType;
  tournamentName: string;
  onBack: () => void;
}

const TournamentResults: React.FC<TournamentResultsProps> = ({
  results,
  tournamentName,
  onBack
}) => {
  const [selectedTab, setSelectedTab] = useState<'class' | 'skins' | 'corners'>('class');

  const formatToPar = (toPar: number): string => {
    if (toPar === 0) return 'E';
    return toPar > 0 ? `+${toPar}` : `${toPar}`;
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2: return <Medal className="h-4 w-4 text-gray-400" />;
      case 3: return <Medal className="h-4 w-4 text-amber-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <Card className="bg-gradient-golf text-white shadow-golf">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
            <Trophy className="h-8 w-8" />
            {tournamentName} Results
          </CardTitle>
          <div className="text-sm opacity-90">
            Final results • Last updated: {results.lastUpdated.toLocaleString()}
          </div>
        </CardHeader>
      </Card>

      {/* Navigation & Back Button */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack}>
          ← Back to Dashboard
        </Button>
        
        <div className="flex space-x-2">
          <Button
            variant={selectedTab === 'class' ? 'golf' : 'outline'}
            onClick={() => setSelectedTab('class')}
          >
            Class Results
          </Button>
          {results.skinResults.length > 0 && (
            <Button
              variant={selectedTab === 'skins' ? 'golf' : 'outline'}
              onClick={() => setSelectedTab('skins')}
            >
              Skins
            </Button>
          )}
          {results.cornerResults && results.cornerResults.length > 0 && (
            <Button
              variant={selectedTab === 'corners' ? 'golf' : 'outline'}
              onClick={() => setSelectedTab('corners')}
            >
              Corners
            </Button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {selectedTab === 'class' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {results.classResults.map((classResult) => (
            <Card key={classResult.class} className="shadow-golf-card">
              <CardHeader>
                <CardTitle className="text-center text-golf-green-dark">
                  Class {classResult.class} Results
                  <Badge variant="outline" className="ml-2">
                    {classResult.players.length} players
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {classResult.players.length > 0 ? (
                    classResult.players.map((player, index) => (
                      <div 
                        key={player.playerId} 
                        className={`bg-gradient-fairway rounded-lg p-3 ${
                          player.position <= 2 ? 'ring-2 ring-golf-green/50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getPositionIcon(player.position)}
                            <div>
                              <div className="font-bold text-golf-green-dark flex items-center gap-2">
                                {player.playerName}
                                {player.isMember && (
                                  <Badge variant="secondary" className="text-xs">Member</Badge>
                                )}
                              </div>
                              <div className="text-xs text-golf-earth">
                                Position: {player.position}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg text-golf-green">
                              {player.netScore}
                            </div>
                            <div className="text-sm text-golf-earth">
                              ({player.grossScore} gross)
                            </div>
                            <div className={`text-sm font-medium ${
                              player.toPar < 0 ? 'text-golf-green' :
                              player.toPar > 0 ? 'text-red-600' : 'text-golf-green-dark'
                            }`}>
                              {formatToPar(player.toPar)}
                            </div>
                          </div>
                        </div>
                        
                        {player.position === 1 && (
                          <div className="mt-2 p-2 bg-golf-green/10 rounded text-center">
                            <Star className="h-4 w-4 text-golf-green inline mr-1" />
                            <span className="text-sm font-medium text-golf-green">
                              Class {classResult.class} Winner!
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-golf-earth py-4">No players in this class</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedTab === 'skins' && (
        <div className="space-y-6">
          {/* Skins Summary */}
          <Card className="shadow-golf-card">
            <CardHeader>
              <CardTitle className="text-golf-green-dark">Skins Competition Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                // Calculate total skins per player
                const skinTotals: { [playerId: string]: { name: string; total: number } } = {};
                
                results.skinResults.forEach(skinResult => {
                  skinResult.winners.forEach(winner => {
                    if (!skinTotals[winner.playerId]) {
                      skinTotals[winner.playerId] = { name: winner.playerName, total: 0 };
                    }
                    skinTotals[winner.playerId].total += winner.skinPoints;
                  });
                });
                
                const sortedSkins = Object.entries(skinTotals)
                  .map(([playerId, data]) => ({ playerId, ...data }))
                  .sort((a, b) => b.total - a.total);
                
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {sortedSkins.map((player, index) => (
                      <div 
                        key={player.playerId}
                        className={`bg-gradient-fairway rounded-lg p-3 ${
                          index === 0 ? 'ring-2 ring-golf-green' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {index === 0 && <Trophy className="h-4 w-4 text-gold-500" />}
                            <span className="font-medium">{player.name}</span>
                          </div>
                          <Badge className="bg-golf-green text-white">
                            {player.total} skins
                          </Badge>
                        </div>
                        {index === 0 && (
                          <div className="mt-2 text-xs text-golf-green font-medium">
                            🏆 Skins Champion!
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Hole-by-Hole Skins */}
          <Card className="shadow-golf-card">
            <CardHeader>
              <CardTitle className="text-golf-green-dark">Hole-by-Hole Skins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.skinResults.map((skinResult) => (
                  <div key={skinResult.hole} className="bg-gradient-fairway rounded-lg p-3">
                    <div className="text-center font-bold text-golf-green-dark mb-2">
                      Hole {skinResult.hole}
                    </div>
                    {skinResult.winners.length > 0 ? (
                      skinResult.winners.map((winner) => (
                        <div key={winner.playerId} className="text-center">
                          <div className="font-medium text-sm">{winner.playerName}</div>
                          <div className="text-xs text-golf-earth">
                            Score: {winner.score} • Points: {winner.skinPoints}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-xs text-golf-earth">
                        No winner (push)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === 'corners' && results.cornerResults && (
        <div className="space-y-6">
          <Card className="shadow-golf-card">
            <CardHeader>
              <CardTitle className="text-golf-green-dark flex items-center gap-2">
                <Target className="h-5 w-5" />
                Corners Competition Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.cornerResults.map((cornerResult) => (
                  <Card key={cornerResult.cornerNumber} className="bg-gradient-fairway">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-center text-golf-green-dark text-sm">
                        Corner {cornerResult.cornerNumber}
                        <div className="text-xs text-golf-earth font-normal">
                          Holes {cornerResult.holes.join('-')}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {cornerResult.winners.map((winner) => (
                        <div key={winner.playerId} className="text-center space-y-1">
                          <div className="font-medium text-sm">{winner.playerName}</div>
                          <div className="text-xs text-golf-earth">
                            Score: {winner.totalScore} • Points: {winner.points}
                          </div>
                          <Badge className="bg-golf-green text-white text-xs">
                            Winner
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TournamentResults;