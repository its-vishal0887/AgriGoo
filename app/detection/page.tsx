"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import {
  Upload,
  Camera,
  Brain,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Shield,
  TrendingUp,
  Clock,
  FileImage,
  AlertCircle,
} from "lucide-react"
import { MLService, DetectionResult } from "@/lib/ml-service"
import { dataService } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"

interface AnalysisResult {
  disease: string
  confidence: number
  severity: "low" | "medium" | "high"
  description: string
  treatment: string[]
  prevention: string[]
  nextSteps: string[]
}

export default function DetectionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const { toast } = useToast()
  
  // Initialize ML service
  const mlService = new MLService()
  
  // Initialize data service for real-time updates
  useEffect(() => {
    // In a real app, you would get these from auth context or user settings
    const mockToken = "mock-auth-token";
    const mockFarmId = "farm-123";
    const mockRegionId = "region-456";
    
    dataService.initialize(mockToken, mockFarmId, mockRegionId);
    
    // Subscribe to scan updates
    dataService.onScanUpdate((data) => {
      toast({
        title: "Scan Update",
        description: `New scan results available: ${data.status}`,
        variant: "default",
      });
    });
    
    return () => {
      dataService.disconnect();
    };
  }, [toast]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WebP image.",
        variant: "destructive",
      })
      return
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB.",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    
    // Convert to base64 for API submission
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setImageBase64(base64String.split(',')[1]) // Remove data URL prefix
    }
    reader.readAsDataURL(file)
  }

  const startAnalysis = async () => {
    if (!selectedFile || !imageBase64) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setResult(null)
    setCurrentStep("Uploading")

    try {
      // Update progress as we go
      setAnalysisProgress(25)
      setCurrentStep("Analyzing")
      
      // Call ML service for disease detection
      const detectionResult = await mlService.detectDisease(imageBase64)
      
      setAnalysisProgress(75)
      setCurrentStep("Processing")
      
      // Send the image scan to the data service for real-time updates
      const location = { lat: 40.7128, lng: -74.0060 } // Example location - in real app would use geolocation
      await dataService.sendImageScan(imageBase64, location, {
        filename: selectedFile.name,
        fileType: selectedFile.type,
        timestamp: new Date().toISOString()
      }).catch(error => {
        console.error("Error sending image scan:", error)
        // Continue with analysis even if real-time update fails
      })
      
      setAnalysisProgress(90)
      
      // Map the detection result to our UI model
      const analysisResult: AnalysisResult = {
        disease: detectionResult.diseaseName,
        confidence: detectionResult.confidence,
        severity: mapSeverity(detectionResult.confidence),
        description: detectionResult.description || 
          "This disease affects plant health and yield. Early detection and treatment is recommended.",
        treatment: detectionResult.treatments || [
          "Apply appropriate fungicide or treatment specific to this disease",
          "Remove and destroy affected plant parts",
          "Improve air circulation around plants",
          "Water at soil level to avoid wetting leaves",
        ],
        prevention: detectionResult.preventions || [
          "Use disease-resistant varieties when possible",
          "Rotate crops annually to break disease cycle",
          "Maintain proper plant spacing for air circulation",
          "Apply mulch to prevent soil splash onto leaves",
          "Monitor plants regularly for early detection",
        ],
        nextSteps: [
          "Begin treatment within 24 hours for best results",
          "Monitor plant response after 1 week of treatment",
          "Consider soil testing for nutrient deficiencies",
          "Schedule follow-up analysis in 2 weeks",
        ],
      }
      
      setAnalysisProgress(100)
      setCurrentStep("Results")
      setResult(analysisResult)
    } catch (error) {
      console.error("Analysis error:", error)
      toast({
        title: "Analysis Failed",
        description: "Could not complete the disease detection. Please try again.",
        variant: "destructive",
      })
      
      // Fallback to mock data if ML service fails
      fallbackToMockResult()
    } finally {
      setIsAnalyzing(false)
    }
  }
  
  // Map confidence score to severity level
  const mapSeverity = (confidence: number): "low" | "medium" | "high" => {
    if (confidence < 70) return "low"
    if (confidence < 90) return "medium"
    return "high"
  }
  
  // Fallback to mock data if ML service fails
  const fallbackToMockResult = () => {
    const mockResult: AnalysisResult = {
      disease: "Early Blight (Alternaria solani)",
      confidence: 94.7,
      severity: "medium",
      description:
        "Early blight is a common fungal disease affecting tomato and potato plants. It typically appears as dark, concentric rings on older leaves and can spread rapidly in warm, humid conditions.",
      treatment: [
        "Apply copper-based fungicide spray every 7-10 days",
        "Remove and destroy affected leaves immediately",
        "Improve air circulation around plants",
        "Water at soil level to avoid wetting leaves",
      ],
      prevention: [
        "Use disease-resistant varieties when possible",
        "Rotate crops annually to break disease cycle",
        "Maintain proper plant spacing for air circulation",
        "Apply mulch to prevent soil splash onto leaves",
        "Monitor plants regularly for early detection",
      ],
      nextSteps: [
        "Begin treatment within 24 hours for best results",
        "Monitor plant response after 1 week of treatment",
        "Consider soil testing for nutrient deficiencies",
        "Schedule follow-up analysis in 2 weeks",
      ],
    }
    
    setResult(mockResult)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "low":
        return <CheckCircle className="h-4 w-4" />
      case "medium":
        return <AlertTriangle className="h-4 w-4" />
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            AI Crop Disease Detection
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Upload an image of your crop to get instant disease diagnosis and treatment recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Upload Section */}
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Upload className="h-5 w-5 text-primary" />
                  <span>Upload Crop Image</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all duration-200 ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 hover:border-primary/60 hover:bg-primary/5"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="space-y-3 sm:space-y-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>

                    <div>
                      <p className="text-base sm:text-lg font-medium text-gray-900 mb-2">Upload crop or leaf image</p>
                      <p className="text-sm text-gray-500 mb-3 sm:mb-4 px-2">
                        Drag and drop your image here, or click to browse
                      </p>
                      <p className="text-xs text-gray-400">Supported formats: JPG, PNG, WebP (max 10MB)</p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-transparent min-h-[44px]"
                      >
                        <FileImage className="h-4 w-4" />
                        <span>Browse Files</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 md:hidden bg-transparent min-h-[44px]"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Take Photo</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {selectedFile && (
                  <div className="mt-4 sm:mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileImage className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-primary truncate">{selectedFile.name}</p>
                          <p className="text-sm text-primary/70">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button
                        onClick={startAnalysis}
                        disabled={isAnalyzing}
                        className="w-full sm:w-auto bg-primary hover:bg-primary/90 min-h-[44px]"
                      >
                        {isAnalyzing ? "Analyzing..." : "Start Analysis"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Image Preview */}
            {previewUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Image Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Crop preview"
                      className="w-full h-48 sm:h-64 object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Analysis & Results Section */}
          <div className="space-y-4 sm:space-y-6">
            {/* Analysis Progress */}
            {isAnalyzing && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-pulse">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <span>AI Analysis in Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{currentStep}</span>
                    <span className="text-muted-foreground">{Math.round(analysisProgress)}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />

                  <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-center sm:space-x-6 gap-2 sm:gap-0 text-xs sm:text-sm text-muted-foreground pt-4">
                    <div
                      className={`flex items-center space-x-2 ${currentStep === "Uploading" ? "text-primary font-medium" : ""}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${analysisProgress > 0 ? "bg-primary" : "bg-gray-300"}`} />
                      <span>Uploading</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${currentStep === "Analyzing" ? "text-primary font-medium" : ""}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${analysisProgress > 25 ? "bg-primary" : "bg-gray-300"}`} />
                      <span>Analyzing</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${currentStep === "Processing" ? "text-primary font-medium" : ""}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${analysisProgress > 50 ? "bg-primary" : "bg-gray-300"}`} />
                      <span>Processing</span>
                    </div>
                    <div
                      className={`flex items-center space-x-2 ${currentStep === "Results" ? "text-primary font-medium" : ""}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${analysisProgress > 75 ? "bg-primary" : "bg-gray-300"}`} />
                      <span>Results</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Display */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="text-lg sm:text-xl">Analysis Complete</span>
                    </div>
                    <Badge variant="secondary" className="text-base sm:text-lg px-3 py-1 w-fit">
                      {result.confidence}% Confidence
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Disease Identification */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground">{result.disease}</h3>
                      <Badge className={`${getSeverityColor(result.severity)} flex items-center space-x-1 w-fit`}>
                        {getSeverityIcon(result.severity)}
                        <span className="capitalize">{result.severity} Severity</span>
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{result.description}</p>
                  </div>

                  {/* Detailed Information Tabs */}
                  <Tabs defaultValue="treatment" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-auto">
                      <TabsTrigger
                        value="treatment"
                        className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm"
                      >
                        <Zap className="h-4 w-4" />
                        <span>Treatment</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="prevention"
                        className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm"
                      >
                        <Shield className="h-4 w-4" />
                        <span>Prevention</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="next-steps"
                        className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-3 text-xs sm:text-sm"
                      >
                        <TrendingUp className="h-4 w-4" />
                        <span>Next Steps</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="treatment" className="space-y-3">
                      <h4 className="font-semibold text-foreground mb-3 text-base sm:text-lg">Recommended Treatment</h4>
                      <div className="space-y-2">
                        {result.treatment.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/20"
                          >
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs font-bold">{index + 1}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-primary/90">{item}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="prevention" className="space-y-3">
                      <h4 className="font-semibold text-foreground mb-3 text-base sm:text-lg">Prevention Tips</h4>
                      <div className="space-y-2">
                        {result.prevention.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 p-3 bg-secondary/10 rounded-lg border border-secondary/20"
                          >
                            <Shield className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                            <p className="text-xs sm:text-sm text-secondary/90">{item}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="next-steps" className="space-y-3">
                      <h4 className="font-semibold text-foreground mb-3 text-base sm:text-lg">
                        Recommended Next Steps
                      </h4>
                      <div className="space-y-2">
                        {result.nextSteps.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200"
                          >
                            <Clock className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs sm:text-sm text-purple-800">{item}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <Button className="w-full sm:flex-1 bg-primary hover:bg-primary/90 min-h-[44px]">
                      Save Report
                    </Button>
                    <Button variant="outline" className="w-full sm:flex-1 bg-transparent min-h-[44px]">
                      Get Expert Consultation
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto bg-transparent min-h-[44px]"
                      onClick={() => {
                        setResult(null)
                        setSelectedFile(null)
                        setPreviewUrl(null)
                      }}
                    >
                      Analyze Another Image
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Help Card */}
            {!isAnalyzing && !result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                    <Info className="h-5 w-5 text-blue-600" />
                    <span>Tips for Best Results</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Take photos in good lighting conditions</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Focus on affected areas of the plant</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Include both healthy and diseased parts if possible</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Avoid blurry or low-resolution images</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
