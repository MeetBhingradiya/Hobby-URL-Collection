import Link from 'next/link';
import { FiPlus, FiExternalLink, FiEdit2 } from 'react-icons/fi';
import { getAllLists } from '@/lib/actions/list-actions';
import DeleteListButton from '@/components/DeleteListButton';

// This is a Server Component that fetches lists from the database
export default async function ListsPage() {
  // Fetch all lists from the database
  const { success, lists, error } = await getAllLists();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">My Lists</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage all your URL collections in one place</p>
        </div>
        <Link href="/" className="btn btn-primary btn-glass flex items-center gap-2 shadow-lg shadow-primary/20 dark:shadow-primary/10">
          <FiPlus size={18} />
        </Link>
      </div>

      {success && lists && lists.length > 0 ? (
        <div className="glass rounded-xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y dark:divide-gray-800 divide-gray-200">
              <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wider uppercase text-gray-500 dark:text-gray-400">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wider uppercase text-gray-500 dark:text-gray-400">
                    URL
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wider uppercase text-gray-500 dark:text-gray-400">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium tracking-wider uppercase text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-800 divide-gray-200 dark:bg-transparent bg-white/80">
                {lists.map((list) => (
                  <tr key={list._id} className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="font-medium dark:text-gray-200">
                          {list.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-gray-500 dark:text-gray-400 font-mono text-sm">/{list.slug}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-gray-500 dark:text-gray-400">
                        {new Date(list.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/${list.slug}`}
                          className="p-2 rounded-full text-primary hover:text-white hover:bg-primary transition-colors"
                          title="View list"
                        >
                          <FiExternalLink size={18} />
                        </Link>
                        <Link
                          href={`/${list.slug}?edit=true`}
                          className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
                          title="Edit list"
                        >
                          <FiEdit2 size={18} />
                        </Link>
                        <div className="p-1">
                          <DeleteListButton slug={list.slug} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass rounded-xl p-8 text-center shadow-xl">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "You haven't created any lists yet."}
          </p>
          <Link href="/" className="btn btn-primary btn-glass inline-flex items-center gap-2 shadow-lg shadow-primary/20 dark:shadow-primary/10">
            <FiPlus size={18} />
            <span>Create Your First List</span>
          </Link>
        </div>
      )}
    </div>
  );
}
