"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GAME_CONCEPTS } from '@/lib/game-constants';
import { Trophy, RefreshCw, Info, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function StudentPage() {
  const [markedCells, setMarkedCells] = useState<Set<number>>(new Set([12])); // 12 is the center (0-indexed)
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
    if (index === 12) return; // Can't unmark center
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
    // 5x5 logic for victory
    const winPatterns = [
      // Horizontals
      [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
      // Verticals
      [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
      // Diagonals
      [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
    ];

    const hasWon = winPatterns.some(pattern => pattern.every(idx => markedCells.has(idx)));

    if (hasWon) {
      setHasClaimed(true);
      toast({
        title: "¡RECLAMACIÓN ENVIADA!",
        description: "Ponte de pie y grita: ¡GESTIÓN!",
      });
    } else {
      toast({
        title: "Aún no tienes Bingo",
        description: "Sigue escuchando las definiciones atentamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center gap-8">
      <header className="max-w-4xl w-full flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left space-y-1">
          <h1 className="text-4xl font-headline font-bold text-primary">Tu Cartón de Gestión</h1>
          <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
            <Info className="w-4 h-4" /> Escucha, decodifica y marca.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={generateBoard} className="gap-2 border-primary text-primary hover:bg-primary/5">
            <RefreshCw className="w-4 h-4" /> Nuevo Cartón
          </Button>
          <Button 
            onClick={checkBingo} 
            className="bg-accent text-white hover:bg-accent/90 gap-2 h-12 px-8 font-bold text-lg shadow-lg"
            disabled={hasClaimed}
          >
            <Trophy className="w-5 h-5" /> ¡GESTIÓN!
          </Button>
        </div>
      </header>

      <Card className="w-full max-w-2xl border-4 border-primary/20 shadow-2xl p-2 bg-primary/5">
        <CardContent className="p-0">
          <div className="grid grid-cols-5 gap-2 md:gap-3 aspect-square">
            {board.map((concept, idx) => (
              <button
                key={idx}
                onClick={() => toggleCell(idx)}
                className={cn(
                  "relative group flex flex-col items-center justify-center p-2 text-center rounded-md border-2 transition-all duration-200",
                  "text-[10px] md:text-sm font-semibold h-full w-full",
                  markedCells.has(idx) 
                    ? "bg-primary text-primary-foreground border-primary shadow-inner scale-95" 
                    : "bg-white hover:bg-primary/5 border-primary/10 hover:border-primary/30",
                  idx === 12 && "bg-accent/10 border-accent/40 text-accent font-bold"
                )}
              >
                {markedCells.has(idx) && (
                  <CheckCircle2 className="absolute top-1 right-1 w-3 h-3 md:w-4 md:h-4 text-white opacity-80" />
                )}
                <span className={cn(
                  "line-clamp-3",
                  idx === 12 && "text-accent text-[10px] md:text-xs tracking-tighter"
                )}>
                  {concept}
                </span>
                {idx === 12 && <Trophy className="mt-1 w-4 h-4 md:w-6 md:h-6" />}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="max-w-2xl w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-none shadow-none">
          <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
            <div className="text-3xl font-bold text-primary">{markedCells.size - 1}</div>
            <div className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Marcadas</div>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-none shadow-none col-span-2">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-accent/10 rounded-full">
              <Trophy className="w-6 h-6 text-accent" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-accent">Condición de Victoria</p>
              <p className="text-xs text-muted-foreground leading-snug">
                Completa una línea de 5 (horizontal, vertical o diagonal) y presiona el botón naranja.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {hasClaimed && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <Card className="max-w-md w-full text-center p-8 space-y-6 animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-headline font-bold">¡HAS RECLAMADO BINGO!</h2>
              <p className="text-muted-foreground text-lg italic">
                "Párate ahora mismo y prepárate para dictar tu línea ganadora al Director de Juego."
              </p>
            </div>
            <Button className="w-full bg-primary" onClick={() => setHasClaimed(false)}>Entendido</Button>
          </Card>
        </div>
      )}
    </div>
  );
}