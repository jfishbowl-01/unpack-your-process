import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tournament, Player, Course } from '@/types/golf';
import { Trophy, Users, MapPin, Calendar, Settings } from 'lucide-react';

interface TournamentDashboardProps {
  tournament: Tournament;
  course: Course;
  onStartScoring: () => void;
  onViewResults: () => void;
  onManageSettings: () => void;
}

const TournamentDashboard: React.FC<TournamentDashboardProps> = ({
  tournament,
  course,
  onStartScoring,
  onViewResults,
  onManageSettings
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'players' | 'competitions'>('overview');
  
  const playersByClass = {
    A: tournament.players.filter(p => p.class === 'A'),
    B: tournament.players.filter(p => p.class === 'B'), 
    C: tournament.players.filter(p => p.class === 'C'),
    Senior: tournament.players.filter(p => p.class === 'Senior')
  };

  const skinsParticipants = tournament.players.filter(p => p.isPlayingSkins);
  const cornersParticipants = tournament.players.filter(p => p.isPlayingCorners);

  return (
    <div className="space-y-6">
      {/* Tournament Header */}
      <Card className="bg-gradient-golf text-white shadow-golf">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
            <Trophy className="h-8 w-8" />
            {tournament.name}
          </CardTitle>
          <div className="flex items-center justify-center gap-4 text-sm opacity-90">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(tournament.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {course.name}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {tournament.players.length} Players
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex justify-center space-x-2">
        {(['overview', 'players', 'competitions'] as const).map((tab) => (
          <Button
            key={tab}
            variant={selectedTab === tab ? 'golf' : 'outline'}
            onClick={() => setSelectedTab(tab)}
            className="capitalize"
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-golf-card">
            <CardHeader>
              <CardTitle className="text-golf-green-dark">Tournament Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge 
                className={`w-full justify-center py-2 text-sm ${
                  tournament.status === 'setup' ? 'bg-golf-sand text-golf-earth' :
                  tournament.status === 'in_progress' ? 'bg-golf-green text-white' :
                  'bg-golf-green-dark text-white'
                }`}
              >
                {tournament.status === 'setup' ? '🔧 Setup Phase' :
                 tournament.status === 'in_progress' ? '⏳ In Progress' :
                 '✅ Completed'}
              </Badge>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-golf-earth">Scoring Format:</span>
                  <span className="font-medium">{tournament.isStablefordScoring ? 'Stableford' : 'Stroke Play'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-golf-earth">Skins Game:</span>
                  <span className="font-medium">{tournament.hasSkinsCompetition ? '✅ Yes' : '❌ No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-golf-earth">Corners:</span>
                  <span className="font-medium">{tournament.hasCornersCompetition ? '✅ Yes' : '❌ No'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-golf-card">
            <CardHeader>
              <CardTitle className="text-golf-green-dark">Course Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-golf-earth">Front 9 Par:</span>
                  <span className="font-medium">{course.holes.slice(0, 9).reduce((sum, hole) => sum + hole.par, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-golf-earth">Back 9 Par:</span>
                  <span className="font-medium">{course.holes.slice(9, 18).reduce((sum, hole) => sum + hole.par, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-golf-earth">Total Par:</span>
                  <span className="font-bold text-golf-green">{course.holes.reduce((sum, hole) => sum + hole.par, 0)}</span>
                </div>
                <div className="mt-4">
                  <span className="text-golf-earth text-xs">Available Tees:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.keys(course.tees).map(tee => (
                      <Badge key={tee} variant="outline" className="text-xs capitalize">
                        {tee}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-golf-card">
            <CardHeader>
              <CardTitle className="text-golf-green-dark">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="golf" 
                onClick={onStartScoring}
                className="w-full"
                disabled={tournament.status === 'completed'}
              >
                {tournament.status === 'setup' ? '🏌️ Start Tournament' : '📱 Enter Scores'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onViewResults}
                className="w-full"
                disabled={tournament.status === 'setup'}
              >
                📊 View Results
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={onManageSettings}
                className="w-full flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === 'players' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['A', 'B', 'C', 'Senior'] as const).map((className) => (
            <Card key={className} className="shadow-golf-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-center text-golf-green-dark">
                  Class {className}
                  <Badge variant="outline" className="ml-2">
                    {playersByClass[className].length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {playersByClass[className].length > 0 ? (
                    playersByClass[className].map(player => (
                      <div key={player.id} className="bg-gradient-fairway rounded p-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{player.name}</span>
                          {player.isMember && (
                            <Badge variant="secondary" className="text-xs">Member</Badge>
                          )}
                        </div>
                        <div className="text-xs text-golf-earth mt-1">
                          HCP: {player.handicapIndex} | Course: {player.courseHandicap} | {player.teeColor} tees
                        </div>
                        <div className="flex gap-1 mt-1">
                          {player.isPlayingSkins && (
                            <Badge className="text-xs bg-golf-green/20 text-golf-green">Skins</Badge>
                          )}
                          {player.isPlayingCorners && (
                            <Badge className="text-xs bg-golf-fairway/20 text-golf-earth">Corners</Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-golf-earth text-sm py-4">No players in this class</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedTab === 'competitions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-golf-card">
            <CardHeader>
              <CardTitle className="text-golf-green-dark flex items-center gap-2">
                🏆 Skins Competition
                {tournament.hasSkinsCompetition ? (
                  <Badge className="bg-golf-green text-white">Active</Badge>
                ) : (
                  <Badge variant="outline">Inactive</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tournament.hasSkinsCompetition ? (
                <div>
                  <p className="text-sm text-golf-earth mb-3">
                    {skinsParticipants.length} players competing for individual hole wins.
                    Each hole's lowest score wins a "skin" point.
                  </p>
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">Participants:</h4>
                    <div className="flex flex-wrap gap-1">
                      {skinsParticipants.map(player => (
                        <Badge key={player.id} variant="outline" className="text-xs">
                          {player.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-golf-earth">Skins competition is not enabled for this tournament.</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-golf-card">
            <CardHeader>
              <CardTitle className="text-golf-green-dark flex items-center gap-2">
                🎯 Corners Competition
                {tournament.hasCornersCompetition ? (
                  <Badge className="bg-golf-green text-white">Active</Badge>
                ) : (
                  <Badge variant="outline">Inactive</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tournament.hasCornersCompetition ? (
                <div>
                  <p className="text-sm text-golf-earth mb-3">
                    {cornersParticipants.length} players competing on 6 corners (3-hole segments).
                    Lowest combined score on each corner wins points.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Corner Groups:</h4>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div>Corner 1: Holes 1-3</div>
                      <div>Corner 2: Holes 4-6</div>
                      <div>Corner 3: Holes 7-9</div>
                      <div>Corner 4: Holes 10-12</div>
                      <div>Corner 5: Holes 13-15</div>
                      <div>Corner 6: Holes 16-18</div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-golf-earth">Corners competition is not enabled for this tournament.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TournamentDashboard;