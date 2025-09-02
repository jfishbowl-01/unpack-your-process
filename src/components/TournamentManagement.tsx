import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Trophy, Users, Calculator, Trash2, RotateCcw, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  validateTournamentData, 
  generateWinnerAnnouncements, 
  calculateTournamentStats,
  sortPlayersAlphabetically,
  calculateConsolidatedCorners,
  calculateTotalSkins
} from '@/utils/golfCalculations';
import { Tournament, TournamentResults, ClassResults } from '@/types/golf';

interface TournamentManagementProps {
  tournament: Tournament;
  results?: TournamentResults;
  onClearData?: () => void;
  onResetTournament?: () => void;
  onExportResults?: () => void;
}

const TournamentManagement: React.FC<TournamentManagementProps> = ({
  tournament,
  results,
  onClearData,
  onResetTournament,
  onExportResults
}) => {
  const [showWinnerAnnouncements, setShowWinnerAnnouncements] = useState(false);

  // Validate tournament data
  const validationErrors = validateTournamentData(tournament);
  const tournamentStats = calculateTournamentStats(tournament, results);

  // Generate winner announcements
  const winnerAnnouncements = results?.classResults 
    ? generateWinnerAnnouncements(results.classResults)
    : [];

  // Calculate consolidated competition results
  const consolidatedSkins = results?.skinResults 
    ? calculateTotalSkins(results.skinResults)
    : [];

  const consolidatedCorners = results?.cornerResults 
    ? calculateConsolidatedCorners(results.cornerResults)
    : [];

  // Sort players alphabetically for display
  const sortedPlayers = sortPlayersAlphabetically(tournament.players);

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear SCORE DATA?")) {
      onClearData?.();
    }
  };

  const handleResetTournament = () => {
    if (window.confirm("Are you sure you want to reset the entire tournament? This will clear all data.")) {
      onResetTournament?.();
    }
  };

  return (
    <div className="space-y-6">
      {/* Tournament Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Tournament Statistics
          </CardTitle>
          <CardDescription>
            Overview of tournament participation and setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Player Statistics */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Players</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Total: {tournamentStats.totalPlayers}</div>
                <div>Members: {tournamentStats.memberBreakdown.members}</div>
                <div>Guests: {tournamentStats.memberBreakdown.guests}</div>
              </div>
            </div>

            {/* Class Breakdown */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Class Breakdown</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Class A: {tournamentStats.classBreakdown.A}</div>
                <div>Class B: {tournamentStats.classBreakdown.B}</div>
                <div>Class C: {tournamentStats.classBreakdown.C}</div>
                <div>Senior: {tournamentStats.classBreakdown.Senior}</div>
              </div>
            </div>

            {/* Competition Participation */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Competitions</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Skins: {tournamentStats.competitionParticipation.skins} players</div>
                <div>Corners: {tournamentStats.competitionParticipation.corners} players</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Tournament Validation Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {validationErrors.map((error, index) => (
                <Alert key={index} variant="destructive">
                  <AlertDescription>
                    <strong>{error.field}:</strong> {error.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Competition Results Summary */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Competition Results Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skins Leaderboard */}
              {consolidatedSkins.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Skins Competition Leaders</h4>
                  <div className="space-y-2">
                    {consolidatedSkins.slice(0, 5).map((player, index) => (
                      <div key={player.playerId} className="flex justify-between items-center p-2 bg-card rounded-lg">
                        <span className="font-medium">{index + 1}. {player.playerName}</span>
                        <Badge variant="secondary">{player.totalSkins} skins</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Corners Leaderboard */}
              {consolidatedCorners.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Corners Competition Leaders</h4>
                  <div className="space-y-2">
                    {consolidatedCorners.slice(0, 5).map((player, index) => (
                      <div key={player.playerId} className="flex justify-between items-center p-2 bg-card rounded-lg">
                        <span className="font-medium">{index + 1}. {player.playerName}</span>
                        <Badge variant="secondary">{player.totalPoints} pts</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Winner Announcements */}
      {winnerAnnouncements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Class Winners
            </CardTitle>
            <CardDescription>
              Official tournament results by class
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={showWinnerAnnouncements} onOpenChange={setShowWinnerAnnouncements}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  View Detailed Winner Announcements
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>🏆 Tournament Winners - {tournament.name}</DialogTitle>
                  <DialogDescription>
                    Congratulations to all winners!
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {winnerAnnouncements.map((announcement, index) => (
                    <div key={index} className="p-4 bg-accent rounded-lg">
                      <h4 className="font-bold text-lg mb-2">Class {announcement.class}</h4>
                      <pre className="whitespace-pre-wrap text-sm font-mono bg-background p-3 rounded border">
                        {announcement.message}
                      </pre>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Quick winner preview */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {winnerAnnouncements.map((announcement, index) => (
                <div key={index} className="p-3 bg-accent rounded-lg text-center">
                  <h5 className="font-semibold">Class {announcement.class}</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    {announcement.message.split('\n')[2]?.replace('First Place winner is ', '') || 'No winner'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tournament Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tournament Management
          </CardTitle>
          <CardDescription>
            Data management and tournament administration tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {/* Clear Score Data */}
            <Button 
              variant="outline" 
              onClick={handleClearData}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Score Data
            </Button>

            {/* Reset Tournament */}
            <Button 
              variant="outline" 
              onClick={handleResetTournament}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Tournament
            </Button>

            {/* Export Results */}
            {results && (
              <Button 
                variant="outline" 
                onClick={onExportResults}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Results
              </Button>
            )}
          </div>

          {/* Player List Management */}
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Player List (Alphabetically Sorted)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {sortedPlayers.map((player, index) => (
                <div key={player.id} className="flex items-center justify-between p-2 bg-card rounded text-sm">
                  <span>{index + 1}. {player.name}</span>
                  <div className="flex gap-1">
                    <Badge variant={player.isMember ? "default" : "secondary"} className="text-xs">
                      {player.isMember ? "Member" : "Guest"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {player.class}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentManagement;