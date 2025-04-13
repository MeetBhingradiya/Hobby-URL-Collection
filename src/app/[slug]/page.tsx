import { notFound } from 'next/navigation';
import { getList } from '@/lib/actions/list-actions';
import { getLinks } from '@/lib/actions/link-actions';
import AddLinkForm from '@/components/AddLinkForm';
import LinkItem from '@/components/LinkItem';
import ListActions from '@/components/ListActions';
import ShareList from '@/components/ShareList';

export default async function ListPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Fetch the list details
  const { success: listSuccess, list, error: listError } = await getList(slug);

  // If the list doesn't exist, show 404
  if (!listSuccess || !list) {
    notFound();
  }

  // Fetch links for the list
  const { success: linksSuccess, links, error: linksError } = await getLinks(slug);
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{list.title}</h1>
          {list.description && (
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">{list.description}</p>
          )}
        </div>
        <div className="self-start">
          <ListActions slug={slug} />
        </div>
      </div>      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold dark:text-gray-200">Links</h2>
        <div className="flex items-center gap-3">
          <AddLinkForm slug={slug} />
          <ShareList slug={slug} />
        </div>
      </div><div className="space-y-5">
        {linksSuccess && links && links.length > 0 ? (
          links.map((link) => (
            <LinkItem key={link._id} link={link} slug={slug} />
          ))
        ) : (
          <div className="glass p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {linksError || "No links found. Add your first link above!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
