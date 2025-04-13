import Link from 'next/link';

export const metadata = {
  title: 'Sitemap - The Urlist',
  description: 'Navigate through all pages of The Urlist website',
};

export default function SitemapPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Sitemap</h1>
      
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Main Pages</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
                Home
              </Link>
              <span className="text-gray-500 dark:text-gray-400 ml-2">- The main landing page</span>
            </li>
            <li>
              <Link href="/lists" className="text-blue-600 hover:underline dark:text-blue-400">
                My Lists
              </Link>
              <span className="text-gray-500 dark:text-gray-400 ml-2">- Manage your URL collections</span>
            </li>
            <li>
              <Link href="/pricing" className="text-blue-600 hover:underline dark:text-blue-400">
                Pricing
              </Link>
              <span className="text-gray-500 dark:text-gray-400 ml-2">- Subscription plan options</span>
            </li>
          </ul>
          
          <h2 className="text-xl font-semibold mb-4 mt-8 dark:text-white">Account</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
                Login
              </Link>
              <span className="text-gray-500 dark:text-gray-400 ml-2">- Access your account</span>
            </li>
            <li>
              <Link href="/register" className="text-blue-600 hover:underline dark:text-blue-400">
                Register
              </Link>
              <span className="text-gray-500 dark:text-gray-400 ml-2">- Create a new account</span>
            </li>
            <li>
              <Link href="/forgot-password" className="text-blue-600 hover:underline dark:text-blue-400">
                Forgot Password
              </Link>
              <span className="text-gray-500 dark:text-gray-400 ml-2">- Reset your password</span>
            </li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Legal & Information</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy" className="text-blue-600 hover:underline dark:text-blue-400">
                Privacy Policy
              </Link>
              <span className="text-gray-500 dark:text-gray-400 ml-2">- How we handle your data</span>
            </li>
            <li>
              <Link href="/terms" className="text-blue-600 hover:underline dark:text-blue-400">
                Terms of Service
              </Link>
              <span className="text-gray-500 dark:text-gray-400 ml-2">- Rules for using our service</span>
            </li>
            <li>
              <Link href="/sitemap" className="text-blue-600 hover:underline dark:text-blue-400">
                Sitemap
              </Link>
              <span className="text-gray-500 dark:text-gray-400 ml-2">- This page</span>
            </li>
          </ul>
          
          <h2 className="text-xl font-semibold mb-4 mt-8 dark:text-white">Help & Support</h2>
          <ul className="space-y-2">
            <li>
              <a 
                href="mailto:support@theurlist.com" 
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Contact Support
              </a>
              <span className="text-gray-500 dark:text-gray-400 ml-2">- Get help with your account</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
