import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - The Urlist',
  description: 'Terms and conditions for using The Urlist service',
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Terms of Service</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p>Last updated: April 13, 2025</p>
        
        <h2>Introduction</h2>
        <p>
          These Terms of Service ("Terms") govern your access to and use of The Urlist website, 
          services, and applications (collectively, the "Service"). By accessing or using the Service, 
          you agree to be bound by these Terms.
        </p>
        
        <h2>Using The Urlist</h2>
        <p>
          The Urlist is a service that allows users to create, manage, and share lists of URLs.
          You may use our Service only as permitted by these Terms and any applicable laws.
        </p>
        
        <h3>User Accounts</h3>
        <p>
          When you create an account with us, you must provide accurate and complete information. 
          You are responsible for maintaining the security of your account and for all activities 
          that occur under your account. You agree to notify us immediately of any unauthorized 
          access to or use of your account.
        </p>
        
        <h3>Content Restrictions</h3>
        <p>
          You agree not to use The Urlist to create, share, or store any content that:
        </p>
        <ul>
          <li>Violates any applicable law or regulation</li>
          <li>Infringes upon the rights of others</li>
          <li>Is harmful, fraudulent, deceptive, threatening, abusive, or otherwise objectionable</li>
          <li>Contains viruses, malware, or other harmful code</li>
          <li>Involves the transmission of "junk mail," "chain letters," or unsolicited mass mailing</li>
          <li>Promotes illegal or harmful activities</li>
        </ul>
        
        <h2>Subscription Terms</h2>
        <p>
          The Urlist offers both free and premium subscription plans. By signing up for a premium 
          subscription, you agree to the following terms:
        </p>
        <ul>
          <li>
            <strong>Billing:</strong> You will be billed in advance on a recurring basis, depending 
            on your subscription plan (monthly, yearly, or lifetime).
          </li>
          <li>
            <strong>Cancellation:</strong> You can cancel your subscription at any time through your 
            account settings. If you cancel, you will still have access to premium features until the 
            end of your current billing period.
          </li>
          <li>
            <strong>Refunds:</strong> Refunds are handled on a case-by-case basis and are not 
            guaranteed. Lifetime subscriptions are non-refundable after 30 days.
          </li>
          <li>
            <strong>Changes to Pricing:</strong> We reserve the right to change our subscription prices 
            at any time. If we do, we will provide notice of the change on our website or by email at 
            least 30 days before the change takes effect.
          </li>
        </ul>
        
        <h2>Intellectual Property</h2>
        <p>
          The Service and all content, features, and functionality thereof, including but not limited 
          to all information, software, text, graphics, logos, icons, and images, are owned by The Urlist, 
          its licensors, or other providers of such material and are protected by copyright, trademark, 
          and other intellectual property laws.
        </p>
        
        <h2>User-Generated Content</h2>
        <p>
          You retain all ownership rights to the content you create and share through our Service. 
          However, by submitting content to The Urlist, you grant us a worldwide, non-exclusive, 
          royalty-free license to use, reproduce, adapt, publish, and distribute such content solely 
          for the purpose of providing and improving our Service.
        </p>
        
        <h2>Termination</h2>
        <p>
          We may terminate or suspend your account and access to the Service immediately, without 
          prior notice or liability, for any reason, including but not limited to a breach of the Terms. 
          Upon termination, your right to use the Service will immediately cease.
        </p>
        
        <h2>Limitation of Liability</h2>
        <p>
          In no event shall The Urlist, its directors, employees, partners, agents, suppliers, or 
          affiliates be liable for any indirect, incidental, special, consequential, or punitive 
          damages, including without limitation, loss of profits, data, use, goodwill, or other 
          intangible losses, resulting from your access to or use of or inability to access or use 
          the Service.
        </p>
        
        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify or replace these Terms at any time. If a revision is material, 
          we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes 
          a material change will be determined at our sole discretion.
        </p>
        
        <h2>Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at{' '}
          <a href="mailto:legal@theurlist.com">legal@theurlist.com</a>.
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
