export default function PrivacyPolicyPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="prose dark:prose-invert max-w-4xl mx-auto">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>Introduction</h2>
        <p>
          AegisAI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We may collect information about you in a variety of ways. The information we may collect includes:
        </p>
        <ul>
          <li><strong>Scan Data:</strong> URLs you submit for scanning and the resulting reports are stored locally in your browser and are not transmitted to our servers.</li>
          <li><strong>Usage Data:</strong> We do not collect any personal usage data or analytics.</li>
        </ul>

        <h2>Use of Your Information</h2>
        <p>
          Since we do not collect personal information, we do not use it for any purpose. All scan data remains under your control within your browser's local storage.
        </p>

        <h2>Disclosure of Your Information</h2>
        <p>
          We do not share your information with any third parties.
        </p>

        <h2>Security of Your Information</h2>
        <p>
          We use administrative, technical, and physical security measures to help protect your information. While we have taken reasonable steps to secure the data you provide to us, please be aware that no security measures are perfect or impenetrable.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions or comments about this Privacy Policy, please contact us at: privacy@aegisai.com
        </p>
      </div>
    </div>
  );
}
