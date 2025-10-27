import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, TrendingUp, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatXP } from '@/utils/gamification';
import Confetti from 'react-confetti';

interface XPRewardPopupProps {
  xpAwarded: number;
  oldTotalXP: number;
  newTotalXP: number;
  leveledUp: boolean;
  newLevel?: {
    level: number;
    name: string;
    emoji: string;
    progressPercentage: number;
    xpToNextLevel: number;
  };
  oldLevel?: {
    level: number;
    name: string;
  };
  streakSaved?: boolean;
  onClose: () => void;
}

export function XPRewardPopup({
  xpAwarded,
  oldTotalXP,
  newTotalXP,
  leveledUp,
  newLevel,
  oldLevel,
  streakSaved,
  onClose,
}: XPRewardPopupProps) {
  const [showConfetti, setShowConfetti] = useState(leveledUp);
  const [animatedXP, setAnimatedXP] = useState(oldTotalXP);

  useEffect(() => {
    // Animate XP counting up
    const duration = 1500;
    const steps = 60;
    const increment = (newTotalXP - oldTotalXP) / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setAnimatedXP(newTotalXP);
        clearInterval(interval);
        
        // Auto close after showing result
        setTimeout(() => {
          onClose();
        }, leveledUp ? 5000 : 3000);
      } else {
        setAnimatedXP(Math.floor(oldTotalXP + increment * currentStep));
      }
    }, duration / steps);

    if (showConfetti) {
      setTimeout(() => setShowConfetti(false), 5000);
    }

    return () => clearInterval(interval);
  }, [oldTotalXP, newTotalXP, onClose, leveledUp, showConfetti]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
          />
        )}
        
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="p-8 max-w-md w-full mx-4 text-center space-y-6">
            {leveledUp ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="text-6xl mb-4"
                >
                  {newLevel?.emoji}
                </motion.div>
                <h2 className="text-3xl font-bold text-primary">Level Up!</h2>
                <p className="text-xl">
                  You've reached Level {newLevel?.level}
                </p>
                <p className="text-2xl font-semibold">{newLevel?.name}</p>
              </>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring" }}
              >
                <Star className="w-16 h-16 mx-auto text-yellow-500 fill-yellow-500" />
              </motion.div>
            )}

            <div className="space-y-2">
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-primary"
              >
                +{xpAwarded} XP
              </motion.div>
              
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <span>{formatXP(animatedXP)} XP</span>
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            {newLevel && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Level {newLevel.level + 1}</span>
                  <span>{Math.round(newLevel.progressPercentage)}%</span>
                </div>
                <Progress value={newLevel.progressPercentage} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  {formatXP(newLevel.xpToNextLevel)} XP to next level
                </p>
              </div>
            )}

            {streakSaved && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400"
              >
                <Award className="w-4 h-4" />
                <span>Streak saved! Keep it going!</span>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
