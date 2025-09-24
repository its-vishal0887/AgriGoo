import Link from "next/link"

interface AgriGooLogoProps {
  size?: "sm" | "md" | "lg"
  showTagline?: boolean
  className?: string
}

export function AgriGooLogo({ size = "md", showTagline = true, className = "" }: AgriGooLogoProps) {
  const sizeClasses = {
    sm: {
      container: "w-6 h-6",
      text: "text-lg",
      tagline: "text-xs",
      leaf: "text-sm",
    },
    md: {
      container: "w-8 h-8",
      text: "text-xl",
      tagline: "text-xs",
      leaf: "text-base",
    },
    lg: {
      container: "w-12 h-12",
      text: "text-3xl",
      tagline: "text-sm",
      leaf: "text-xl",
    },
  }

  const currentSize = sizeClasses[size]

  return (
    <Link href="/" className={`flex items-center space-x-2 group ${className}`}>
      <div
        className={`${currentSize.container} bg-primary rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200`}
      >
        <span className={`text-white font-bold ${currentSize.leaf}`}>🌱</span>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-bold text-primary group-hover:text-primary/80 transition-colors duration-200 ${currentSize.text}`}
        >
          AgriGoo
        </span>
        {showTagline && (
          <span className={`text-primary/70 font-medium -mt-1 ${currentSize.tagline}`}>AI Crop Health</span>
        )}
      </div>
    </Link>
  )
}
