import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Filter, Calendar } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const InterviewHistory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [interviewTypeFilter, setInterviewTypeFilter] = useState<string>("all");
  const [scoreRange, setScoreRange] = useState<number[]>([0, 100]);

  useEffect(() => {
    fetchInterviews();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [interviews, interviewTypeFilter, scoreRange]);

  const fetchInterviews = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to view interview history",
          variant: "destructive"
        });
        navigate('/signin');
        return;
      }

      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching interviews:', error);
        toast({
          title: "Error",
          description: "Failed to load interview history",
          variant: "destructive"
        });
        return;
      }

      setInterviews(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...interviews];

    // Filter by interview type
    if (interviewTypeFilter !== "all") {
      filtered = filtered.filter(interview => 
        interview.interview_type === interviewTypeFilter
      );
    }

    // Filter by score range
    filtered = filtered.filter(interview => 
      interview.overall_score >= scoreRange[0] && 
      interview.overall_score <= scoreRange[1]
    );

    setFilteredInterviews(filtered);
  };

  const handleViewDetails = (interview: any) => {
    navigate('/dashboard/interview-results', {
      state: {
        interviewData: {
          interviewer: interview.interviewer_name,
          interviewType: interview.interview_type,
          transcript: interview.transcript,
          jobPosting: interview.job_posting
        },
        savedFeedback: {
          overallScore: interview.overall_score,
          strengths: interview.strengths,
          weaknesses: interview.weaknesses,
          improvements: interview.improvements,
          detailedScores: interview.scores,
          overallFeedback: `Interview completed with a score of ${interview.overall_score}/100`
        }
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const uniqueInterviewTypes = Array.from(
    new Set(interviews.map(i => i.interview_type))
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Interview History</h1>
        <p className="text-muted-foreground mt-2">
          View all your past interviews and track your progress
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Interview Type Filter */}
            <div className="space-y-2">
              <Label>Interview Type</Label>
              <Select value={interviewTypeFilter} onValueChange={setInterviewTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueInterviewTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Score Range Filter */}
            <div className="space-y-2">
              <Label>Score Range: {scoreRange[0]} - {scoreRange[1]}</Label>
              <Slider
                min={0}
                max={100}
                step={5}
                value={scoreRange}
                onValueChange={setScoreRange}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredInterviews.length} {filteredInterviews.length === 1 ? 'Interview' : 'Interviews'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredInterviews.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">No interviews found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {interviews.length === 0 
                  ? "Start practicing with our AI interviewer to build your history."
                  : "Try adjusting your filters to see more results."
                }
              </p>
              {interviews.length === 0 && (
                <Button onClick={() => navigate('/dashboard/interview-roleplay')}>
                  Start Interview Practice
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Interviewer</TableHead>
                    <TableHead>Interview Type</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInterviews.map((interview) => (
                    <TableRow 
                      key={interview.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewDetails(interview)}
                    >
                      <TableCell className="font-medium">
                        {formatDate(interview.created_at)}
                      </TableCell>
                      <TableCell>{interview.interviewer_name}</TableCell>
                      <TableCell>{interview.interview_type}</TableCell>
                      <TableCell>
                        <Badge variant={getScoreBadgeVariant(interview.overall_score)}>
                          {interview.overall_score}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(interview);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewHistory;
