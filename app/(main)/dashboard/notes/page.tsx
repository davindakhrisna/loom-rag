import CalendarSection from "@/components/dashboard/notes/calendar";
import TodoListSection from "@/components/dashboard/notes/todo";
import { TodaysNotesSection } from "@/components/dashboard/notes/notes";
import { ActionButton, MotivationBlock, ActionCommunity } from "@/components/dashboard/notes/motivation";
import { auth } from "@/auth"

const Notes = async () => {
  const session = await auth();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        < div className="text-center py-8" >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Notes</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage focus and progress</p>
        </div >

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TodoListSection session={session} />
            <TodaysNotesSection session={session} />
          </div>

          <div className="space-y-6 mb-8">
            <MotivationBlock />
            <ActionButton session={session} />
            <CalendarSection />
            <ActionCommunity />
          </div>
        </div>
      </div>
    </div>

  );
}

export default Notes
