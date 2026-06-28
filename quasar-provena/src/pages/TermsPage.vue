<template>
  <div class="terms-page">
    <div class="page-header gsap-header">
      <div class="header-content">
        <h1>Terms and Conditions</h1>
        <p>Last updated: January 2026</p>
      </div>
    </div>

    <div class="terms-content gsap-card">
      <nav class="terms-nav">
        <ul>
          <li><a href="#service">Service Description</a></li>
          <li><a href="#responsibilities">User Responsibilities</a></li>
          <li><a href="#immutability">Blockchain Immutability</a></li>
          <li><a href="#warranty">No Warranty</a></li>
          <li><a href="#privacy">Privacy Policy</a></li>
          <li><a href="#governing">Governing Law</a></li>
        </ul>
      </nav>

      <div class="terms-body">
        <section id="intro">
          <p class="intro-text">
            Welcome to Provena. By using our document notarization services, you agree to these Terms and Conditions. Please read them carefully before using our platform.
          </p>
        </section>

        <section id="service">
          <h2>1. Service Description</h2>
          <p>
            Provena provides a decentralized document notarization service that creates cryptographic proofs anchored to the Bitcoin Cash (BCH) blockchain. Our service allows you to:
          </p>
          <ul>
            <li>Generate SHA-256 cryptographic hashes of your documents</li>
            <li>Anchor document hashes to the Bitcoin Cash blockchain via OP_RETURN transactions</li>
            <li>Verify document authenticity against blockchain records</li>
            <li>Generate temporary verification links for third-party proof sharing</li>
          </ul>
          <div class="highlight-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p><strong>Important:</strong> Provena does not store your original documents unless you explicitly choose to upload them to our servers. Only cryptographic hashes are permanently recorded on the blockchain.</p>
          </div>
        </section>

        <section id="responsibilities">
          <h2>2. User Responsibilities</h2>
          <p>By using Provena, you acknowledge and agree to the following:</p>

          <h3>2.1 Document Ownership</h3>
          <p>
            You represent that you have the legal right to notarize any document you submit to our service. You warrant that your use of Provena does not violate any applicable laws, regulations, or third-party rights.
          </p>

          <h3>2.2 Private Key Custody</h3>
          <p>
            Provena connects to your wallet through WizardConnect (Paytaca). You are solely responsible for:
          </p>
          <ul>
            <li>Securing your wallet credentials and private keys</li>
            <li>Authorizing transactions through your wallet application</li>
            <li>Maintaining access to your wallet for future verification purposes</li>
          </ul>
          <p>
            Provena does not have access to your private keys and cannot reverse or modify transactions once confirmed on the blockchain.
          </p>

          <h3>2.3 Transaction Fees</h3>
          <p>
            Each notarization requires a small amount of Bitcoin Cash to pay network transaction fees. You are responsible for maintaining sufficient BCH balance in your connected wallet to complete notarizations.
          </p>
        </section>

        <section id="immutability">
          <h2>3. Blockchain Immutability Disclaimer</h2>
          <div class="warning-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
              <p><strong>Irreversible Action:</strong> Once a document hash is anchored to the Bitcoin Cash blockchain, it cannot be removed, modified, or deleted. This is fundamental to blockchain technology and applies to all transactions, including those made through Provena.</p>
            </div>
          </div>
          <p>
            By using our service, you understand and accept that:
          </p>
          <ul>
            <li>Blockchain transactions are permanent and cannot be undone</li>
            <li>The cryptographic hash of your document will be publicly visible on the blockchain forever</li>
            <li>Anyone with access to the blockchain can verify that a document with that hash existed at the time of notarization</li>
            <li>Provena cannot delete or alter blockchain records under any circumstances</li>
          </ul>
          <p>
            Do not use Provena to notarize documents containing sensitive personal information if you may need such records removed in the future.
          </p>
        </section>

        <section id="warranty">
          <h2>4. No Warranty</h2>
          <p>
            PROVENA IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
          </p>
          <ul>
            <li>Warranties of merchantability or fitness for a particular purpose</li>
            <li>Guarantees that the service will be uninterrupted, timely, or error-free</li>
            <li>Guarantees regarding the accuracy or reliability of results</li>
          </ul>

          <h3>4.1 Network Dependencies</h3>
          <p>
            Our service relies on third-party infrastructure including:
          </p>
          <ul>
            <li><strong>Bitcoin Cash Network:</strong> Transaction confirmation times depend on network congestion and miner activity</li>
            <li><strong>Watchtower API:</strong> Balance checks and UTXO queries depend on Paytaca's Watchtower service</li>
            <li><strong>Block Explorers:</strong> Verification lookups depend on external blockchain explorer APIs</li>
          </ul>
          <p>
            We are not responsible for delays, failures, or inaccuracies caused by these external services.
          </p>

          <h3>4.2 Service Availability</h3>
          <p>
            We do not guarantee 24/7 availability of our servers or API endpoints. Scheduled and unscheduled maintenance may temporarily interrupt service.
          </p>
        </section>

        <section id="privacy">
          <h2>5. Privacy Policy Summary</h2>
          <p>
            We are committed to protecting your privacy. Key aspects of our data handling:
          </p>

          <h3>5.1 Document Hashes</h3>
          <p>
            Cryptographic hashes of your documents are permanently recorded on the public Bitcoin Cash blockchain. This is the core functionality of our service and cannot be avoided.
          </p>

          <h3>5.2 Document Storage</h3>
          <p>
            Original documents are <strong>not stored by default</strong>. If you choose the optional "Store file on server" feature:
          </p>
          <ul>
            <li>Files are stored unencrypted on our servers</li>
            <li>Files are associated with their blockchain record via temporary access tokens</li>
            <li>Files may be deleted after extended periods of inactivity</li>
            <li>We recommend using this feature only for non-sensitive documents</li>
          </ul>

          <h3>5.3 Personal Information</h3>
          <p>
            We do not require accounts or collect personal information. Email addresses provided for notifications are used solely for sending confirmation emails and are not stored permanently.
          </p>

          <h3>5.4 Wallet Information</h3>
          <p>
            Your wallet connection (via WizardConnect) reveals your public BCH address. This is necessary for transaction signing and is public information already visible on the blockchain.
          </p>

          <h3>5.5 Analytics</h3>
          <p>
            We may collect anonymous usage statistics to improve our service, including page views, feature usage, and error rates.
          </p>
        </section>

        <section id="governing">
          <h2>6. Governing Law</h2>
          <p>
            These Terms and Conditions shall be governed by and construed in accordance with the laws of [Jurisdiction Placeholder], without regard to its conflict of law provisions.
          </p>
          <p>
            Any disputes arising from or related to these terms shall be resolved through binding arbitration in [Jurisdiction Placeholder], or in the courts of [Jurisdiction Placeholder] if arbitration is not applicable.
          </p>
        </section>

        <section id="changes">
          <h2>7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any time. Changes will be posted on this page with an updated "Last updated" date. Continued use of Provena after changes constitutes acceptance of the revised terms.
          </p>
        </section>

        <section id="contact">
          <h2>8. Contact Information</h2>
          <p>
            For questions about these Terms and Conditions or our service, please contact us through:
          </p>
          <ul>
            <li>GitHub: <a href="https://github.com/provena" target="_blank" rel="noopener">github.com/provena</a></li>
            <li>Twitter: <a href="https://twitter.com/provena" target="_blank" rel="noopener">@provena</a></li>
          </ul>
        </section>
      </div>

      <div class="terms-footer">
        <router-link to="/" class="back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { gsap } from 'gsap'

