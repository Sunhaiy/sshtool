import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Moon, Sun } from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Ideally persist this to electron-store too
    window.electron.storeSet('theme', newTheme);
  };

  return (
    <div className="flex flex-col h-full bg-background p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-medium">Theme Mode</span>
              <span className="text-xs text-muted-foreground">
                Switch between light and dark mode
              </span>
            </div>
            <div className="flex bg-secondary p-1 rounded-lg">
              <Button 
                variant={theme === 'light' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => theme === 'dark' && toggleTheme()}
                className="gap-2"
              >
                <Sun className="w-4 h-4" /> Light
              </Button>
              <Button 
                variant={theme === 'dark' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => theme === 'light' && toggleTheme()}
                className="gap-2"
              >
                <Moon className="w-4 h-4" /> Dark
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              SSH Tool v1.0.0
              <br />
              Powered by Electron, React, and Shadcn UI.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
