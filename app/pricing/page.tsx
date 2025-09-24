"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import {
  Check,
  X,
  Star,
  Shield,
  Clock,
  Headphones,
  Award,
  ChevronDown,
  ChevronUp,
  Sprout,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [expandedFeatures, setExpandedFeatures] = useState<{ [key: string]: boolean }>({})
  const [activeComparison, setActiveComparison] = useState(0)

  const plans = [
    {
      name: "Small Farm Plan",
      subtitle: "0-50 acres",
      price: { monthly: 0, yearly: 0 },
      popular: true,
      description: "Perfect for family farms and small-scale operations getting started with AI crop monitoring",
      coreFeatures: ["50 crop health checks/month", "Basic disease detection", "Email support", "Mobile app access"],
      advancedFeatures: [
        { name: "Advanced crop analytics", included: false },
        { name: "Priority support", included: false },
        { name: "Weather integration", included: false },
        { name: "Export farm reports", included: false },
      ],
      cta: "Start Protecting Crops",
      ctaVariant: "default" as const,
      acreage: "0-50 acres",
      roi: "Basic protection",
    },
    {
      name: "Growing Farm Plan",
      subtitle: "50-500 acres",
      price: { monthly: 49, yearly: 490 },
      popular: false,
      description: "Advanced AI monitoring for expanding agricultural operations and commercial farms",
      coreFeatures: [
        "Unlimited crop health checks",
        "Advanced AI disease detection",
        "Real-time crop alerts",
        "Priority support",
      ],
      advancedFeatures: [
        { name: "Export farm reports", included: true },
        { name: "Weather integration", included: true },
        { name: "Advanced crop analytics", included: true },
        { name: "API access", included: false },
        { name: "White-label solution", included: false },
        { name: "Custom AI models", included: false },
      ],
      cta: "Start Farm Trial",
      ctaVariant: "outline" as const,
      acreage: "50-500 acres",
      roi: "Average 5x ROI",
    },
    {
      name: "Enterprise Farm Plan",
      subtitle: "500+ acres",
      price: { monthly: "Custom", yearly: "Custom" },
      popular: false,
      description: "Complete AI crop monitoring solution for large-scale agribusiness and farming operations",
      coreFeatures: ["Everything in Growing Plan", "White-label solution", "API access", "Dedicated farm specialist"],
      advancedFeatures: [
        { name: "Custom AI crop models", included: true },
        { name: "On-premise deployment", included: true },
        { name: "SLA guarantee", included: true },
        { name: "Custom integrations", included: true },
        { name: "Training & onboarding", included: true },
        { name: "24/7 phone support", included: true },
      ],
      cta: "Contact Farm Specialists",
      ctaVariant: "secondary" as const,
      acreage: "500+ acres",
      roi: "Maximum ROI",
    },
  ]

  const toggleFeatures = (planName: string) => {
    setExpandedFeatures((prev) => ({
      ...prev,
      [planName]: !prev[planName],
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/15">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Sprout className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-primary text-balance">
              Protect Your Investment with AI
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-primary/80 mb-4 max-w-3xl mx-auto text-pretty">
            Prevent 80% of crop loss with early detection. Choose the plan that fits your farm size.
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary/20">
              <TrendingUp className="h-4 w-4 text-secondary mr-2" />
              <span className="text-sm font-semibold text-primary">Average 5x ROI for Pro users</span>
            </div>
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary/20">
              <AlertTriangle className="h-4 w-4 text-secondary mr-2" />
              <span className="text-sm font-semibold text-primary">Prevent 80% of crop loss</span>
            </div>
          </div>

          <div className="flex items-center justify-center mb-8 sm:mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-primary/20 shadow-lg w-full max-w-sm sm:max-w-none sm:w-auto">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 sm:px-6 py-4 sm:py-3 rounded-lg font-semibold transition-all duration-200 min-h-[48px] sm:min-h-[44px] flex-1 sm:flex-none ${
                  billingCycle === "monthly" ? "bg-primary text-white shadow-md" : "text-primary hover:bg-primary/5"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 sm:px-6 py-4 sm:py-3 rounded-lg font-semibold transition-all duration-200 min-h-[48px] sm:min-h-[44px] relative flex-1 sm:flex-none ${
                  billingCycle === "yearly" ? "bg-primary text-white shadow-md" : "text-primary hover:bg-primary/5"
                }`}
              >
                Yearly
                <Badge className="absolute -top-2 -right-1 sm:-right-2 bg-secondary text-secondary-foreground text-xs px-2 py-1">
                  Save 20%
                </Badge>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="lg:hidden mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex space-x-2">
                {plans.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveComparison(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      activeComparison === index ? "bg-primary" : "bg-primary/20"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${activeComparison * 100}%)` }}
              >
                {plans.map((plan, index) => (
                  <div key={plan.name} className="w-full flex-shrink-0 px-2">
                    <Card
                      className={`border-2 transition-all duration-300 ${
                        plan.popular ? "border-primary shadow-lg" : "border-primary/20"
                      }`}
                    >
                      {plan.popular && (
                        <div className="bg-primary text-white text-center py-2 text-sm font-semibold">
                          <Star className="h-4 w-4 inline mr-1" />
                          Most Popular
                        </div>
                      )}

                      <CardHeader className="text-center pb-6 pt-6">
                        <div className="mb-4">
                          <h3 className="text-2xl font-bold text-primary mb-2">{plan.name}</h3>
                          <p className="text-muted-foreground font-medium text-sm">{plan.subtitle}</p>
                          <Badge variant="outline" className="mt-2 text-xs border-secondary text-secondary">
                            {plan.roi}
                          </Badge>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-baseline justify-center">
                            {typeof plan.price[billingCycle] === "number" ? (
                              <>
                                <span className="text-3xl sm:text-4xl font-bold text-primary">
                                  ${plan.price[billingCycle]}
                                </span>
                                <span className="text-muted-foreground ml-1 text-sm">
                                  /{billingCycle === "monthly" ? "month" : "year"}
                                </span>
                              </>
                            ) : (
                              <span className="text-2xl sm:text-3xl font-bold text-primary">
                                {plan.price[billingCycle]}
                              </span>
                            )}
                          </div>
                          {typeof plan.price[billingCycle] === "number" && plan.price[billingCycle] > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Starting at ${(plan.price[billingCycle] / 50).toFixed(2)} per acre
                            </p>
                          )}
                          {billingCycle === "yearly" &&
                            typeof plan.price.monthly === "number" &&
                            plan.price.monthly > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Save ${plan.price.monthly * 12 - plan.price.yearly} per year
                              </p>
                            )}
                        </div>

                        <p className="text-sm text-muted-foreground text-pretty px-2">{plan.description}</p>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="mb-4">
                          <h4 className="font-semibold text-primary mb-3 text-sm">Core Features</h4>
                          <ul className="space-y-2">
                            {plan.coreFeatures.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-center">
                                <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                                <span className="text-sm text-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mb-6">
                          <button
                            onClick={() => toggleFeatures(plan.name)}
                            className="flex items-center justify-between w-full text-left font-semibold text-primary mb-3 text-sm py-2 px-3 rounded-lg hover:bg-primary/5 transition-colors min-h-[44px]"
                          >
                            <span>Advanced Features</span>
                            {expandedFeatures[plan.name] ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>

                          {expandedFeatures[plan.name] && (
                            <ul className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                              {plan.advancedFeatures.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-center">
                                  {feature.included ? (
                                    <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                                  ) : (
                                    <X className="h-4 w-4 text-muted-foreground mr-3 flex-shrink-0" />
                                  )}
                                  <span
                                    className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground"}`}
                                  >
                                    {feature.name}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <Button
                          className={`w-full py-4 font-semibold text-base min-h-[52px] ${
                            plan.popular ? "bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl" : ""
                          }`}
                          variant={plan.ctaVariant}
                          size="lg"
                        >
                          {plan.cta}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={plan.name}
                className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? "border-primary shadow-lg scale-105 lg:scale-110"
                    : "border-primary/20 hover:border-primary/30"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-2 text-sm font-semibold shadow-lg">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-8">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-primary mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground font-medium">{plan.subtitle}</p>
                    <Badge variant="outline" className="mt-2 text-xs border-secondary text-secondary">
                      {plan.roi}
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline justify-center">
                      {typeof plan.price[billingCycle] === "number" ? (
                        <>
                          <span className="text-4xl font-bold text-primary">${plan.price[billingCycle]}</span>
                          <span className="text-muted-foreground ml-1">
                            /{billingCycle === "monthly" ? "month" : "year"}
                          </span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-primary">{plan.price[billingCycle]}</span>
                      )}
                    </div>
                    {typeof plan.price[billingCycle] === "number" && plan.price[billingCycle] > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Starting at ${(plan.price[billingCycle] / 50).toFixed(2)} per acre
                      </p>
                    )}
                    {billingCycle === "yearly" && typeof plan.price.monthly === "number" && plan.price.monthly > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Save ${plan.price.monthly * 12 - plan.price.yearly} per year
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground text-pretty">{plan.description}</p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="mb-4">
                    <ul className="space-y-2">
                      {plan.coreFeatures.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-8">
                    <ul className="space-y-2">
                      {plan.advancedFeatures.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground"}`}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className={`w-full py-3 font-semibold text-base min-h-[44px] ${
                      plan.popular ? "bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl" : ""
                    }`}
                    variant={plan.ctaVariant}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Why Farmers Choose AgriGoo</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of farmers who trust our platform for crop health monitoring
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-primary mb-2 text-sm sm:text-base">No Credit Card Required</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Start protecting crops instantly</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-primary mb-2 text-sm sm:text-base">14-Day Farm Trial</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Try advanced features risk-free</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Award className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-primary mb-2 text-sm sm:text-base">Harvest Guarantee</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">30-day satisfaction guarantee</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Headphones className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-primary mb-2 text-sm sm:text-base">Farm Specialists</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Agricultural experts available</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Everything you need to know about AgriGoo farm pricing
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Card className="border-primary/20">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-primary mb-2 text-sm sm:text-base">
                  How do you calculate pricing per acre?
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Our plans are designed around typical farm sizes. Small farms (0-50 acres) get our free plan, growing
                  farms (50-500 acres) use our Pro plan, and enterprise farms (500+ acres) get custom pricing based on
                  their specific needs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-primary mb-2 text-sm sm:text-base">
                  What happens if I exceed my crop health check limit?
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  You'll receive a notification when you're close to your limit. You can upgrade to the Growing Farm
                  Plan for unlimited checks or wait until next month for your limit to reset.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-primary mb-2 text-sm sm:text-base">Is my farm data secure?</h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Absolutely. We use enterprise-grade encryption and never share your farm data with third parties. Your
                  crop information and farm location remain completely private and secure.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-primary mb-2 text-sm sm:text-base">
                  Do you offer discounts for agricultural cooperatives?
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Yes, we offer special pricing for agricultural cooperatives, farming associations, and educational
                  institutions. Contact our farm specialists for more information.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Protect Your Harvest?</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-primary-foreground/90">
            Join thousands of farmers who trust AgriGoo for healthier crops and better yields
          </p>
          <div className="flex flex-col gap-4 justify-center max-w-sm mx-auto sm:max-w-none sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-primary-foreground/95 px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold min-h-[52px] sm:min-h-[44px]"
            >
              Start Farm Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-primary/80 px-6 sm:px-8 py-4 text-base sm:text-lg font-semibold bg-transparent min-h-[52px] sm:min-h-[44px]"
            >
              Contact Farm Specialists
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h4 className="text-xl sm:text-2xl font-bold mb-4">AgriGoo: Your AI Crop Doctor</h4>
          <p className="text-primary-foreground/80 mb-4 sm:mb-6 text-sm sm:text-base">
            Empowering farmers with AI-powered crop disease detection
          </p>
          <p className="text-primary-foreground/70 text-xs sm:text-sm">© 2025 AgriGoo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
