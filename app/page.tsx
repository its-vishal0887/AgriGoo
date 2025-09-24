import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  CheckCircle,
  Users,
  Target,
  Brain,
  Leaf,
  BarChart3,
  Shield,
  Globe,
  Smartphone,
  TrendingUp,
  Database,
  Lock,
  ArrowRight,
} from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-primary/15 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23059669' fillOpacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 animate-float">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="absolute top-32 right-20 animate-float-delayed">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="absolute bottom-32 left-1/4 animate-float">
            <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <BarChart3 className="h-7 w-7 text-primary" />
            </div>
          </div>
          <div className="absolute bottom-20 right-1/3 animate-float-delayed">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Shield className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-4 sm:mb-6 text-balance leading-tight">
            AgriGoo: Your AI Crop Doctor
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-primary/80 mb-8 sm:mb-12 max-w-4xl mx-auto text-pretty font-medium px-2">
            Instant disease detection, intelligent farming solutions
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-h-[44px]"
            >
              Scan Your Crops Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary/5 px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 min-h-[44px]"
            >
              View Live Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-primary/20">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">99.3%</div>
              <div className="text-primary/90 font-semibold text-sm sm:text-base">Detection Accuracy</div>
              <div className="text-xs sm:text-sm text-primary/70 mt-1">Scientifically Validated</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-primary/20">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">15,000+</div>
              <div className="text-primary/90 font-semibold text-sm sm:text-base">Farmers Trust Us</div>
              <div className="text-xs sm:text-sm text-primary/70 mt-1">Across 50+ Countries</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-primary/20">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-primary/90 font-semibold text-sm sm:text-base">Expert Support</div>
              <div className="text-xs sm:text-sm text-primary/70 mt-1">Agricultural Specialists</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Powerful Features for Modern Agriculture
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Advanced AI technology meets agricultural expertise to revolutionize crop health management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Multi-Crop Support */}
            <Card className="border-primary/20 hover:shadow-xl transition-all duration-300 hover:border-primary/30 group">
              <CardContent className="p-6 sm:p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-primary">Multi-Crop Support</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                  Detect diseases across 50+ crop types with specialized AI models trained for each variety
                </p>
                <button className="text-primary font-semibold flex items-center hover:text-primary/80 transition-colors min-h-[44px] text-sm sm:text-base">
                  Learn more <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </CardContent>
            </Card>

            {/* Global Database */}
            <Card className="border-primary/20 hover:shadow-xl transition-all duration-300 hover:border-primary/30 group">
              <CardContent className="p-6 sm:p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-primary">Global Database</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                  Access worldwide disease patterns and treatment recommendations from agricultural experts
                </p>
                <button className="text-primary font-semibold flex items-center hover:text-primary/80 transition-colors min-h-[44px] text-sm sm:text-base">
                  Learn more <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </CardContent>
            </Card>

            {/* Mobile Optimized */}
            <Card className="border-primary/20 hover:shadow-xl transition-all duration-300 hover:border-primary/30 group">
              <CardContent className="p-6 sm:p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-primary">Mobile Optimized</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                  Use AgriGoo anywhere with our field-ready mobile interface designed for farmers
                </p>
                <button className="text-primary font-semibold flex items-center hover:text-primary/80 transition-colors min-h-[44px] text-sm sm:text-base">
                  Learn more <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </CardContent>
            </Card>

            {/* Predictive Analytics */}
            <Card className="border-primary/20 hover:shadow-xl transition-all duration-300 hover:border-primary/30 group">
              <CardContent className="p-6 sm:p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-primary">Predictive Analytics</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                  Get early warnings and prevent outbreaks before they happen with AI forecasting
                </p>
                <button className="text-primary font-semibold flex items-center hover:text-primary/80 transition-colors min-h-[44px] text-sm sm:text-base">
                  Learn more <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </CardContent>
            </Card>

            {/* History Tracking */}
            <Card className="border-primary/20 hover:shadow-xl transition-all duration-300 hover:border-primary/30 group">
              <CardContent className="p-6 sm:p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Database className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-primary">History Tracking</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                  Monitor your farm's health over time with detailed analytics and trend insights
                </p>
                <button className="text-primary font-semibold flex items-center hover:text-primary/80 transition-colors min-h-[44px] text-sm sm:text-base">
                  Learn more <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="border-primary/20 hover:shadow-xl transition-all duration-300 hover:border-primary/30 group">
              <CardContent className="p-6 sm:p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-primary">Data Security</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
                  Enterprise-grade encryption protects your farm's sensitive data and privacy
                </p>
                <button className="text-primary font-semibold flex items-center hover:text-primary/80 transition-colors min-h-[44px] text-sm sm:text-base">
                  Learn more <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Three simple steps to healthier crops
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-primary">Upload</h3>
              <p className="text-muted-foreground text-base sm:text-lg px-2">
                Take a clear photo of the affected crop area using your smartphone or camera
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-primary">Analyze</h3>
              <p className="text-muted-foreground text-base sm:text-lg px-2">
                Our AI system processes the image and identifies potential diseases or issues
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-primary">Get Results</h3>
              <p className="text-muted-foreground text-base sm:text-lg px-2">
                Receive detailed diagnosis with treatment recommendations and prevention tips
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators & CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6 sm:mb-8">
              Trusted by Farmers Worldwide
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary mr-2" />
                  <span className="text-2xl sm:text-3xl font-bold text-primary">50,000+</span>
                </div>
                <p className="text-muted-foreground text-sm sm:text-base">Farmers Served</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 sm:h-8 sm:w-8 text-primary mr-2" />
                  <span className="text-2xl sm:text-3xl font-bold text-primary">95%</span>
                </div>
                <p className="text-muted-foreground text-sm sm:text-base">Accuracy Rate</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary mr-2" />
                  <span className="text-2xl sm:text-3xl font-bold text-primary">1M+</span>
                </div>
                <p className="text-muted-foreground text-sm sm:text-base">Crops Analyzed</p>
              </div>
            </div>

            <div className="bg-primary text-white rounded-2xl p-8 sm:p-12">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Protect Your Crops?</h3>
              <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-primary-foreground/90 px-2">
                Join thousands of farmers who trust AgriGoo for healthier harvests
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto sm:max-w-none">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto bg-white text-primary hover:bg-primary-foreground/95 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold min-h-[44px]"
                >
                  Start Free Trial
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white hover:bg-primary/80 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-transparent min-h-[44px]"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h4 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">AgriGoo: Your AI Crop Doctor</h4>
          <p className="text-primary-foreground/80 mb-4 sm:mb-6 text-sm sm:text-base px-2">
            Empowering farmers with AI-powered crop disease detection
          </p>
          <p className="text-primary-foreground/70 text-xs sm:text-sm">© 2025 AgriGoo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
