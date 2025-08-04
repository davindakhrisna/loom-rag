
export function Logo() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Main logo circle */}
        <div className="p-1 rounded-xl bg-white dark:bg-transparent flex items-center justify-center">
          {/* Loom pattern - interlocking circles */}
          <div className="relative w-8 h-8">
            <div className="absolute top-0 left-0 w-4 h-4 border-2 border-black dark:border-blue-400 rounded-full opacity-80"></div>
            <div className="absolute top-1 right-0 w-4 h-4 border-2 border-black dark:border-blue-400 rounded-full opacity-60"></div>
            <div className="absolute bottom-0 left-1 w-4 h-4 border-2 border-black dark:border-blue-500 rounded-full opacity-90"></div>
          </div>
        </div>
        {/* Subtle glow effect */}
      </div>
    </div>
  )
}
