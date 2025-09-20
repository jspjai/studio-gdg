export default function TermsOfServicePage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="prose dark:prose-invert max-w-4xl mx-auto">
        <h1>Terms of Service</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using AegisAI (the "Service"), you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          AegisAI provides an AI-powered vulnerability assessment and penetration testing tool. The Service is provided "as is" and is for informational and educational purposes only. You must have explicit, written permission to scan any web application that you do not own.
        </p>

        <h2>3. Responsible Use</h2>
        <p>
          You agree not to use the Service for any illegal or unauthorized purpose. You are solely responsible for your conduct and any data you submit for scanning. Unauthorized scanning of websites is strictly prohibited and may be illegal.
        </p>

        <h2>4. Disclaimer of Warranties</h2>
        <p>
          The service is provided on an "as is" and "as available" basis. AegisAI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          In no event shall AegisAI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AegisAI's website, even if AegisAI or a AegisAI authorized representative has been notified orally or in writing of the possibility of such damage.
        </p>

        <h2>6. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new Terms of Service on this page.
        </p>
      </div>
    </div>
  );
}
