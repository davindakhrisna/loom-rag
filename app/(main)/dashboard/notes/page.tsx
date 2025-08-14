import { TodoListSection, TodaysNotesSection, MotivationBlock, ActionButtons, CalendarSection } from "@/components/dashboard/notes/notes";

const Notes = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        < div className="text-center py-8" >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Notes</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage focus and progress</p>
        </div >

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <TodoListSection />
            <TodaysNotesSection />
          </div>

          {/* Right Section - Takes 1 column on large screens */}
          <div className="space-y-6">
            <MotivationBlock />
            <ActionButtons />
            <CalendarSection />
          </div>
        </div>
      </div>
    </div>

  );
}

export default Notes
