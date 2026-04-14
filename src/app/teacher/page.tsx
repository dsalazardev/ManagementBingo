"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { CONCEPT_DEFINITIONS, GAME_CONCEPTS } from '@/lib/game-constants';
import { Play, Pause, RotateCcw, UserCheck, Lock, ArrowRight, Send, Bot, History } from 'lucide-react';
import { validateBingoClaim } from '@/ai/flows/validate-bingo-claim-flow';
import { teacherChat } from '@/ai/flows/teacher-chat-flow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const TEACHER_ACCESS_CODE = "34910";

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

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

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setAvailableConcepts([...GAME_CONCEPTS].sort(() => Math.random() - 0.5));
  }, []);

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCodeInput === TEACHER_ACCESS_CODE) {
      setIsAuthorized(true);
      toast({ title: "Acceso concedido", description: "Modo Director activo." });
    } else {
      toast({ variant: "destructive", title: "Incorrecto", description: "Código inválido." });
      setAccessCodeInput("");
    }
  };

  const handleNextDefinition = () => {
    if (availableConcepts.length === 0) {
      toast({ title: "Fin del juego", description: "No quedan más conceptos." });
      return;
    }
    const nextConcept = availableConcepts[0];
    const definition = CONCEPT_DEFINITIONS[nextConcept];
    setCurrentConcept(nextConcept);
    setReadDefinitions(prev => [definition, ...prev]);
    setAvailableConcepts(prev => prev.slice(1));
  };

  const handleReset = () => {
    if (confirm("¿Reiniciar toda la partida?")) {
      setAvailableConcepts([...GAME_CONCEPTS].sort(() => Math.random() - 0.5));
      setReadDefinitions([]);
      setCurrentConcept(null);
      setIsGameActive(false);
      setValidationResult(null);
    }
  };

  const handleValidate = async () => {
    const concepts = validationInput.split(',').map(c => c.trim());
    if (concepts.length !== 5) {
      toast({ variant: "destructive", title: "Error", description: "Deben ser 5 conceptos exactos." });
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
      toast({ variant: "destructive", title: "Error IA", description: "Fallo en la validación." });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput("");
    setIsTyping(true);
    try {
      const response = await teacherChat({ message: userMsg, gameContext: JSON.stringify(CONCEPT_DEFINITIONS) });
      setChatMessages(prev => [...prev, { role: 'assistant', content: response.answer }]);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "IA no disponible." });
    } finally {
      setIsTyping(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <Card className="max-w-xs w-full border-none shadow-2xl rounded-[2rem] p-4 bg-white/50 backdrop-blur">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-black">Control Maestro</CardTitle>
            <CardDescription>Solo personal autorizado.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAccessSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Código"
                value={accessCodeInput}
                onChange={(e) => setAccessCodeInput(e.target.value)}
                className="text-center text-3xl h-16 rounded-2xl border-2 focus:ring-primary/20"
                autoFocus
              />
              <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold">
                Entrar <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-safe">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary font-black px-3 py-1 rounded-full uppercase text-[10px] tracking-widest">Master</Badge>
          <h1 className="font-headline font-black text-lg">Director</h1>
        </div>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full"><Bot className="w-5 h-5 text-primary" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
              <SheetHeader className="p-6 border-b">
                <SheetTitle className="flex items-center gap-2 font-black">Asistente IA</SheetTitle>
              </SheetHeader>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={cn(
                      "flex flex-col max-w-[85%] rounded-2xl p-4 text-sm shadow-sm",
                      msg.role === 'user' 
                        ? "bg-primary text-primary-foreground ml-auto rounded-tr-none" 
                        : "bg-muted text-foreground mr-auto rounded-tl-none"
                    )}>
                      {msg.content}
                    </div>
                  ))}
                  {isTyping && <div className="p-4 bg-muted animate-pulse rounded-2xl mr-auto text-xs font-bold">IA pensando...</div>}
                </div>
              </ScrollArea>
              <div className="p-4 border-t bg-background">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input placeholder="Duda técnica..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="rounded-xl h-12" />
                  <Button type="submit" size="icon" className="rounded-xl h-12 w-12"><Send className="w-4 h-4" /></Button>
                </form>
              </div>
            </SheetContent>
          </Sheet>
          <Button variant="ghost" size="icon" onClick={handleReset} className="rounded-full"><RotateCcw className="w-5 h-5" /></Button>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-4 max-w-lg mx-auto w-full">
        <Tabs defaultValue="bombola" className="w-full">
          <TabsList className="grid grid-cols-2 w-full h-12 rounded-2xl p-1 bg-muted/50 mb-4">
            <TabsTrigger value="bombola" className="rounded-xl font-bold">Bombo</TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl font-bold">Historial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bombola" className="space-y-4 animate-in fade-in duration-300">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Progreso</span>
                  <span className="text-[10px] font-black">{readDefinitions.length}/{GAME_CONCEPTS.length}</span>
                </div>
                <Progress value={(readDefinitions.length / GAME_CONCEPTS.length) * 100} className="h-2.5 rounded-full" />
              </CardHeader>
              <CardContent className="p-6 text-center space-y-6">
                {currentConcept ? (
                  <div className="space-y-4 animate-in zoom-in-95 duration-200">
                    <p className="text-2xl md:text-3xl font-bold leading-tight italic text-foreground px-2">
                      "{CONCEPT_DEFINITIONS[currentConcept]}"
                    </p>
                    <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20 inline-block">
                      <p className="text-[10px] uppercase font-bold text-primary/60 mb-1 tracking-tighter">Respuesta correcta</p>
                      <p className="text-xl font-black text-primary">{currentConcept}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center gap-4 text-muted-foreground">
                    <History className="w-16 h-16 opacity-10" />
                    <p className="font-bold">Listo para iniciar...</p>
                  </div>
                )}
                <Button 
                  className="w-full h-20 rounded-[2rem] text-xl font-black shadow-lg shadow-primary/20 active:scale-95 transition-all"
                  disabled={!isGameActive || availableConcepts.length === 0}
                  onClick={handleNextDefinition}
                >
                  Siguiente Definición
                </Button>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button 
                variant={isGameActive ? "secondary" : "default"} 
                className="flex-1 h-14 rounded-2xl font-black"
                onClick={() => setIsGameActive(!isGameActive)}
              >
                {isGameActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                {isGameActive ? "Pausar" : "Iniciar"}
              </Button>
              <Button 
                variant="accent" 
                className="flex-1 h-14 rounded-2xl font-black"
                onClick={() => setShowValidation(true)}
              >
                <UserCheck className="mr-2 h-5 w-5" /> Validar
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="animate-in slide-in-from-right-4 duration-300">
            <ScrollArea className="h-[60vh] rounded-[2rem] border-none bg-muted/20 p-2">
              <div className="space-y-3 p-2">
                {readDefinitions.map((def, idx) => {
                  const concept = Object.keys(CONCEPT_DEFINITIONS).find(key => CONCEPT_DEFINITIONS[key] === def);
                  return (
                    <Card key={idx} className="border-none shadow-sm rounded-2xl">
                      <CardContent className="p-4 flex gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black shrink-0">
                          {readDefinitions.length - idx}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-black text-primary uppercase tracking-tighter">{concept}</p>
                          <p className="text-sm text-muted-foreground italic leading-snug">"{def}"</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {readDefinitions.length === 0 && <p className="text-center py-20 text-muted-foreground font-bold">Sin actividad.</p>}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showValidation} onOpenChange={setShowValidation}>
        <DialogContent className="max-w-xs rounded-[2.5rem] p-6 border-none">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Validar Ganador</DialogTitle>
            <DialogDescription>Dicta los 5 conceptos separados por coma.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input 
              placeholder="Concepto 1, Concepto 2..." 
              value={validationInput}
              onChange={(e) => setValidationInput(e.target.value)}
              className="h-14 rounded-2xl text-lg font-bold"
            />
            {validationResult && (
              <div className={cn(
                "p-4 rounded-2xl border-2 animate-in fade-in zoom-in",
                validationResult.isValid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              )}>
                <p className={cn("font-black mb-1", validationResult.isValid ? "text-green-800" : "text-red-800")}>
                  {validationResult.isValid ? "¡BINGO VÁLIDO!" : "ERROR EN LÍNEA"}
                </p>
                <p className="text-xs leading-relaxed">{validationResult.reason}</p>
              </div>
            )}
          </div>
          <DialogFooter className="flex-col gap-2">
            <Button className="w-full h-14 rounded-2xl font-black" onClick={handleValidate} disabled={isValidating}>
              {isValidating ? "Verificando..." : "Verificar ahora"}
            </Button>
            <Button variant="ghost" className="w-full h-12" onClick={() => {setShowValidation(false); setValidationResult(null);}}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
