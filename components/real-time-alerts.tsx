"use client"

import { useEffect, useState } from "react"
import { Bell, AlertTriangle, CloudRain, Scan, Sprout } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { dataService } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"

export interface Alert {
  id: string
  type: 'outbreak' | 'weather' | 'scan' | 'treatment'
  title: string
  message: string
  severity: 'low' | 'medium' | 'high'
  timestamp: string
  read: boolean
}

interface RealTimeAlertsProps {
  farmId?: string
  regionId?: string
  maxAlerts?: number
}

export function RealTimeAlerts({ farmId, regionId, maxAlerts = 5 }: RealTimeAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Initialize data service with farm and region IDs if provided
    const mockToken = "mock-auth-token"
    dataService.initialize(mockToken, farmId, regionId)

    // Subscribe to real-time events
    const handleOutbreakAlert = (data: any) => {
      addAlert({
        id: `outbreak-${Date.now()}`,
        type: 'outbreak',
        title: 'Disease Outbreak Alert',
        message: `${data.disease} detected in ${data.region} with severity level ${data.severity}`,
        severity: mapSeverity(data.severity),
        timestamp: data.timestamp || new Date().toISOString(),
        read: false
      })
    }

    const handleWeatherAlert = (data: any) => {
      addAlert({
        id: `weather-${Date.now()}`,
        type: 'weather',
        title: 'Weather Alert',
        message: data.message || `Weather alert: ${data.condition} expected in your region`,
        severity: mapSeverity(data.severity),
        timestamp: data.timestamp || new Date().toISOString(),
        read: false
      })
    }

    const handleScanUpdate = (data: any) => {
      addAlert({
        id: `scan-${Date.now()}`,
        type: 'scan',
        title: 'Scan Completed',
        message: `Scan analysis complete: ${data.status}`,
        severity: 'low',
        timestamp: data.timestamp || new Date().toISOString(),
        read: false
      })
    }

    const handleTreatmentProgress = (data: any) => {
      addAlert({
        id: `treatment-${Date.now()}`,
        type: 'treatment',
        title: 'Treatment Update',
        message: `Treatment ${data.treatmentId} is ${data.status} (${data.progress}% complete)`,
        severity: 'medium',
        timestamp: data.timestamp || new Date().toISOString(),
        read: false
      })
    }

    dataService.onOutbreakAlert(handleOutbreakAlert)
    dataService.onWeatherAlert(handleWeatherAlert)
    dataService.onScanUpdate(handleScanUpdate)
    dataService.onTreatmentProgress(handleTreatmentProgress)

    // Add some mock alerts for demonstration
    setTimeout(() => {
      addAlert({
        id: `mock-outbreak-${Date.now()}`,
        type: 'outbreak',
        title: 'Disease Outbreak Alert',
        message: 'Early Blight detected in North Region with severity level 7',
        severity: 'high',
        timestamp: new Date().toISOString(),
        read: false
      })
    }, 2000)

    setTimeout(() => {
      addAlert({
        id: `mock-weather-${Date.now()}`,
        type: 'weather',
        title: 'Weather Alert',
        message: 'Heavy rainfall expected in your region in the next 24 hours',
        severity: 'medium',
        timestamp: new Date().toISOString(),
        read: false
      })
    }, 5000)

    return () => {
      dataService.disconnect()
    }
  }, [farmId, regionId])

  // Update unread count whenever alerts change
  useEffect(() => {
    setUnreadCount(alerts.filter(alert => !alert.read).length)
  }, [alerts])

  const addAlert = (alert: Alert) => {
    setAlerts(prev => {
      // Add new alert and limit to maxAlerts
      const newAlerts = [alert, ...prev].slice(0, maxAlerts)
      return newAlerts
    })

    // Show toast notification for new alert
    toast({
      title: alert.title,
      description: alert.message,
      variant: getSeverityVariant(alert.severity),
    })
  }

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })))
  }

  const markAsRead = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, read: true } : alert
      )
    )
  }

  const clearAlerts = () => {
    setAlerts([])
  }

  const mapSeverity = (value: number | string): 'low' | 'medium' | 'high' => {
    if (typeof value === 'number') {
      if (value < 4) return 'low'
      if (value < 7) return 'medium'
      return 'high'
    }
    
    // Handle string values
    const lowValues = ['low', 'minor', '1', '2', '3']
    const mediumValues = ['medium', 'moderate', '4', '5', '6']
    
    if (lowValues.includes(value.toString().toLowerCase())) return 'low'
    if (mediumValues.includes(value.toString().toLowerCase())) return 'medium'
    return 'high'
  }

  const getSeverityVariant = (severity: string): "default" | "destructive" => {
    return severity === 'high' ? "destructive" : "default"
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'outbreak':
        return <AlertTriangle className="h-4 w-4" />
      case 'weather':
        return <CloudRain className="h-4 w-4" />
      case 'scan':
        return <Scan className="h-4 w-4" />
      case 'treatment':
        return <Sprout className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return "bg-green-100 text-green-800 border-green-200"
      case 'medium':
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case 'high':
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch (e) {
      return 'Unknown time'
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Alerts Panel */}
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-80 sm:w-96 z-50 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
                <Button variant="ghost" size="sm" onClick={clearAlerts}>
                  Clear
                </Button>
              </div>
            </div>
            <CardDescription>Real-time farm alerts and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${
                        alert.read ? 'bg-white' : 'bg-blue-50'
                      }`}
                      onClick={() => markAsRead(alert.id)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`p-1 rounded-full ${getSeverityColor(alert.severity)}`}>
                            {getAlertIcon(alert.type)}
                          </span>
                          <span className="font-medium">{alert.title}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {formatDate(alert.timestamp)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 ml-7">{alert.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}