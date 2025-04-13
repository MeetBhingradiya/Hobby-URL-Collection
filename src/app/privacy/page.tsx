import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - The Urlist',
  description: 'Learn how The Urlist handles and protects your personal information',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p>Last updated: April 13, 2025</p>
        
        <h2>Introduction</h2>
        <p>
          At The Urlist, we respect your privacy and are committed to protecting your personal data. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
          when you visit our website and use our services.
        </p>
        
        <h2>Information We Collect</h2>
        <p>We collect several types of information from and about users of our website, including:</p>
        <ul>
          <li>
            <strong>Personal Data:</strong> Email address, name, and payment information when you 
            register for an account or subscribe to our premium services.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you use our website, including which 
            lists you create and links you add.
          </li>
          <li>
            <strong>Technical Data:</strong> IP address, browser type and version, time zone setting, 
            browser plug-in types and versions, operating system, and platform.
          </li>
        </ul>
        
        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send administrative information, such as updates, security alerts, and support messages</li>
          <li>Respond to your comments, questions, and requests</li>
          <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
          <li>Detect, prevent, and address technical issues</li>
        </ul>
        
        <h2>Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on our website and 
          hold certain information. Cookies are files with a small amount of data which may include 
          an anonymous unique identifier. You can instruct your browser to refuse all cookies or to 
          indicate when a cookie is being sent.
        </p>
        
        <h2>Data Security</h2>
        <p>
          We have implemented appropriate technical and organizational security measures designed to 
          protect the security of any personal information we process. However, please also remember 
          that we cannot guarantee that the internet itself is 100% secure.
        </p>
        
        <h2>Data Retention</h2>
        <p>
          We will retain your personal information only for as long as is necessary for the purposes 
          set out in this Privacy Policy. We will also retain and use your information to the extent 
          necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
        </p>
        
        <h2>Your Data Protection Rights</h2>
        <p>Depending on your location, you may have the following rights:</p>
        <ul>
          <li>The right to access, update, or delete the information we have on you</li>
          <li>The right of rectification</li>
          <li>The right to object</li>
          <li>The right of restriction</li>
          <li>The right to data portability</li>
          <li>The right to withdraw consent</li>
        </ul>
        
        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by 
          posting the new Privacy Policy on this page and updating the "Last updated" date at the top.
        </p>
        
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at{' '}
          <a href="mailto:privacy@theurlist.com">privacy@theurlist.com</a>.
        </p>
      </div>
      
      <div className="mt-12 flex justify-center">
        <Link 
          href="/"
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
