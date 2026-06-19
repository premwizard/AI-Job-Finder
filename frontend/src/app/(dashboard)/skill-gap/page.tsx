import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  BrainCircuit, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Award,
  AlertCircle,
  Lightbulb
} from "lucide-react";

export default function SkillGapPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Skill Gap Analysis</h2>
        <p className="text-muted-foreground mt-1">
          Based on your target role: <strong className="text-foreground">Senior AI Engineer</strong>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Weekly Progress & Learning Recommendations */}
        <div className="space-y-6">
          {/* Weekly Progress */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Study Goal (10hrs)</span>
                <span className="text-sm font-bold text-primary">7.5 / 10 hrs</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[75%]" />
              </div>
              
              <div className="grid grid-cols-7 gap-1 mt-4">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-full aspect-square rounded-sm ${[0,1,2,3].includes(i) ? 'bg-primary/80' : i === 4 ? 'bg-primary/40' : 'bg-muted'}`} />
                    <span className="text-[10px] text-muted-foreground">{day}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Recommendations */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Learning Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 border border-border/50 text-sm">
                <p className="font-medium flex items-center gap-1.5 mb-1">
                  <BrainCircuit className="w-4 h-4 text-primary" /> Focus on Deployment
                </p>
                <p className="text-muted-foreground leading-relaxed text-xs">
                  Your Python/PyTorch skills are strong. To hit Senior level, you must master ML model serving (TensorRT, ONNX, vLLM).
                </p>
              </div>
              <Button className="w-full text-xs" variant="outline">View Curated Resources</Button>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: Roadmap */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Learning Roadmap
            </CardTitle>
            <CardDescription>
              AI-generated path to master your missing skills
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {roadmapSteps.map((step, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary/20 text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shadow-primary/20 z-10">
                  {step.status === "completed" ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                </div>
                <Card className={`w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] border-border/50 ${step.status === "current" ? "border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.1)]" : "bg-card/30"}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg">{step.skill}</h4>
                      {step.status === "completed" && <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>}
                      {step.status === "current" && <Badge className="bg-primary/10 text-primary border-primary/20">In Progress</Badge>}
                      {step.status === "pending" && <Badge variant="outline" className="text-muted-foreground">Pending</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
                    
                    {step.status === "current" && (
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>45%</span>
                          </div>
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[45%]" />
                          </div>
                        </div>
                        <Button size="sm" className="w-full gap-2 mt-2">
                          Continue Learning <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Current Skills */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-green-500" />
              Current Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1">Python</Badge>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1">PyTorch</Badge>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1">LLMs</Badge>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1">Machine Learning</Badge>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1">NLP</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Missing Skills */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Missing Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/5 px-3 py-1">Docker</Badge>
              <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/5 px-3 py-1">Kubernetes</Badge>
              <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/5 px-3 py-1">AWS SageMaker</Badge>
              <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/5 px-3 py-1">System Design</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Skills */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Recommended Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1">vLLM</Badge>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1">LangChain</Badge>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1">TensorRT</Badge>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1">RAG Architecture</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const roadmapSteps = [
  {
    id: 1,
    skill: "Git & Version Control",
    description: "Mastered branch management and collaboration workflows.",
    status: "completed"
  },
  {
    id: 2,
    skill: "Docker",
    description: "Containerizing ML models for consistent deployment across environments. Essential for 80% of targeted roles.",
    status: "current"
  },
  {
    id: 3,
    skill: "Kubernetes",
    description: "Orchestrating containerized ML applications at scale. Next logical step after Docker.",
    status: "pending"
  },
  {
    id: 4,
    skill: "AWS / Cloud Infrastructure",
    description: "Deploying and managing scalable ML systems on cloud providers (SageMaker, EC2).",
    status: "pending"
  }
];
