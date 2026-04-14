import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, PlayCircle, ShieldCheck, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-6 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-background to-accent/5">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-2">
            <PlayCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tight">
            Gestión<span className="text-accent">Bingo</span>
          </h1>
          <p className="text-lg text-muted-foreground px-4">
            Aprende los conceptos clave de gestión mientras juegas.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/student" className="block group">
            <Card className="border-none shadow-md hover:shadow-lg transition-all active:scale-[0.98] duration-200 overflow-hidden bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shrink-0">
                  <Users className="w-7 h-7" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold">Soy Estudiante</h3>
                  <p className="text-sm text-muted-foreground">Generar mi cartón y jugar.</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/teacher" className="block group">
            <Card className="border-none shadow-md hover:shadow-lg transition-all active:scale-[0.98] duration-200 overflow-hidden bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold">Soy Profesor</h3>
                  <p className="text-sm text-muted-foreground">Controlar partida y validar.</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="pt-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Dinámico</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Efectivo</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">IA Validada</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
