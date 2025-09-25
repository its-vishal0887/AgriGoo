"use client";

import { useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { AgriGooLogo } from "@/components/agrigoo-logo";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, User, Bell, Activity, ShieldAlert, CloudSun, Map, Sprout, ChevronRight, History, Image as ImageIcon, Flame, AlertTriangle, Layers, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import dynamic from 'next/dynamic'

// Dynamically import the map component with SSR disabled
const OutbreakMap = dynamic(
  () => import('@/components/outbreak-map'),
  { ssr: false }
);
import ClimateForecast from "@/components/climate-forecast";
import { useDashboard } from "@/components/dashboard-context";

export default function DashboardPage() {
  const { addOutbreak, pushAlert, setRecommendations, userPrefs, outbreaks } = useDashboard();
  const [activeTab, setActiveTab] = useState("diagnosis");
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<string>("");
  const [severity, setSeverity] = useState<number>(50);
  const [heatmap, setHeatmap] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentResult, setCurrentResult] = useState<null | { disease: string; confidence: number; severity: "Low" | "Medium" | "High" }>(null);
  const [history, setHistory] = useState<Array<{ timestamp: string; disease: string; confidence: number }>>([
    { timestamp: "Today, 10:24", disease: "Powdery Mildew", confidence: 0.92 },
    { timestamp: "Yesterday, 18:05", disease: "Leaf Spot", confidence: 0.71 },
    { timestamp: "Mon, 14:17", disease: "Rust", confidence: 0.28 },
  ]);
  const [showRecommendations, setShowRecommendations] = useState<boolean>(true);

  const progressStages = ["Uploading", "Analyzing", "Processing", "Results"] as const;
  type Stage = typeof progressStages[number];
  const currentStage: Stage = analysisProgress < 25 ? "Uploading" : analysisProgress < 60 ? "Analyzing" : analysisProgress < 100 ? "Processing" : "Results";
  const [tabLoading, setTabLoading] = useState(false);

  function simulateAnalysis() {
    setUploading(true);
    setAnalysisProgress(0);
    const id = setInterval(() => {
      setAnalysisProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          setUploading(false);
          const simulatedConfidence = 0.87;
          const simulatedDisease = "Powdery Mildew";
          const sev: "Low" | "Medium" | "High" = simulatedConfidence > 0.8 ? "High" : simulatedConfidence > 0.5 ? "Medium" : "Low";
          setCurrentResult({ disease: simulatedDisease, confidence: simulatedConfidence, severity: sev });
          const time = new Date().toLocaleString([], { hour: "2-digit", minute: "2-digit" });
          setHistory((h) => [{ timestamp: `Today, ${time}`, disease: simulatedDisease, confidence: simulatedConfidence }, ...h].slice(0, 10));
          // Add to shared outbreaks with a dummy location (could be replaced by device GPS)
          addOutbreak({ lat: 18.52, lng: 73.86, disease: simulatedDisease, severity: Math.round(simulatedConfidence * 10), status: "active" });
          // Set diagnosis-related recommendations influenced by climate
          setRecommendations([
            "Apply sulfur-based fungicide in early morning",
            "Improve air circulation and avoid overhead irrigation",
            "Monitor infected area for 72 hours",
          ]);
          // Push alert that will be visible across tabs
          pushAlert({ type: "warning", message: `${simulatedDisease} detected. Review map and forecast for spread risk.` });
          return 100;
        }
        return p + 10;
      });
    }, 300);
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const previews: string[] = [];
    Array.from(files).forEach((file) => {
      const isImage = /image\/(jpeg|png|webp)/.test(file.type);
      const underLimit = file.size <= 10 * 1024 * 1024;
      if (isImage && underLimit) {
        const url = URL.createObjectURL(file);
        previews.push(url);
      } else {
        setErrorMessage("Only JPG, PNG, WebP up to 10MB are supported.");
      }
    });
    if (previews.length) {
      setUploadedImages((prev) => [...previews, ...prev].slice(0, 9));
      setErrorMessage("");
    }
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  }

  function onDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave() {
    setIsDragging(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AgriGooLogo size="md" />
            <div>
              <h1 className="text-2xl font-bold">AgriGoo Dashboard</h1>
              <p className="text-sm text-muted-foreground">Complete crop health management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
          </div>
        </div>

        {/* QUICK STATS + WEATHER */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Farm Health Score</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <span className="text-3xl font-bold text-primary">92</span>
              <Activity className="h-6 w-6 text-primary/50" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <span className="text-3xl font-bold text-amber-600">3</span>
              <ShieldAlert className="h-6 w-6 text-amber-500" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Today's Scans</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <span className="text-3xl font-bold text-green-600">18</span>
              <Sprout className="h-6 w-6 text-green-500" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Weather</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm">
              <div>
                <div className="text-xl font-semibold">31°C</div>
                <div className="text-muted-foreground">Partly Cloudy</div>
              </div>
              <Badge className={userPrefs?.climateRisk === "Very High" ? "bg-red-100 text-red-800" : userPrefs?.climateRisk === "High" ? "bg-amber-100 text-amber-800" : userPrefs?.climateRisk === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}>{String(userPrefs?.climateRisk || "Low")}</Badge>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* SIDEBAR */}
          <aside className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full"><Upload className="h-4 w-4 mr-2" /> New Disease Scan</Button>
                <Button variant="outline" className="w-full"><Sprout className="h-4 w-4 mr-2" /> Soil Test</Button>
                <Button variant="outline" className="w-full"><CloudSun className="h-4 w-4 mr-2" /> Check Forecast</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Farm Overview</CardTitle>
                <CardDescription>Acres: 45 • Plots: 6</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Soil Health</span><Badge>Good</Badge></div>
                <div className="flex justify-between"><span>Water Resources</span><Badge>Adequate</Badge></div>
                <div className="flex justify-between"><span>Pest Risk</span><Badge className="bg-amber-100 text-amber-800">Moderate</Badge></div>
                <Separator className="my-2" />
                <Link href="/soil-health" className="flex items-center text-primary text-xs">View detailed soil report <ChevronRight className="h-3 w-3 ml-1" /></Link>
              </CardContent>
            </Card>
          </aside>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-4 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="diagnosis">Disease Diagnosis</TabsTrigger>
                <TabsTrigger value="map">Outbreak Map</TabsTrigger>
                <TabsTrigger value="forecast">Climate Forecast</TabsTrigger>
              </TabsList>

              <TabsContent value="diagnosis" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Plant Disease Diagnosis</CardTitle>
                    <CardDescription>Upload leaf images for instant disease detection</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* UPLOAD AREA */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"}`}
                      onDrop={onDrop}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="rounded-full bg-primary/10 p-3">
                          <ImageIcon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium">Drag & drop leaf images</h3>
                        <p className="text-sm text-muted-foreground">or click to browse files</p>
                        <Input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          id="image-upload"
                          onChange={(e) => handleFiles(e.target.files)}
                        />
                        <Button size="sm" onClick={() => document.getElementById("image-upload")?.click()}>
                          Select Images
                        </Button>
                        <p className="text-xs text-muted-foreground">JPG, PNG, WebP up to 10MB</p>
                      </div>
                    </div>

                    {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

                    {/* UPLOADED IMAGES */}
                    {uploadedImages.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Uploaded Images</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {uploadedImages.map((url, i) => (
                            <div key={i} className="relative aspect-square rounded-md overflow-hidden border">
                              <img src={url} alt={`Uploaded ${i + 1}`} className="object-cover w-full h-full" />
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => setUploadedImages((prev) => prev.filter((_, idx) => idx !== i))}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUploadedImages([])}
                            className="text-xs"
                          >
                            Clear All
                          </Button>
                          <Button
                            onClick={simulateAnalysis}
                            disabled={uploading}
                            className="text-xs"
                          >
                            {uploading ? "Analyzing..." : "Analyze Images"}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* ANALYSIS PROGRESS */}
                    {uploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{currentStage}</span>
                          <span>{analysisProgress}%</span>
                        </div>
                        <Progress value={analysisProgress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          {progressStages.map((stage, i) => (
                            <span key={stage} className={currentStage === stage ? "text-primary font-medium" : ""}>
                              {stage}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* RESULTS */}
                    {currentResult && !uploading && (
                      <div className="space-y-4 pt-2">
                        <Separator />
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium">{currentResult.disease}</h3>
                            <p className="text-sm text-muted-foreground">
                              Confidence: {Math.round(currentResult.confidence * 100)}% • Severity: {currentResult.severity}
                            </p>
                          </div>
                          <Badge className={
                            currentResult.severity === "High" ? "bg-red-100 text-red-800" :
                              currentResult.severity === "Medium" ? "bg-amber-100 text-amber-800" :
                                "bg-yellow-100 text-yellow-800"
                          }>
                            {currentResult.severity}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Recommendations</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Show</span>
                              <Switch checked={showRecommendations} onCheckedChange={setShowRecommendations} />
                            </div>
                          </div>

                          {showRecommendations && (
                            <div className="space-y-2 rounded-md bg-muted/50 p-3">
                              <ul className="space-y-1 text-sm">
                                {["Apply sulfur-based fungicide in early morning", "Improve air circulation and avoid overhead irrigation", "Monitor infected area for 72 hours"].map((rec, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-primary mt-0.5">•</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="flex justify-end">
                                <Button variant="ghost" size="sm" className="text-xs">
                                  <Download className="h-3 w-3 mr-1" /> Save Report
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* HISTORY */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Scans</CardTitle>
                      <History className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {history.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${item.confidence > 0.7 ? "bg-red-500" : item.confidence > 0.4 ? "bg-amber-500" : "bg-green-500"}`} />
                            <span>{item.disease}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="font-normal">
                              {Math.round(item.confidence * 100)}%
                            </Badge>
                            <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="map" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Disease Outbreak Map</CardTitle>
                    <CardDescription>Regional disease spread and risk assessment</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="aspect-video relative overflow-hidden rounded-b-lg">
                      <OutbreakMap outbreaks={outbreaks} showHeatmap={heatmap} />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Regional Risk</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center justify-between"><span>North</span><Badge className="bg-green-100 text-green-800">Low</Badge></div>
                      <div className="flex items-center justify-between"><span>Central</span><Badge className="bg-amber-100 text-amber-800">Moderate</Badge></div>
                      <div className="flex items-center justify-between"><span>South</span><Badge className="bg-red-100 text-red-800">High</Badge></div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Active Outbreaks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Powdery Mildew</span>
                        <Badge className="bg-red-100 text-red-800">12</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Leaf Spot</span>
                        <Badge className="bg-amber-100 text-amber-800">8</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Rust</span>
                        <Badge className="bg-green-100 text-green-800">3</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Map Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Heatmap</span>
                        <Switch checked={heatmap} onCheckedChange={setHeatmap} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Disease Filter</span>
                          <span className="text-xs text-muted-foreground">{selectedDisease || "All"}</span>
                        </div>
                        <Select value={selectedDisease} onValueChange={setSelectedDisease}>
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="All Diseases" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Diseases</SelectItem>
                            <SelectItem value="powdery-mildew">Powdery Mildew</SelectItem>
                            <SelectItem value="leaf-spot">Leaf Spot</SelectItem>
                            <SelectItem value="rust">Rust</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="forecast" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Climate Forecast</CardTitle>
                    <CardDescription>7-day forecast with disease risk assessment</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="aspect-video relative overflow-hidden rounded-b-lg">
                      <ClimateForecast />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Disease Risk Factors</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Temperature</span>
                          <span className="text-sm text-muted-foreground">31°C (High Risk)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Flame className="h-4 w-4 text-red-500" />
                          <Progress value={85} className="h-2" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Humidity</span>
                          <span className="text-sm text-muted-foreground">78% (Very High Risk)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <Progress value={95} className="h-2" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Rainfall</span>
                          <span className="text-sm text-muted-foreground">12mm (Moderate Risk)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-amber-500" />
                          <Progress value={60} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Preventive Measures</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Recommended Actions</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Apply preventive fungicide before forecasted rain</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Increase plant spacing to improve air circulation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Schedule irrigation for early morning to reduce leaf wetness duration</span>
                          </li>
                        </ul>
                      </div>

                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm" className="text-xs">
                          <Download className="h-3 w-3 mr-1" /> Download Full Report
                        </Button>
                        <Button size="sm" className="text-xs">
                          Set Alerts
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}


