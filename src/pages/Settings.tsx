import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Check } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { themes, ThemeId } from '../shared/themes';
import { cn } from '../lib/utils';

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const { currentThemeId, setTheme } = useThemeStore();

  return (
    <div className="flex flex-col h-full bg-background p-6 max-w-4xl mx-auto">
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
          <CardContent>
            <div className="grid gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="font-medium text-sm">Theme</span>
                <span className="text-xs text-muted-foreground mb-2">
                  Select a theme to customize the look and feel of the application.
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {(Object.keys(themes) as ThemeId[]).map((themeId) => {
                    const theme = themes[themeId];
                    return (
                      <div 
                        key={themeId}
                        className={cn(
                          "cursor-pointer rounded-lg border-2 p-1 hover:border-primary transition-all",
                          currentThemeId === themeId ? "border-primary" : "border-transparent"
                        )}
                        onClick={() => setTheme(themeId)}
                      >
                        <div 
                          className="aspect-[4/3] rounded-md border shadow-sm mb-2 overflow-hidden relative"
                          style={{ 
                            background: `hsl(${theme.colors.background})`,
                            color: `hsl(${theme.colors.foreground})` 
                          }}
                        >
                          {/* Mini UI Preview */}
                          <div className="h-2 w-full absolute top-0 left-0 opacity-80" style={{ background: `hsl(${theme.colors.border})` }} />
                          <div className="p-2 pt-4 flex flex-col gap-1">
                             <div className="h-1.5 w-1/2 rounded-full opacity-60" style={{ background: `hsl(${theme.colors.foreground})` }} />
                             <div className="h-1.5 w-3/4 rounded-full opacity-40" style={{ background: `hsl(${theme.colors.foreground})` }} />
                             <div className="mt-1 h-4 w-full rounded border opacity-80 flex items-center justify-center" style={{ borderColor: `hsl(${theme.colors.border})`, background: `hsl(${theme.colors.card})` }}>
                                <span className="text-[6px]">SSH</span>
                             </div>
                             {/* Terminal Preview */}
                             <div className="mt-1 flex-1 rounded p-1 font-mono text-[5px] overflow-hidden leading-tight" style={{ background: theme.terminal.background, color: theme.terminal.foreground }}>
                                $ echo hello<br/>
                                <span style={{ color: theme.terminal.green }}>world</span>
                             </div>
                          </div>
                          
                          {currentThemeId === themeId && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-white/20">
                              <div className="bg-primary text-primary-foreground rounded-full p-1">
                                <Check className="w-3 h-3" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-center text-xs font-medium truncate px-1">
                          {theme.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
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
