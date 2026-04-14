"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { CONCEPT_DEFINITIONS, GAME_CONCEPTS } from '@/lib/game-constants';
import { Play, Pause, RotateCcw, CheckCircle2, AlertTriangle, HelpCircle, UserCheck, Lock, ArrowRight } from 'lucide-react';
import { validateBingoClaim } from '@/ai/flows/validate-bingo-claim-flow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const TEACHER_ACCESS_CODE = "34910";

export default function TeacherPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessCodeInput, setAccessCodeInput] = useState("");
  
  const [readDefinitions, setReadDefinitions] = useState<string[]>([]);
  const [availableConcepts, setAvailableConcepts] = useState<string[]>([]);
  const [currentConcept, setCurrentConcept] = useState<string | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [validationInput, setValidationInput] = useState<string>("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; reason: string } | null>(null);

  useEffect(() => {
    setAvailableConcepts([...GAME_CONCEPTS].sort(() => Math.random() - 0.5));
  }, []);

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCodeInput === TEACHER_ACCESS_CODE) {
      setIsAuthorized(true);
      toast({
        title: "Acceso concedido",
        description: "Bienvenido, Director de Juego.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Código incorrecto",
        description: "El código de acceso ingresado no es válido.",
      });
      setAccessCodeInput("");
    }
  };

  const handleNextDefinition = () => {
    if (availableConcepts.length === 0) return;
    
    const nextConcept = availableConcepts[0];
    const definition = CONCEPT_DEFINITIONS[nextConcept];
    
    setCurrentConcept(nextConcept);
    setReadDefinitions(prev => [definition, ...prev]);
    setAvailableConcepts(prev => prev.slice(1));
  };

  const handleReset = () => {
    setAvailableConcepts([...GAME_CONCEPTS].sort(() => Math.random() - 0.5));
    setReadDefinitions([]);
    setCurrentConcept(null);
    setIsGameActive(false);
    setValidationResult(null);
  };

  const handleValidate = async () => {
    const concepts = validationInput.split(',').map(c => c.trim());
    if (concepts.length !== 5) {
      toast({
        variant: "destructive",
        title: "Error de formato",
        description: "Por favor ingrese exactamente 5 conceptos separados por comas.",
      });
      return;
    }

    setIsValidating(true);
    try {
      const result = await validateBingoClaim({
        winningLineConcepts: concepts as [string, string, string, string, string],
        readDefinitions: readDefinitions
      });
      setValidationResult(result);
    } catch (error) {
      console.error("Validation failed", error);
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "No se pudo completar la auditoría con la IA.",
      });
    } finally {
      setIsValidating(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-background to-accent/5">
        <Card className="max-w-md w-full border-2 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-headline font-bold">Acceso Restringido</CardTitle>
            <CardDescription>
              Solo el Director de Juego puede acceder a este panel. Ingrese el código de autorización.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAccessSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Código de ingreso"
                  value={accessCodeInput}
                  onChange={(e) => setAccessCodeInput(e.target.value)}
                  className="text-center text-2xl tracking-[0.5em] h-14 font-mono"
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full h-12 text-lg font-semibold group">
                Verificar Identidad <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t pt-4">
            <p className="text-xs text-muted-foreground italic">
              Si eres estudiante, regresa a la página principal.
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-2">
            Panel del Director <Badge variant="secondary" className="bg-primary/10 text-primary">Live Session</Badge>
          </h1>
          <p className="text-muted-foreground">Controla el ritmo del juego y valida las victorias.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="lg" onClick={handleReset} className="gap-2">
            <RotateCcw className="w-4 h-4" /> Reiniciar
          </Button>
          {!isGameActive ? (
            <Button size="lg" onClick={() => setIsGameActive(true)} className="gap-2 bg-primary">
              <Play className="w-4 h-4" /> Iniciar Partida
            </Button>
          ) : (
            <Button size="lg" variant="secondary" onClick={() => setIsGameActive(false)} className="gap-2">
              <Pause className="w-4 h-4" /> Pausar Partida
            </Button>
          )}
          <Button size="lg" variant="accent" onClick={() => setShowValidation(true)} className="gap-2 bg-accent text-white hover:bg-accent/90">
            <UserCheck className="w-4 h-4" /> Validar Bingo
          </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="font-headline text-primary">Bombo Teórico</CardTitle>
                <div className="text-sm font-medium text-muted-foreground">
                  {readDefinitions.length} / {GAME_CONCEPTS.length} conceptos leídos
                </div>
              </div>
              <Progress value={(readDefinitions.length / GAME_CONCEPTS.length) * 100} className="h-2" />
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {currentConcept ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary/60">Definición actual</span>
                    <p className="text-3xl md:text-4xl font-semibold leading-tight text-foreground">
                      "{CONCEPT_DEFINITIONS[currentConcept]}"
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Respuesta (Para el profesor):</p>
                        <p className="text-xl font-bold text-primary">{currentConcept}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 space-y-4">
                  <Play className="w-16 h-16 text-muted/30 mx-auto" />
                  <p className="text-xl text-muted-foreground">Presiona "Siguiente Definición" para comenzar.</p>
                </div>
              )}
              
              <Button 
                className="w-full h-20 text-2xl font-bold bg-primary hover:bg-primary/90 transition-all shadow-lg hover:scale-[1.01]" 
                disabled={!isGameActive || availableConcepts.length === 0}
                onClick={handleNextDefinition}
              >
                Lanzar Siguiente Definición
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Instrucciones del Director</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none text-muted-foreground">
              <ul className="list-disc pl-5 space-y-2">
                <li>Exige silencio absoluto antes de leer cada definición.</li>
                <li>Lee pausadamente; recuerda que el estudiante debe procesar y buscar visualmente.</li>
                <li>Si un concepto es difícil, puedes dar una pequeña pista contextual.</li>
                <li>Si alguien grita <strong>¡GESTIÓN!</strong>, presiona "Pausar Partida" inmediatamente.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col h-full max-h-[calc(100vh-200px)]">
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-headline">Historial de la Partida</CardTitle>
            <CardDescription>Las definiciones que ya han sido lanzadas.</CardDescription>
          </CardHeader>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {readDefinitions.map((def, idx) => {
                const concept = Object.keys(CONCEPT_DEFINITIONS).find(key => CONCEPT_DEFINITIONS[key] === def);
                return (
                  <div key={idx} className="p-3 bg-muted/30 rounded-lg border text-sm space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-primary"># {readDefinitions.length - idx}</span>
                      <Badge variant="outline" className="text-[10px]">{concept}</Badge>
                    </div>
                    <p className="italic leading-relaxed">"{def}"</p>
                  </div>
                );
              })}
              {readDefinitions.length === 0 && (
                <div className="text-center py-10 text-muted-foreground italic">No hay historial aún.</div>
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>

      <Dialog open={showValidation} onOpenChange={setShowValidation}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Auditoría de Bingo</DialogTitle>
            <DialogDescription>
              El estudiante debe dictar sus 5 conceptos marcados. Ingrésalos separados por comas.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Línea Ganadora (5 conceptos):</label>
              <Input 
                placeholder="Ej: Gestión Técnica, Recursos Humanos, ..." 
                value={validationInput}
                onChange={(e) => setValidationInput(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">Escribe los conceptos tal como aparecen en el cartón.</p>
            </div>

            {validationResult && (
              <div className={`p-4 rounded-lg border-2 ${validationResult.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-3">
                  {validationResult.isValid ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                  )}
                  <div className="space-y-1">
                    <p className={`font-bold ${validationResult.isValid ? 'text-green-800' : 'text-red-800'}`}>
                      {validationResult.isValid ? '¡Bingo Válido!' : '¡Bingo Inválido!'}
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">{validationResult.reason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setShowValidation(false); setValidationResult(null); }}>Cerrar</Button>
            <Button 
              className="bg-primary" 
              onClick={handleValidate} 
              disabled={isValidating || validationInput.split(',').length !== 5}
            >
              {isValidating ? "Validando con IA..." : "Ejecutar Auditoría"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
