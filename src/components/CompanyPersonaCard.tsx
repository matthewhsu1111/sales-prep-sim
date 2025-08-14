import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type CompanyPersona } from "@/data/questions";
import { Building2, Rocket, Users } from "lucide-react";

interface CompanyPersonaCardProps {
  persona: CompanyPersona;
  onSelect: (personaId: string) => void;
}

const getPersonaIcon = (personaId: string) => {
  switch (personaId) {
    case 'tech-giant':
      return <Building2 className="h-8 w-8" />;
    case 'startup':
      return <Rocket className="h-8 w-8" />;
    case 'enterprise':
      return <Users className="h-8 w-8" />;
    default:
      return <Building2 className="h-8 w-8" />;
  }
};

export function CompanyPersonaCard({ persona, onSelect }: CompanyPersonaCardProps) {
  return (
    <Card className="h-full bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 hover:scale-[1.02] group">
      <CardHeader className="text-center pb-4">
        <div className={`mx-auto p-3 rounded-full bg-${persona.color}/10 text-${persona.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {getPersonaIcon(persona.id)}
        </div>
        <CardTitle className="text-xl font-semibold">{persona.name}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {persona.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-sm text-foreground mb-2">Culture:</h4>
          <p className="text-sm text-muted-foreground">{persona.culture}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-sm text-foreground mb-2">Interview Style:</h4>
          <p className="text-sm text-muted-foreground">{persona.interviewStyle}</p>
        </div>
        
        <div>
          <h4 className="font-medium text-sm text-foreground mb-2">Focus Areas:</h4>
          <div className="flex flex-wrap gap-1">
            {persona.focusAreas.map((area) => (
              <Badge key={area} variant="secondary" className="text-xs">
                {area}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button 
          variant={persona.color as any} 
          className="w-full mt-6"
          onClick={() => onSelect(persona.id)}
        >
          Start {persona.name} Interview
        </Button>
      </CardContent>
    </Card>
  );
}