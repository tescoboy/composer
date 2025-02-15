import PlayList from '@/components/PlayList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      {/* Header Section */}
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Theatre Journal</h1>
          <button className="p-2 rounded-full bg-indigo-600 text-white">
            {/* Placeholder for login/profile button */}
            Sign In
          </button>
        </div>
      </header>

      <PlayList />
    </main>
  );
}
