import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Share, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const prospects = [
    {
      id: 1,
      name: "Alice Thompson",
      type: "Consumer",
      avatar: "/placeholder.svg",
      category: "Consumer"
    },
    {
      id: 2,
      name: "Sandra Lopez", 
      type: "B2B",
      avatar: "/placeholder.svg",
      category: "B2B"
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Training</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Create custom prospects or use pre-built templates to practice and refine your sales pitch in realistic scenarios.
          </p>
        </div>
        <Button 
          variant="hero" 
          size="lg"
          className="px-6"
          onClick={() => navigate('/dashboard/create-prospect')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Prospect
        </Button>
      </div>

      {/* Other Prospects Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <div className="h-4 w-4 bg-purple-600 rounded"></div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Other Prospects</h2>
            <p className="text-muted-foreground">Specialized training prospects for other industry scenarios</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prospects.map((prospect) => (
            <Card key={prospect.id} className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge 
                    variant="secondary" 
                    className={`$
                      {prospect.category === 'Consumer' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'}`}
                  >
                    {prospect.category}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={prospect.avatar} />
                    <AvatarFallback className="text-lg">
                      {prospect.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-semibold text-foreground">{prospect.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {prospect.type}
                    </Badge>
                  </div>

                  <div className="w-full">
                    <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
                      Training Objectives
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full bg-white/50 hover:bg-white/70"
                      onClick={() => navigate(`/interview/${prospect.id}`)}
                    >
                      Start Session
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Commercial Real Estate Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <div className="h-4 w-4 bg-blue-600 rounded"></div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Commercial Real Estate Prospects</h2>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No commercial real estate prospects yet.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/dashboard/create-prospect?type=commercial')}
          >
            Create Your First Prospect
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
