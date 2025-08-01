
export function Logo() {
  return (
    <div className="flex items-center justify-center mb-4">
      <div className="relative">
        {/* Main logo circle */}
        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg">
          {/* Loom pattern - interlocking circles */}
          <div className="relative w-8 h-8">
            <div className="absolute top-0 left-0 w-4 h-4 border-2 border-white rounded-full opacity-80"></div>
            <div className="absolute top-1 right-0 w-4 h-4 border-2 border-white rounded-full opacity-60"></div>
            <div className="absolute bottom-0 left-1 w-4 h-4 border-2 border-white rounded-full opacity-90"></div>
          </div>
        </div>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-500 rounded-xl blur-md opacity-20 -z-10"></div>
      </div>
    </div>
  )
}
