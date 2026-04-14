"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GAME_CONCEPTS } from '@/lib/game-constants';
import { Trophy, RefreshCw, Info, CheckCircle2, LayoutGrid, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function StudentPage() {
  const [markedCells, setMarkedCells] = useState<Set<number>>(new Set([12])); // 12 is the center
  const [board, setBoard] = useState<string[]>([]);
  const [hasClaimed, setHasClaimed] = useState(false);

  const generateBoard = () => {
    const shuffled = [...GAME_CONCEPTS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 24);
    const finalBoard = [...selected.slice(0, 12), "ESPACIO LIBRE", ...selected.slice(12)];
    setBoard(finalBoard);
    setMarkedCells(new Set([12]));
    setHasClaimed(false);
  };

  useEffect(() => {
    generateBoard();
  }, []);

  const toggleCell = (index: number) => {
    if (index === 12) return;
    setMarkedCells(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const checkBingo = () => {
    const winPatterns = [
      [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
      [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
      [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
    ];

    const hasWon = winPatterns.some(pattern => pattern.every(idx => markedCells.has(idx)));

    if (hasWon) {
      setHasClaimed(true);
      toast({
        title: "¡RECLAMACIÓN ENVIADA!",
        description: "¡Levanta la mano y grita GESTIÓN!",
      });
    } else {
      toast({
        title: "Aún falta...",
        description: "Sigue escuchando al profesor.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-safe">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <span className="font-headline font-bold text-lg">Mi Cartón</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={generateBoard}
          className="rounded-full text-muted-foreground hover:text-primary active:bg-primary/10 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </Button>
      </header>

      <main className="flex-1 p-3 md:p-6 max-w-2xl mx-auto w-full space-y-4">
        <div className="bg-primary/5 rounded-2xl p-4 flex items-center gap-3 border border-primary/10">
          <Info className="w-5 h-5 text-primary shrink-0" />
          <p className="text-xs text-primary font-medium leading-tight">
            Escucha la definición, identifica el concepto y tócalo para marcarlo en tu cartón.
          </p>
        </div>

        <div className="grid grid-cols-5 gap-1.5 md:gap-3 aspect-square w-full">
          {board.map((concept, idx) => (
            <button
              key={idx}
              onClick={() => toggleCell(idx)}
              className={cn(
                "relative group flex flex-col items-center justify-center p-1.5 text-center rounded-xl border-2 transition-all duration-150 active:scale-95",
                "text-[9px] md:text-sm font-bold leading-[1.1] h-full w-full overflow-hidden",
                markedCells.has(idx) 
                  ? "bg-primary text-primary-foreground border-primary shadow-lg ring-2 ring-primary/20" 
                  : "bg-white border-primary/5 shadow-sm text-foreground",
                idx === 12 && "bg-accent/10 border-accent/30 text-accent"
              )}
            >
              {markedCells.has(idx) && idx !== 12 && (
                <CheckCircle2 className="absolute top-1 right-1 w-3 h-3 text-white opacity-90" />
              )}
              <span className={cn(
                "line-clamp-3 hyphens-auto",
                idx === 12 && "text-[8px] md:text-xs tracking-tighter uppercase font-black"
              )}>
                {concept}
              </span>
              {idx === 12 && <Trophy className="mt-1 w-4 h-4 text-accent" />}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 pb-24">
          <Card className="border-none bg-muted/30 shadow-none">
            <CardContent className="p-4 flex flex-col items-center text-center gap-1">
              <span className="text-2xl font-black text-primary">{markedCells.size - 1}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Marcadas</span>
            </CardContent>
          </Card>
          <Card className="border-none bg-accent/5 shadow-none">
            <CardContent className="p-4 flex flex-col items-center text-center gap-1 text-accent">
              <Trophy className="w-6 h-6 mb-0.5" />
              <span className="text-[10px] uppercase font-bold tracking-widest">¡Ganar!</span>
            </CardContent>
          </Card>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent z-30">
        <Button 
          onClick={checkBingo} 
          className="w-full h-16 rounded-2xl bg-accent text-white hover:bg-accent/90 shadow-xl shadow-accent/20 active:scale-[0.97] transition-all text-xl font-black uppercase tracking-wider"
          disabled={hasClaimed}
        >
          <Trophy className="mr-2 w-6 h-6" /> ¡GESTIÓN!
        </Button>
      </div>

      {hasClaimed && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="max-w-xs w-full text-center p-8 space-y-6 rounded-3xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto">
              <Trophy className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-headline font-black">¡BINGO RECLAMADO!</h2>
              <p className="text-muted-foreground text-sm italic">
                "Ponte de pie ahora y prepárate para dictar tu línea al profesor."
              </p>
            </div>
            <Button className="w-full h-12 rounded-xl bg-primary" onClick={() => setHasClaimed(false)}>Entendido</Button>
          </Card>
        </div>
      )}
    </div>
  );
}