onMounted(() => {
  gsap.from('.gsap-header', {
    y: -30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  })

  gsap.from('.gsap-card', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 0.2
  })
})
</script>

<style scoped>
.terms-page {
  padding-top: 40px;
  min-height: 100vh;
  background: var(--bg);
  padding-bottom: 80px;
}

.page-header {
  padding: 40px 24px;
  text-align: center;
  border-bottom: 1px solid var(--gb);
  background: var(--bgc);
  margin-bottom: 32px;
}

.header-content h1 {
  font-family: var(--fd);
  font-size: 2.4rem;
  font-weight: 800;
  color: var(--tx);
  margin: 0 0 12px;
  letter-spacing: -1px;
}

.header-content p {
  font-family: var(--fd);
  font-size: 0.9rem;
  color: var(--step-p);
  margin: 0;
}

.terms-content {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 24px;
}

.terms-nav {
  margin-bottom: 32px;
  position: sticky;
  top: 80px;
  z-index: 10;
}

.terms-nav ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  padding: 16px 20px;
  background: rgba(10, 21, 16, 0.5);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(34, 197, 94, 0.15);
  border-radius: 12px;
  margin: 0;
}

.terms-nav a {
  font-family: var(--fd);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--step-p);
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s;
  white-space: nowrap;
}

.terms-nav a:hover {
  color: var(--g);
  background: rgba(34, 197, 94, 0.1);
}

.terms-body {
  background: rgba(10, 21, 16, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(34, 197, 94, 0.15);
  border-radius: 20px;
  padding: 40px;
}

.terms-body section {
  margin-bottom: 40px;
}

.terms-body section:last-child {
  margin-bottom: 0;
}

.intro-text {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--tx);
  margin: 0 0 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.terms-body h2 {
  font-family: var(--fd);
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--tx);
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--g);
  display: inline-block;
}

.terms-body h3 {
  font-family: var(--fd);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--tx);
  margin: 24px 0 12px;
}

.terms-body p {
  font-size: 0.95rem;
  line-height: 1.75;
  color: var(--step-p);
  margin: 0 0 16px;
}

.terms-body ul {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
}

.terms-body li {
  position: relative;
  padding-left: 24px;
  margin-bottom: 10px;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--step-p);
}

.terms-body li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: var(--g);
}

.terms-body a {
  color: var(--g);
  text-decoration: none;
  transition: color 0.2s;
}

.terms-body a:hover {
  color: var(--gl);
  text-decoration: underline;
}

.highlight-box {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(34, 197, 94, 0.05);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;
  margin: 20px 0;
}

.highlight-box svg {
  flex-shrink: 0;
  color: var(--g);
  margin-top: 2px;
}

.highlight-box p {
  margin: 0;
  font-size: 0.9rem;
}

.warning-box {
  display: flex;
  gap: 14px;
  padding: 20px 24px;
  background: rgba(251, 191, 36, 0.05);
  border: 1px solid rgba(251, 191, 36, 0.25);
  border-radius: 12px;
  margin: 20px 0;
}

.warning-box svg {
  flex-shrink: 0;
  color: #fbbf24;
}

.warning-box p {
  margin: 0;
  font-size: 0.9rem;
  color: #fbbf24;
}

.terms-footer {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--fd);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--step-p);
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.back-link:hover {
  color: var(--g);
  border-color: var(--g);
  background: rgba(34, 197, 94, 0.08);
}

@media (max-width: 640px) {
  .terms-body {
    padding: 24px;
  }

  .terms-nav {
    position: static;
  }

  .terms-nav ul {
    flex-direction: column;
    gap: 4px;
  }

  .terms-nav a {
    display: block;
  }

  .terms-body h2 {
    font-size: 1.2rem;
  }

  .terms-body h3 {
    font-size: 1rem;
  }
}
</style>
