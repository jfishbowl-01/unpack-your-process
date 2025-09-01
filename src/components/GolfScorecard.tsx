import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface CourseHole {
  par: number;
  handicapIndex: number;
}

interface Course {
  name: string;
  holes: CourseHole[];
}

interface Player {
  id: string;
  name: string;
  handicapIndex: number;
  courseHandicap: number;
  class: string;
  teeColor: string;
  isPlayingSkins: boolean;
}

interface Tournament {
  hasSkinsCompetition: boolean;
}

interface HoleScore {
  holeNumber: number;
  par: number;
  handicapIndex: number;
  grossScore: number | null;
  netScore: number | null;
  playerGetsStroke: boolean;
}

interface ScoreTotals {
  gross: number;
  net: number;
  toPar: number;
}

interface GolfScorecardProps {
  player: Player;
  course: Course;
  tournament: Tournament;
  onScoreUpdate: (playerId: string, hole: number, score: number) => void;
}

const GolfScorecard: React.FC<GolfScorecardProps> = ({
  player,
  course,
  tournament,
  onScoreUpdate
}) => {
  const { toast } = useToast();
  
  // State to track scores for each hole
  const [scores, setScores] = useState<HoleScore[]>(
    Array(18).fill(null).map((_, index) => ({
      holeNumber: index + 1,
      par: course.holes[index].par,
      handicapIndex: course.holes[index].handicapIndex,
      grossScore: null,
      netScore: null,
      playerGetsStroke: false,
    }))
  );

  // Calculate running totals
  const [totals, setTotals] = useState({
    frontNine: { gross: 0, net: 0, toPar: 0 },
    backNine: { gross: 0, net: 0, toPar: 0 },
    total: { gross: 0, net: 0, toPar: 0 }
  });

  // Calculate if player gets stroke on each hole
  useEffect(() => {
    const updatedScores = scores.map(hole => ({
      ...hole,
      playerGetsStroke: player.courseHandicap >= hole.handicapIndex
    }));
    setScores(updatedScores);
  }, [player.courseHandicap, scores]);

  // Recalculate totals whenever scores change
  useEffect(() => {
    calculateTotals();
  }, [scores]);

  const calculateTotals = () => {
    let frontNineGross = 0, frontNineNet = 0, frontNinePar = 0;
    let backNineGross = 0, backNineNet = 0, backNinePar = 0;

    scores.forEach((hole, index) => {
      if (hole.grossScore) {
        const netScore = hole.grossScore - (hole.playerGetsStroke ? 1 : 0);
        
        if (index < 9) { // Front nine
          frontNineGross += hole.grossScore;
          frontNineNet += netScore;
          frontNinePar += hole.par;
        } else { // Back nine
          backNineGross += hole.grossScore;
          backNineNet += netScore;
          backNinePar += hole.par;
        }
      }
    });

    const totalGross = frontNineGross + backNineGross;
    const totalNet = frontNineNet + backNineNet;
    const totalPar = frontNinePar + backNinePar;

    setTotals({
      frontNine: {
        gross: frontNineGross,
        net: frontNineNet,
        toPar: frontNineNet - frontNinePar
      },
      backNine: {
        gross: backNineGross,
        net: backNineNet,
        toPar: backNineNet - backNinePar
      },
      total: {
        gross: totalGross,
        net: totalNet,
        toPar: totalNet - totalPar
      }
    });
  };

  const updateScore = (holeIndex: number, score: number) => {
    const updatedScores = [...scores];
    updatedScores[holeIndex].grossScore = score;
    updatedScores[holeIndex].netScore = score - (updatedScores[holeIndex].playerGetsStroke ? 1 : 0);
    
    setScores(updatedScores);
    
    // Notify parent component of score change
    onScoreUpdate(player.id, holeIndex + 1, score);
  };

  const ScoreButton: React.FC<{ score: number; isSelected: boolean; onPress: () => void; par: number }> = ({ 
    score, 
    isSelected, 
    onPress, 
    par 
  }) => {
    const getVariant = () => {
      if (isSelected) {
        if (score < par) return "score-under";
        if (score > par) return "score-over";
        return "score-selected";
      }
      return "score";
    };

    return (
      <Button
        variant={getVariant()}
        size="score"
        onClick={onPress}
        className="m-1"
      >
        {score}
      </Button>
    );
  };

  const HoleRow: React.FC<{ hole: HoleScore; index: number }> = ({ hole, index }) => (
    <div className="flex items-center justify-between py-4 border-b border-golf-green/20 last:border-0">
      <div className="flex items-center space-x-4 min-w-[120px]">
        <div className="text-center">
          <div className="text-lg font-bold text-golf-green-dark">{hole.holeNumber}</div>
          <div className="text-sm text-golf-earth">Par {hole.par}</div>
        </div>
        {hole.playerGetsStroke && (
          <Badge variant="outline" className="bg-golf-sand/20 text-golf-earth border-golf-sand">
            ●
          </Badge>
        )}
      </div>
      
      <div className="flex-1 flex flex-col items-center">
        <div className="text-2xl font-bold text-golf-green mb-2 min-h-[2rem] flex items-center">
          {hole.grossScore || '-'}
        </div>
        <div className="flex flex-wrap justify-center max-w-[320px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
            <ScoreButton
              key={score}
              score={score}
              par={hole.par}
              isSelected={hole.grossScore === score}
              onPress={() => updateScore(index, score)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const ScoreSummary: React.FC<{ title: string; scores: ScoreTotals }> = ({ title, scores }) => (
    <Card className="bg-gradient-fairway border-golf-green/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-golf-green-dark">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-golf-earth">Gross:</span>
          <span className="font-bold text-golf-green-dark">{scores.gross}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-golf-earth">Net:</span>
          <span className="font-bold text-golf-green-dark">{scores.net}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-golf-earth">To Par:</span>
          <span className={`font-bold ${
            scores.toPar < 0 ? 'text-golf-green' : 
            scores.toPar > 0 ? 'text-red-600' : 'text-golf-green-dark'
          }`}>
            {scores.toPar > 0 ? '+' : ''}{scores.toPar}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  const handleSaveScorecard = () => {
    toast({
      title: "Scorecard Saved! ⛳",
      description: "Your golf scorecard has been successfully saved.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-fairway">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Player Header */}
        <Card className="bg-gradient-golf text-white mb-6 shadow-golf">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{player.name}</CardTitle>
            <div className="space-y-1 text-sm opacity-90">
              <div>HCP: {player.handicapIndex} | Course HCP: {player.courseHandicap} | Class: {player.class}</div>
              <div>{course.name} - {player.teeColor} Tees</div>
            </div>
          </CardHeader>
        </Card>

        {/* Front Nine */}
        <Card className="mb-6 shadow-golf-card">
          <CardHeader>
            <CardTitle className="text-center text-golf-green-dark bg-gradient-fairway py-2 rounded-lg">
              🏌️ Front Nine
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scores.slice(0, 9).map((hole, index) => (
              <HoleRow key={hole.holeNumber} hole={hole} index={index} />
            ))}
            <div className="mt-6">
              <ScoreSummary title="Front Nine Total" scores={totals.frontNine} />
            </div>
          </CardContent>
        </Card>

        {/* Back Nine */}
        <Card className="mb-6 shadow-golf-card">
          <CardHeader>
            <CardTitle className="text-center text-golf-green-dark bg-gradient-fairway py-2 rounded-lg">
              🏌️ Back Nine
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scores.slice(9, 18).map((hole, index) => (
              <HoleRow key={hole.holeNumber} hole={hole} index={index + 9} />
            ))}
            <div className="mt-6">
              <ScoreSummary title="Back Nine Total" scores={totals.backNine} />
            </div>
          </CardContent>
        </Card>

        {/* Total Score */}
        <Card className="mb-6 shadow-golf-card">
          <CardContent className="pt-6">
            <ScoreSummary title="🏆 18 Hole Total" scores={totals.total} />
            
            {/* Special Competitions Status */}
            {tournament.hasSkinsCompetition && (
              <Card className="mt-4 bg-golf-sand/20 border-golf-sand">
                <CardContent className="pt-4">
                  <div className="text-center text-golf-earth">
                    🏆 Skins Competition: {player.isPlayingSkins ? 
                      <Badge className="bg-golf-green text-white ml-2">Playing</Badge> : 
                      <Badge variant="outline" className="ml-2">Not Playing</Badge>
                    }
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          variant="golf"
          size="lg"
          onClick={handleSaveScorecard}
          className="w-full text-lg font-bold shadow-golf"
        >
          💾 Save Scorecard
        </Button>
      </div>
    </div>
  );
};

export default GolfScorecard;