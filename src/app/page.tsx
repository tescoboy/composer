import PlayList from '@/components/PlayList';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Theatre Diary
      </h1>
      <PlayList />
    </main>
  );
}
