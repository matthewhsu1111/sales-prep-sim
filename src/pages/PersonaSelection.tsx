import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanyPersonaCard } from '@/components/CompanyPersonaCard';
import { companyPersonas } from '@/data/questions';
import { ArrowLeft, Users, Target, BookOpen } from 'lucide-react';

export default function PersonaSelection() {
  const navigate = useNavigate();
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersona(personaId);
    // Navigate to interview with selected persona
    navigate(`/interview/${personaId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Choose Your Interview Style
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select the type of company you're interviewing with to get the most realistic practice experience.
            </p>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center bg-gradient-card border-border/50">
            <CardHeader>
              <Users className="h-8 w-8 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">Realistic Personas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI interviewers tailored to different company cultures and interview styles
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-gradient-card border-border/50">
            <CardHeader>
              <Target className="h-8 w-8 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">Focused Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Curated question sets based on real interview patterns and company priorities
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-gradient-card border-border/50">
            <CardHeader>
              <BookOpen className="h-8 w-8 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">Instant Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get detailed analysis and improvement suggestions after each interview
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Persona Selection */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center text-foreground">
            Select Interview Type
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {companyPersonas.map((persona) => (
              <CompanyPersonaCard
                key={persona.id}
                persona={persona}
                onSelect={handlePersonaSelect}
              />
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center">💡 Interview Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Before you start:</strong>
                <ul className="list-disc ml-4 mt-1 space-y-1 text-muted-foreground">
                  <li>Find a quiet space with good internet</li>
                  <li>Test your microphone and audio</li>
                  <li>Have your resume and notes ready</li>
                </ul>
              </div>
              <div>
                <strong>During the interview:</strong>
                <ul className="list-disc ml-4 mt-1 space-y-1 text-muted-foreground">
                  <li>Speak clearly and at a moderate pace</li>
                  <li>Take a moment to think before answering</li>
                  <li>Use specific examples from your experience</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}