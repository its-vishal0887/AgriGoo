import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Custom Skeleton component since the import is failing
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      {...props}
    />
  )
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* HERO SECTION LOADING */}
      <section className="relative py-16 px-4 overflow-hidden bg-gradient-to-r from-green-900 to-green-700 text-white">
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <Skeleton className="h-12 w-[350px] mb-4 bg-white/20" />
            <Skeleton className="h-6 w-[500px] mb-2 bg-white/20" />
            <Skeleton className="h-6 w-[450px] mb-8 bg-white/20" />
            <Skeleton className="h-14 w-[200px] rounded-md bg-white/30" />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION LOADING */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <Skeleton className="h-10 w-[250px] mx-auto mb-12" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <Skeleton className="w-20 h-20 rounded-full mb-4" />
                <Skeleton className="h-6 w-[180px] mb-2" />
                <Skeleton className="h-4 w-[220px]" />
                <Skeleton className="h-4 w-[200px] mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPLOAD INTERFACE LOADING */}
      <section className="py-16 px-4 bg-green-50">
        <div className="container mx-auto max-w-4xl">
          <Skeleton className="h-10 w-[300px] mx-auto mb-8" />
          
          <Card className="border-2 border-green-100 shadow-lg">
            <CardHeader className="bg-green-50">
              <Skeleton className="h-6 w-[250px] mb-2" />
              <Skeleton className="h-4 w-[350px]" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="border-2 border-dashed rounded-lg p-8 text-center border-gray-300">
                <div className="flex flex-col items-center">
                  <Skeleton className="h-12 w-12 rounded-full mb-4" />
                  <Skeleton className="h-5 w-[300px] mb-2" />
                  <Skeleton className="h-4 w-[250px]" />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[40px]" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            </CardContent>
            <CardFooter className="bg-green-50 border-t border-green-100">
              <Skeleton className="h-12 w-full rounded-md" />
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* ANALYSIS RESULTS LOADING */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <Skeleton className="h-10 w-[300px] mx-auto mb-8" />
          
          <Card className="border-2 border-green-100 shadow-lg mb-12">
            <CardHeader className="bg-green-50">
              <div className="flex justify-between items-center">
                <div>
                  <Skeleton className="h-6 w-[180px] mb-2" />
                  <Skeleton className="h-4 w-[220px]" />
                </div>
                <Skeleton className="w-24 h-24 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-6 w-[150px]" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-6 w-[180px]" />
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <Skeleton className="h-6 w-[200px] mb-4" />
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-[120px]" />
                        <Skeleton className="h-4 w-[80px]" />
                      </div>
                      <Skeleton className="h-8 w-full rounded-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* FERTILIZER RECOMMENDATIONS LOADING */}
          <Skeleton className="h-10 w-[350px] mx-auto mb-8" />
          
          <Card className="border-2 border-green-100 shadow-lg mb-12">
            <CardHeader className="bg-green-50">
              <Skeleton className="h-6 w-[200px] mb-2" />
              <Skeleton className="h-4 w-[300px]" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                      <Skeleton className="h-6 w-[150px] mb-3" />
                      <div className="space-y-3">
                        {[1, 2, 3].map((j) => (
                          <div key={j} className="flex items-start">
                            <Skeleton className="h-5 w-5 mr-2 mt-0.5 rounded-full" />
                            <div className="flex-1">
                              <Skeleton className="h-4 w-[120px] mb-1" />
                              <Skeleton className="h-3 w-[180px]" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Skeleton className="h-5 w-[100px]" />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <Skeleton className="h-6 w-[180px] mb-4" />
                  <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                    <div className="grid grid-cols-3 divide-x divide-gray-200">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 text-center">
                          <Skeleton className="h-5 w-[80px] mx-auto mb-1" />
                          <Skeleton className="h-4 w-[100px] mx-auto" />
                          <Skeleton className="h-5 w-[60px] mx-auto mt-2 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* SOIL IMPROVEMENT LOADING */}
          <Skeleton className="h-10 w-[300px] mx-auto mb-8" />
          
          <Card className="border-2 border-green-100 shadow-lg">
            <CardHeader className="bg-green-50">
              <Skeleton className="h-6 w-[250px] mb-2" />
              <Skeleton className="h-4 w-[350px]" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Skeleton className="h-6 w-[180px] mb-3" />
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-start">
                          <Skeleton className="h-5 w-5 mr-2 mt-0.5 rounded-full" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Skeleton className="h-6 w-[180px] mb-3" />
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i}>
                            <Skeleton className="h-5 w-[120px] mb-1" />
                            <Skeleton className="h-4 w-[180px]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Skeleton className="h-6 w-[200px] mb-4" />
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-4">
                          <Skeleton className="h-5 w-[80px] mb-2" />
                          <div className="space-y-1">
                            {[1, 2, 3].map((j) => (
                              <Skeleton key={j} className="h-4 w-[90%]" />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}