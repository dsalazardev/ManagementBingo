import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, PlayCircle, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-accent/5">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary tracking-tight">
            Gestión<span className="text-accent">Bingo</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transforma la teoría densa en una competencia vibrante. Reconocimiento cognitivo bajo presión para los futuros gestores técnicos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card className="border-2 hover:border-primary/50 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck className="w-24 h-24 text-primary" />
            </div>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <GraduationCap className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-headline">Director de Juego</CardTitle>
              <CardDescription>
                Accede al Bombo Teórico, controla el proyector y valida las victorias de tus estudiantes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/teacher">
                <Button className="w-full text-lg h-12 font-semibold">
                  Iniciar como Profesor
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-accent/50 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <PlayCircle className="w-24 h-24 text-accent" />
            </div>
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-headline">Gestor Técnico</CardTitle>
              <CardDescription>
                Genera tu cartón único de 5x5, escucha las definiciones y sé el primero en gritar ¡BINGO!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/student">
                <Button variant="outline" className="w-full text-lg h-12 font-semibold border-accent text-accent hover:bg-accent hover:text-white">
                  Entrar como Estudiante
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="pt-12 text-sm text-muted-foreground flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Aprendizaje Activo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>Gamificación Real</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Validación por IA</span>
          </div>
        </div>
      </div>
    </main>
  );
}