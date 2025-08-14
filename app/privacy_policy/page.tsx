// app/privacy-policy/page.jsx
import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-2">
            PRIVACY POLICY
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Last updated <span className="font-semibold">November 08, 2024</span>
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-8 text-gray-700 leading-relaxed text-base">
          <p className="mb-4">
            This Privacy Notice for <span className="font-semibold">Ango24 Services Private Limited</span> (
            <span className="font-semibold">"we"</span>, <span className="font-semibold">"us"</span>, or <span className="font-semibold">"our"</span>
            ), describes how and why we might access, collect, store, use, and/or share (
            <span className="font-semibold">"process"</span>) your personal information when you use our services (
            <span className="font-semibold">"Services"</span>), including when you:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>
              Visit our website at{' '}
              <a href="https://www.attirelly.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                https://www.attirelly.com
              </a>
              , or any website of ours that links to this Privacy Notice.
            </li>
            <li>
              Engage with us in other related ways, including any sales, marketing, or events.
            </li>
          </ul>
          <p>
            <span className="font-bold">Questions or concerns? </span>
            Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at{' '}
            <a href="mailto:info@attirelly.com" className="text-blue-600 hover:underline">info@attirelly.com</a>.
          </p>
        </div>

        {/* Summary of Key Points */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">SUMMARY OF KEY POINTS</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold italic">
              This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our{' '}
            </span>
            <a href="#toc" className="text-blue-600 hover:underline font-semibold italic">
              table of contents
            </a>
            <span className="font-semibold italic"> below to find the section you are looking for.</span>
          </p>

          <ul className="space-y-3 text-gray-700 leading-relaxed">
            <li>
              <span className="font-semibold">What personal information do we process?</span> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use. Learn more about{' '}
              <a href="#personalinfo" className="text-blue-600 hover:underline">personal information you disclose to us</a>.
            </li>
            <li>
              <span className="font-semibold">Do we process any sensitive personal information?</span> Some of the information may be considered "special" or "sensitive" in certain jurisdictions, for example your racial or ethnic origins, sexual orientation, and religious beliefs. We do not process sensitive personal information.
            </li>
            <li>
              <span className="font-semibold">Do we collect any information from third parties?</span> We do not collect any information from third parties.
            </li>
            <li>
              <span className="font-semibold">How do we process your information?</span> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. Learn more about{' '}
              <a href="#infouse" className="text-blue-600 hover:underline">how we process your information</a>.
            </li>
            <li>
              <span className="font-semibold">In what situations and with which types of parties do we share personal information?</span> We may share information in specific situations and with specific categories of third parties. Learn more about{' '}
              <a href="#whoshare" className="text-blue-600 hover:underline">when and with whom we share your personal information</a>.
            </li>
            <li>
              <span className="font-semibold">How do we keep your information safe?</span> We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Learn more about{' '}
              <a href="#infosafe" className="text-blue-600 hover:underline">how we keep your information safe</a>.
            </li>
            <li>
              <span className="font-semibold">What are your rights?</span> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. Learn more about{' '}
              <a href="#privacyrights" className="text-blue-600 hover:underline">your privacy rights</a>.
            </li>
            <li>
              <span className="font-semibold">How do you exercise your rights?</span> The easiest way to exercise your rights is by visiting{' '}
              <a href="mailto:info@attirelly.com" className="text-blue-600 hover:underline">info@attirelly.com</a>, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.
            </li>
            <li>
              Want to learn more about what we do with any information we collect?{' '}
              <a href="#toc" className="text-blue-600 hover:underline">Review the Privacy Notice in full</a>.
            </li>
          </ul>
        </section>

        {/* Table of Contents */}
        <section id="toc" className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">TABLE OF CONTENTS</h2>
          <ul className="space-y-2 text-blue-600">
            <li><a href="#infocollect" className="hover:underline">1. WHAT INFORMATION DO WE COLLECT?</a></li>
            <li><a href="#infouse" className="hover:underline">2. HOW DO WE PROCESS YOUR INFORMATION?</a></li>
            <li><a href="#whoshare" className="hover:underline">3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</a></li>
            <li><a href="#cookies" className="hover:underline">4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</a></li>
            <li><a href="#sociallogins" className="hover:underline">5. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</a></li>
            <li><a href="#inforetain" className="hover:underline">6. HOW LONG DO WE KEEP YOUR INFORMATION?</a></li>
            <li><a href="#infosafe" className="hover:underline">7. HOW DO WE KEEP YOUR INFORMATION SAFE?</a></li>
            <li><a href="#privacyrights" className="hover:underline">8. WHAT ARE YOUR PRIVACY RIGHTS?</a></li>
            <li><a href="#DNT" className="hover:underline">9. CONTROLS FOR DO-NOT-TRACK FEATURES</a></li>
            <li><a href="#policyupdates" className="hover:underline">10. DO WE MAKE UPDATES TO THIS NOTICE?</a></li>
            <li><a href="#contact" className="hover:underline">11. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</a></li>
            <li><a href="#request" className="hover:underline">12. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</a></li>
            <li><a href="#instagram-data-use" className="hover:underline">13. HOW ARE WE USING YOUR INSTAGRAM DATA?</a></li>
            <li><a href="#instagram-data-delete" className="hover:underline">14. HOW CAN YOU DELETE INSTAGRAM INTEGRATION DATA?</a></li>
          </ul>
        </section>

        {/* Section 1: What Information Do We Collect? */}
        <section id="infocollect" className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">1. WHAT INFORMATION DO WE COLLECT?</h2>
          <h3 id="personalinfo" className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Personal information you disclose to us</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold italic">In Short: </span>
            <span className="italic">We collect personal information that you provide to us.</span>
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold">Personal Information Provided by You.</span> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 leading-relaxed mb-4">
            <li>names</li>
            <li>phone numbers</li>
            <li>email addresses</li>
            <li>mailing addresses</li>
            <li>usernames</li>
            <li>passwords</li>
            <li>contact preferences</li>
            <li>contact or authentication data</li>
            <li>billing addresses</li>
            <li>debit/credit card numbers</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold">Sensitive Information.</span> We do not process sensitive information.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold">Social Media Login Data.</span> We may provide you with the option to register with us using your existing social media account details, like your Facebook, X, or other social media account. If you choose to register in this way, we will collect certain profile information about you from the social media provider, as described in the section called{' '}
            <a href="#sociallogins" className="text-blue-600 hover:underline">HOW DO WE HANDLE YOUR SOCIAL LOGINS?</a> below.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Information automatically collected</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold italic">In Short: </span>
            <span className="italic">Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.</span>
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">The information we collect includes:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 leading-relaxed">
            <li>
              <span className="font-semibold italic">Log and Usage Data.</span> Log and usage data is service-related, diagnostic, usage, and performance information our servers automatically collect when you access or use our Services and which we record in log files. Depending on how you interact with us, this log data may include your IP address, device information, browser type, and settings and information about your activity in the Services (such as the date/time stamps associated with your usage, pages and files viewed, searches, and other actions you take such as which features you use), device event information (such as system activity, error reports (sometimes called "crash dumps"), and hardware settings).
            </li>
            <li>
              <span className="font-semibold italic">Device Data.</span> We collect device data such as information about your computer, phone, tablet, or other device you use to access the Services. Depending on the device used, this device data may include information such as your IP address (or proxy server), device and application identification numbers, location, browser type, hardware model, Internet service provider and/or mobile carrier, operating system, and system configuration information.
            </li>
            <li>
              <span className="font-semibold italic">Location Data.</span> We collect location data such as information about your device's location, which can be either precise or imprecise. How much information we collect depends on the type and settings of the device you use to access the Services. For example, we may use GPS and other technologies to collect geolocation data that tells us your current location (based on your IP address). You can opt out of allowing us to collect this information either by refusing access to the information or by disabling your Location setting on your device. However, if you choose to opt out, you may not be able to use certain aspects of the Services.
            </li>
          </ul>
        </section>

        {/* Section 2: How Do We Process Your Information? */}
        <section id="infouse" className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold italic">In Short: </span>
            <span className="italic">We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</span>
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold">We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</span>
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
            <li>
              <span className="font-semibold">To facilitate account creation and authentication and otherwise manage user accounts.</span> We may process your information so you can create and log in to your account, as well as keep your account in working order.
            </li>
            <li>
              <span className="font-semibold">To deliver and facilitate delivery of services to the user.</span> We may process your information to provide you with the requested service.
            </li>
            <li>
              <span className="font-semibold">To respond to user inquiries/offer support to users.</span> We may process your information to respond to your inquiries and solve any potential issues you might have with the requested service.
            </li>
            <li>
              <span className="font-semibold">To fulfill and manage your orders.</span> We may process your information to fulfill and manage your orders, payments, returns, and exchanges made through the Services.
            </li>
            <li>
              <span className="font-semibold">To enable user-to-user communications.</span> We may process your information if you choose to use any of our offerings that allow for communication with another user.
            </li>
            <li>
              <span className="font-semibold">To request feedback.</span> We may process your information when necessary to request feedback and to contact you about your use of our Services.
            </li>
            <li>
              <span className="font-semibold">To send you marketing and promotional communications.</span> We may process the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences. You can opt out of our marketing emails at any time. For more information, see{' '}
              <a href="#privacyrights" className="text-blue-600 hover:underline">WHAT ARE YOUR PRIVACY RIGHTS?</a> below.
            </li>
            <li>
              <span className="font-semibold">To deliver targeted advertising to you.</span> We may process your information to develop and display personalized content and advertising tailored to your interests, location, and more.
            </li>
            <li>
              <span className="font-semibold">To evaluate and improve our Services, products, marketing, and your experience.</span> We may process your information when we believe it is necessary to identify usage trends, determine the effectiveness of our promotional campaigns, and to evaluate and improve our Services, products, marketing, and your experience.
            </li>
            <li>
              <span className="font-semibold">To identify usage trends.</span> We may process information about how you use our Services to better understand how they are being used so we can improve them.
            </li>
            <li>
              <span className="font-semibold">To determine the effectiveness of our marketing and promotional campaigns.</span> We may process your information to better understand how to provide marketing and promotional campaigns that are most relevant to you.
            </li>
          </ul>
        </section>

        {/* Section 3: When and With Whom Do We Share Your Personal Information? */}
        <section id="whoshare" className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold italic">In Short: </span>
            <span className="italic">We may share information in specific situations described in this section and/or with the following categories of third parties.</span>
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold">Vendors, Consultants, and Other Third-Party Service Providers.</span> We may share your data with third-party vendors, service providers, contractors, or agents (<span className="font-semibold">"third parties"</span>) who perform services for us or on our behalf and require access to such information to do that work.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">The categories of third parties we may share personal information with are as follows:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 leading-relaxed mb-4">
            <li>Affiliate Marketing Programs</li>
            <li>Data Analytics Services</li>
            <li>Payment Processors</li>
            <li>Retargeting Platforms</li>
            <li>Social Networks</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4">We also may need to share your personal information in the following situations:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
            <li>
              <span className="font-semibold">Business Transfers.</span> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
            </li>
            <li>
              <span className="font-semibold">Other Users.</span> When you share personal information (for example, by posting comments, contributions, or other content to the Services) or otherwise interact with public areas of the Services, such personal information may be viewed by all users and may be publicly made available outside the Services in perpetuity. If you interact with other users of our Services and register for our Services through a social network (such as Facebook), your contacts on the social network will see your name, profile photo, and descriptions of your activity. Similarly, other users will be able to view descriptions of your activity, communicate with you within our Services, and view your profile.
            </li>
          </ul>
        </section>

        {/* Section 4: Do We Use Cookies and Other Tracking Technologies? */}
        <section id="cookies" className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold italic">In Short: </span>
            <span className="italic">We may use cookies and other tracking technologies to collect and store your information.</span>
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
          </p>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Google Analytics</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may share your information with Google Analytics to track and analyze the use of the Services. The Google Analytics Advertising Features that we may use include: Google Analytics Demographics and Interests Reporting. To opt out of being tracked by Google Analytics across the Services, visit{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener noreferrer" target="_blank" className="text-blue-600 hover:underline">https://tools.google.com/dlpage/gaoptout</a>.
            You can opt out of Google Analytics Advertising Features through{' '}
            <a href="https://adssettings.google.com/" rel="noopener noreferrer" target="_blank" className="text-blue-600 hover:underline">Ads Settings</a> and Ad Settings for mobile apps. Other opt out means include{' '}
            <a href="http://optout.networkadvertising.org/" rel="noopener noreferrer" target="_blank" className="text-blue-600 hover:underline">http://optout.networkadvertising.org/</a> and{' '}
            <a href="http://www.networkadvertising.org/mobile-choice" rel="noopener noreferrer" target="_blank" className="text-blue-600 hover:underline">http://www.networkadvertising.org/mobile-choice</a>.
            For more information on the privacy practices of Google, please visit the{' '}
            <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank" className="text-blue-600 hover:underline">Google Privacy & Terms page</a>.
          </p>
        </section>

        {/* Section 5: How Do We Handle Your Social Logins? */}
        <section id="sociallogins" className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">5. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold italic">In Short: </span>
            <span className="italic">If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.</span>
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or X logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            We will use the information we receive only for the purposes that are described in this Privacy Notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps.
          </p>
        </section>

        {/* Section 6: How Long Do We Keep Your Information? */}
        <section id="inforetain" className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">6. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold italic">In Short: </span>
            <span className="italic">We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.</span>
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
          </p>
        </section>

        {/* Section 7: How Do We Keep Your Information Safe? */}
        <section id="infosafe" className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">7. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold italic">In Short: </span>
            <span className="italic">We aim to protect your personal information through a system of organizational and technical security measures.</span>
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.
          </p>
        </section>

        {/* Section 8: Do We Collect Information From Minors? */}
        <section id="infominors" className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">8. DO WE COLLECT INFORMATION FROM MINORS?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold italic">In Short: </span>
            <span className="italic">We do not knowingly collect data from or market to children under 18 years of age.</span>
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at{' '}
            <a href="mailto:info@attirelly.com" className="text-blue-600 hover:underline">info@attirelly.com</a>.
          </p>
        </section>

        {/* Section 9: What Are Your Privacy Rights? */}
        <section id="privacyrights" className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">9. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold italic">In Short: </span>
            <span className="italic">You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.</span>
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold underline">Withdrawing your consent:</span> If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section{' '}
            <a href="#contact" className="text-blue-600 hover:underline">"HOW CAN YOU CONTACT US ABOUT THIS NOTICE?"</a> below.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold underline">Opting out of marketing and promotional communications:</span> You can unsubscribe from our marketing and promotional communications at any time by clicking on the unsubscribe link in the emails that we send, or by contacting us using the details provided in the section{' '}
            <a href="#contact" className="text-blue-600 hover:underline">"HOW CAN YOU CONTACT US ABOUT THIS NOTICE?"</a> below. You will then be removed from the marketing lists. However, we may still communicate with you — for example, to send you service-related messages that are necessary for the administration and use of your account, to respond to service requests, or for other non-marketing purposes.
          </p>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Account Information</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you would at any time like to review or change the information in your account or terminate your account, you can:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 leading-relaxed mb-4">
            <li>Contact us at{' '}
              <a href="mailto:support@attirelly.com" className="text-blue-600 hover:underline">support@attirelly.com</a> with your account details.
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4">
            Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have questions or comments about your privacy rights, you may email us at{' '}
            <a href="mailto:info@attirelly.com" className="text-blue-600 hover:underline">info@attirelly.com</a>.
          </p>
        </section>

        {/* Section 10: Controls for Do-Not-Track Features */}
        <section id="DNT" className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">10. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold italic">In Short: </span>
            <span className="italic">We do not knowingly collect data from or market to children under 18 years of age.</span>
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice.
          </p>
        </section>

        {/* Section 11: Do We Make Updates to This Notice? */}
        <section id="policyupdates" className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">11. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            <span className="font-semibold italic">In Short: </span>
            <span className="italic">Yes, we will update this notice as necessary to stay compliant with relevant laws.</span>
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Revised" date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.
          </p>
        </section>

        {/* Section 12: How Can You Contact Us About This Notice? */}
        <section id="contact" className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have questions or comments about this notice, you may email us at{' '}
            <a href="mailto:info@attirelly.com" className="text-blue-600 hover:underline">info@attirelly.com</a> or contact us by post at:
          </p>
          <address className="not-italic text-gray-700 leading-relaxed mb-4">
            Ango24 Services Private Limited<br />
            97, Guru Gobind Singh Nagar, Samrala Chowk<br />
            Ludhiana, Punjab 141008<br />
            India
          </address>
        </section>

        {/* Section 13: How Can You Review, Update, or Delete the Data We Collect From You? */}
        <section id="request" className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please visit:{' '}
            <a href="mailto:info@attirelly.com" className="text-blue-600 hover:underline">info@attirelly.com</a>.
          </p>
        </section>

        {/* Section 14: How Are We Using Your Instagram Data? */}
        <section id="instagram-data-use" className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">14. HOW ARE WE USING YOUR INSTAGRAM DATA?</h2>
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>
              When you connect your Instagram Business Account to Attirelly, we access certain data via the Instagram Graph API, with your explicit permission. This data is used solely to help you showcase your product portfolio on the Attirelly platform.
            </p>
            <p>
              <span className="font-semibold">What We Access:</span><br />
              Your connected Instagram Business Account information (e.g., username, profile picture)<br />
              Your Instagram posts (media, captions, timestamps)
            </p>
            <p>
              <span className="font-semibold">Why We Access It:</span><br />
              To display your Instagram posts as a live, visual storefront on your Attirelly profile.<br />
              To automatically update your product showcase when you post new content on Instagram.<br />
              To verify and link the correct Facebook Page associated with your business account.
            </p>
            <p>
              <span className="font-semibold">How We Use It:</span><br />
              Your Instagram content is displayed publicly on your Attirelly store page, exactly as it appears on Instagram.<br />
              We do not store, sell, or share your Instagram data with third parties.<br />
              We do not access or collect any private messages, personal data, or follower information.
            </p>
            <p>
              <span className="font-semibold">Your Control:</span><br />
              You can revoke access at any time through your Facebook/Instagram settings.<br />
              Disconnecting your account will remove your Instagram content from your Attirelly profile.<br />
              We use this data solely on your behalf to help promote your business on our platform in a seamless, automated way.
            </p>
          </div>
        </section>

        {/* Section 15: How Can You Delete Instagram Integration Data? */}
        <section id="instagram-data-delete" className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">15. HOW CAN YOU DELETE INSTAGRAM INTEGRATION DATA?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            To delete Instagram integration data, please follow steps mentioned here -{' '}
            <br></br>
            <a href="/insta_data_delete" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://attirelly.com/insta_data_delete</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
