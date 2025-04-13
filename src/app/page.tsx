import Link from 'next/link';
import { getAllLists } from '../lib/actions/list-actions';
import CreateListForm from '../components/CreateListForm';

export default async function HomePage() {
  const { success, lists, error } = await getAllLists();

  return (    <div className="max-w-5xl mx-auto">
      <section className="mb-12 sm:mb-16 text-center px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Welcome to The Urlist</h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-10">
          Create and share collections of URLs with custom links.
        </p>
        <div className="glass p-5 sm:p-8 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 dark:text-gray-200">Create a New List</h2>
          <CreateListForm />
        </div>
      </section>      <section className="px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Recent Lists</h2>
        {success && lists && lists.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
            {lists.slice(0, 6).map((list) => (
              <div key={list._id} className="glass p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 transition-transform hover:scale-[1.01]">
                <h3 className="text-lg sm:text-xl font-medium mb-2 dark:text-gray-200">{list.title}</h3>
                {list.description && (
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">{list.description}</p>
                )}
                <Link 
                  href={`/${list.slug}`}
                  className="btn btn-primary btn-glass inline-block text-sm sm:text-base shadow-md shadow-primary/20 dark:shadow-primary/10"
                >
                  View List
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass p-5 sm:p-8 rounded-xl text-center shadow-lg border border-gray-100 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
              {error || "No lists available. Create your first list above!"}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
