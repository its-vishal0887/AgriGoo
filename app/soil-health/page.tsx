"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, Flask, LineChart, Leaf, Calendar, AlertCircle } from "lucide-react"
import { MLService, SoilHealthAnalysis } from "../../lib/ml-service"
import { dataService, SensorData } from "../../lib/data-service"
import { toast } from "sonner"

export default function SoilHealthPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [activeSection, setActiveSection] = useState("upload")
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [soilData, setSoilData] = useState<SoilHealthAnalysis | null>(null)
  const [sensorData, setSensorData] = useState<SensorData | null>(null)
  
  // Initialize ML service
  const mlService = new MLService()
  
  // Initialize data service and subscribe to real-time updates
  useEffect(() => {
    // In a real app, you would get these from auth context or user settings
    const mockToken = "mock-auth-token";
    const mockFarmId = "farm-123";
    
    dataService.initialize(mockToken, mockFarmId);
    
    // Subscribe to sensor data updates
    dataService.onScanUpdate((data) => {
      if (data.type === 'soil') {
        toast("Soil Data Update", {
          description: `New soil analysis data available`,
        });
        
        // Update sensor data if available
        if (data.sensorData) {
          setSensorData(data.sensorData);
        }
      }
    });
    
    return () => {
      dataService.disconnect();
    };
  }, [toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Convert to base64 for API submission
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageBase64(base64String.split(',')[1]); // Remove data URL prefix
      };
      reader.readAsDataURL(file);
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      
      // Convert to base64 for API submission
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageBase64(base64String.split(',')[1]); // Remove data URL prefix
      };
      reader.readAsDataURL(file);
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile || !imageBase64) return
    
    setIsAnalyzing(true)
    setActiveSection("results")
    
    try {
      // Call ML service for soil health analysis
      const soilHealthResult = await mlService.analyzeSoilHealth(imageBase64);
      
      // Update state with results
      setSoilData(soilHealthResult);
      
      // Send data to real-time service
      await dataService.sendImageScan(imageBase64, undefined, {
        type: 'soil',
        filename: selectedFile.name,
        timestamp: new Date().toISOString()
      }).catch(error => {
        console.error("Error sending soil scan:", error);
      });
      
      setAnalysisComplete(true);
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not complete the soil health analysis. Please try again.",
        variant: "destructive",
      });
      
      // Fallback to mock data
      setMockSoilData();
    } finally {
      setIsAnalyzing(false);
    }
  }
  
  const setMockSoilData = () => {
    const mockData: SoilHealthAnalysis = {
      pH: 6.5,
      nitrogen: 45,
      phosphorus: 32,
      potassium: 67,
      organicMatter: 3.2,
      healthScore: 78,
      deficiencies: ["Minor nitrogen deficiency"],
      recommendations: [
        "Apply nitrogen-rich fertilizer",
        "Consider adding organic matter to improve soil structure",
        "Monitor pH levels regularly"
      ]
    };
    
    setSoilData(mockData);
    setAnalysisComplete(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* HERO SECTION */}
      <section className="relative py-16 px-4 overflow-hidden bg-gradient-to-r from-green-900 to-green-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/placeholder.jpg')] bg-cover bg-center" />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Soil Health Analysis</h1>
            <p className="text-xl md:text-2xl max-w-3xl mb-8">
              Upload your soil test report and get instant fertilizer recommendations
            </p>
            <Button 
              size="lg" 
              className="bg-white text-green-800 hover:bg-green-100 font-bold text-lg px-8 py-6"
              onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Analyze Soil Report
            </Button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Step 1: Upload Soil Test Image</h3>
              <p className="text-gray-600">
                Upload your lab report, color chart, or test strip photos for analysis
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Step 2: AI Nutrient Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes your soil's nutrient levels, pH, and overall health
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Step 3: Get Fertilizer Plan</h3>
              <p className="text-gray-600">
                Receive customized fertilizer recommendations and soil improvement strategies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UPLOAD INTERFACE */}
      <section id="upload-section" className="py-16 px-4 bg-green-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-8">Upload Your Soil Test</h2>
          
          <Card className="border-2 border-green-100 shadow-lg">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-800">Upload Soil Test Report</CardTitle>
              <CardDescription>
                Drag and drop or select your soil test report or sample image
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-500'
                } transition-colors duration-200 cursor-pointer`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-lg font-medium text-gray-700 mb-1">
                    {isDragging ? 'Drop your file here' : 'Drag & drop your file or click to browse'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Supported: Lab reports, color charts, test strip photos
                  </p>
                  <input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*,.pdf" 
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {selectedFile && (
                <div className="mt-4 bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">
                      File selected: <span className="text-green-700">{selectedFile.name}</span>
                    </p>
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-green-800">Analyzing soil sample...</p>
                    <span className="text-sm text-green-800">{Math.floor(Math.random() * 30) + 40}%</span>
                  </div>
                  <Progress value={45} className="h-2 bg-green-100" indicatorClassName="bg-green-600" />
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-green-50 border-t border-green-100">
              <Button 
                className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 text-lg" 
                onClick={handleAnalyze}
                disabled={!selectedFile || isAnalyzing}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Soil Sample"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* ANALYSIS RESULTS */}
      {analysisComplete && (
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center text-green-800 mb-8">Soil Analysis Results</h2>
            
            <Card className="border-2 border-green-100 shadow-lg mb-12">
              <CardHeader className="bg-green-50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-green-800">Soil Health Score</CardTitle>
                    <CardDescription>
                      Overall assessment of your soil's health
                    </CardDescription>
                  </div>
                  <div className="w-24 h-24 rounded-full bg-green-100 border-4 border-green-600 flex items-center justify-center">
                    <span className="text-3xl font-bold text-green-800">72</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Soil Type</Label>
                    <div className="font-medium text-lg">Clay Loam</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">pH Level</Label>
                    <div className="flex items-center">
                      <div className="font-medium text-lg mr-2">6.8</div>
                      <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Slightly Acidic</span>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="font-semibold text-lg text-green-800 mb-4">Nutrient Levels (N-P-K)</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-gray-700 font-medium">Nitrogen (N)</Label>
                        <span className="text-amber-600 font-medium">Medium (42%)</span>
                      </div>
                      <div className="h-8 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full flex items-center justify-end pr-2 text-white font-medium"
                          style={{ width: '42%' }}
                        >
                          42%
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Adequate for most crops, but consider nitrogen-fixing cover crops
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-gray-700 font-medium">Phosphorus (P)</Label>
                        <span className="text-red-600 font-medium">Low (18%)</span>
                      </div>
                      <div className="h-8 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500 rounded-full flex items-center justify-end pr-2 text-white font-medium"
                          style={{ width: '18%' }}
                        >
                          18%
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Deficiency warning: Phosphorus levels are critically low</span>
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-gray-700 font-medium">Potassium (K)</Label>
                        <span className="text-green-600 font-medium">High (78%)</span>
                      </div>
                      <div className="h-8 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full flex items-center justify-end pr-2 text-white font-medium"
                          style={{ width: '78%' }}
                        >
                          78%
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Excellent potassium levels, no supplementation needed
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* FERTILIZER RECOMMENDATIONS */}
            <h2 className="text-3xl font-bold text-center text-green-800 mb-8">Fertilizer Recommendations</h2>
            
            <Card className="border-2 border-green-100 shadow-lg mb-12">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-800">Custom Fertilizer Blend</CardTitle>
                <CardDescription>
                  Tailored recommendations based on your soil analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-800 mb-3">Organic Option</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <div>
                            <span className="font-medium">Bone Meal</span>
                            <p className="text-sm text-gray-600">4 kg per acre for phosphorus</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <div>
                            <span className="font-medium">Rock Phosphate</span>
                            <p className="text-sm text-gray-600">10 kg per acre (slow release)</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <div>
                            <span className="font-medium">Compost</span>
                            <p className="text-sm text-gray-600">2 tons per acre for overall soil health</p>
                          </div>
                        </li>
                      </ul>
                      <div className="mt-4 pt-4 border-t border-green-200">
                        <p className="font-semibold text-green-800">Cost: ₹2,800/acre</p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-800 mb-3">Chemical Option</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <div>
                            <span className="font-medium">NPK 20-30-10</span>
                            <p className="text-sm text-gray-600">75 kg per acre (phosphorus-rich blend)</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <div>
                            <span className="font-medium">Single Super Phosphate</span>
                            <p className="text-sm text-gray-600">50 kg per acre</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <div>
                            <span className="font-medium">Micronutrient Mix</span>
                            <p className="text-sm text-gray-600">5 kg per acre</p>
                          </div>
                        </li>
                      </ul>
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <p className="font-semibold text-blue-800">Cost: ₹1,950/acre</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-green-800 mb-4">Application Timing</h3>
                    <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                      <div className="grid grid-cols-3 divide-x divide-gray-200">
                        <div className="p-4 text-center">
                          <div className="text-green-800 font-semibold mb-1">Initial</div>
                          <div className="text-sm text-gray-600">Before planting</div>
                          <div className="mt-2 text-xs bg-green-100 text-green-800 rounded-full px-2 py-1 inline-block">Now</div>
                        </div>
                        <div className="p-4 text-center">
                          <div className="text-green-800 font-semibold mb-1">Second</div>
                          <div className="text-sm text-gray-600">Early growth stage</div>
                          <div className="mt-2 text-xs bg-yellow-100 text-yellow-800 rounded-full px-2 py-1 inline-block">After 4 weeks</div>
                        </div>
                        <div className="p-4 text-center">
                          <div className="text-green-800 font-semibold mb-1">Final</div>
                          <div className="text-sm text-gray-600">Pre-flowering</div>
                          <div className="mt-2 text-xs bg-orange-100 text-orange-800 rounded-full px-2 py-1 inline-block">After 8 weeks</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* SOIL IMPROVEMENT */}
            <h2 className="text-3xl font-bold text-center text-green-800 mb-8">Soil Improvement Plan</h2>
            
            <Card className="border-2 border-green-100 shadow-lg">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-800">Long-Term Enhancement Strategies</CardTitle>
                <CardDescription>
                  Sustainable approaches to improve your soil health over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-green-800 mb-3">Natural Amendments</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Green manure crops (clover, alfalfa)</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Vermicompost for microbial activity</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Biochar for carbon sequestration</span>
                        </li>
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Gypsum for clay soil structure</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-green-800 mb-3">Crop Rotation Plan</h3>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="space-y-3">
                          <div>
                            <p className="font-medium">Year 1: Legumes</p>
                            <p className="text-sm text-gray-600">Beans, peas (nitrogen fixation)</p>
                          </div>
                          <div>
                            <p className="font-medium">Year 2: Leafy Greens</p>
                            <p className="text-sm text-gray-600">Cabbage, spinach (phosphorus utilization)</p>
                          </div>
                          <div>
                            <p className="font-medium">Year 3: Root Crops</p>
                            <p className="text-sm text-gray-600">Potatoes, carrots (soil structure)</p>
                          </div>
                          <div>
                            <p className="font-medium">Year 4: Grains</p>
                            <p className="text-sm text-gray-600">Corn, wheat (nutrient cycling)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-green-800 mb-4">Seasonal Care Calendar</h3>
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
                        <div className="p-4">
                          <div className="text-green-800 font-semibold mb-2">Spring</div>
                          <ul className="text-sm space-y-1">
                            <li>• Apply compost</li>
                            <li>• Test soil pH</li>
                            <li>• Add phosphorus</li>
                          </ul>
                        </div>
                        <div className="p-4">
                          <div className="text-green-800 font-semibold mb-2">Summer</div>
                          <ul className="text-sm space-y-1">
                            <li>• Mulch heavily</li>
                            <li>• Monitor moisture</li>
                            <li>• Side-dress crops</li>
                          </ul>
                        </div>
                        <div className="p-4">
                          <div className="text-green-800 font-semibold mb-2">Fall</div>
                          <ul className="text-sm space-y-1">
                            <li>• Plant cover crops</li>
                            <li>• Add organic matter</li>
                            <li>• Retest soil</li>
                          </ul>
                        </div>
                        <div className="p-4">
                          <div className="text-green-800 font-semibold mb-2">Winter</div>
                          <ul className="text-sm space-y-1">
                            <li>• Plan rotations</li>
                            <li>• Order amendments</li>
                            <li>• Maintain drainage</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  )
}