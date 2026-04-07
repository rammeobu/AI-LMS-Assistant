import Link from "next/link";
import { User, Activity, Map, Users } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-outfit font-bold text-xl">
                D
              </div>
              <span className="font-outfit font-bold text-xl tracking-tight text-foreground">
                DevStep
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium">
              <Activity className="w-4 h-4" />
              Feed
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium">
              <Map className="w-4 h-4" />
              Roadmap
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium">
              <Users className="w-4 h-4" />
              Team-up
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <div className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
                <User className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
