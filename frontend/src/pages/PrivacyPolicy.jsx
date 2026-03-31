import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
  const [showText, setShowText] = useState(false);

  // Show hero text with fade-in animation
  useEffect(() => {
    setTimeout(() => setShowText(true), 200);
  }, []);

  return (
    <div className=" min-h-screen">
      <Helmet>
        <title>Privacy Policy | Net Lanka Travels</title>
        <meta
          name="description"
          content="Read Net Lanka Travels' privacy policy. Learn how we collect, use, and protect your personal information when booking Sri Lanka tours."
        />
        <link
          rel="canonical"
          href="https://www.netlankatravels.com/privacy-policy"
        />
      </Helmet>

      {/* HERO HEADER */}
      <div className="relative w-full h-[360px] md:h-[560px] flex items-center justify-center text-white overflow-hidden">
        <img
          src="/images/gl.webp"
          alt="About NetLanka Tours"
          className="absolute inset-0 w-full h-full object-cover"
          fetchpriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className={`absolute bottom-6 md:bottom-10 right-4 md:right-10 max-w-[90%] md:w-[360px] bg-black/80 text-white p-4 md:p-6 backdrop-blur-sm shadow-lg flex items-center justify-end transition-all duration-700 ease-out ${
            showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="text-xl md:text-3xl leading-snug text-right mr-4">
            Safe and Secure Travel...
          </h2>
          <div className="w-[2px] bg-white h-10 md:h-12"></div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-600">
        <Link to="/" className="hover:underline text-blue-600">
          Home
        </Link>{" "}
        / Privacy Policy
      </div>

      {/* Page Header */}
      <div className="">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-gray-500 text-lg">Net Lanka Travels</p>
          <br />
          <div className="border-b"></div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-12 text-gray-700">
        {/* About Net Lanka Travels */}
        <PolicySection title="About Net Lanka Travels">
          <p>
            Net Lanka Group is the parent company of Net Lanka Travels,
            dedicated to providing unforgettable Sri Lanka travel experiences.
            We specialize in custom tour packages, private day tours, and
            tailor-made adventures, combining local expertise, trusted service,
            and seamless planning for both domestic and international travelers.
          </p>
          <p>
            Net Lanka Travels, part of the trusted Net Lanka Group, is dedicated
            to providing international travelers with unforgettable Sri Lanka
            travel experiences. As a leading Sri Lanka travel agency, we
            specialize in custom tour packages, private day tours, and multi-day
            Sri Lanka itineraries tailored for couples, families, solo
            travelers, and small groups.
          </p>
          <p>
            Explore Sri Lanka’s ancient cultural cities, scenic hill country,
            pristine beaches, and vibrant wildlife with the guidance of our
            local experts and professional private drivers. From Sri Lanka
            honeymoon packages to adventure tours and wildlife safaris, we
            create memorable Sri Lanka holiday experiences that combine comfort,
            safety, and authentic local culture.
          </p>
          <p>
            At Net Lanka Travels, we take care of the planning so you can
            immerse yourself in the best places to visit in Sri Lanka, including
            Sigiriya, Kandy, Ella, Nuwara Eliya, Galle, and Yala National Park.
            Discover the island’s hidden gems and iconic attractions with a team
            committed to excellence, reliability, and personalized service.
          </p>
          <p>
            Discover Sri Lanka with Net Lanka Travels – experience the island
            the Net Lanka Group way.
          </p>
        </PolicySection>

        {/* This Policy */}
        <PolicySection title="This Policy">
          <p>
            This Privacy Policy explains what information we collect, how and
            why we collect it, and how it is used. We regularly review and
            update this policy to ensure transparency, data protection, and
            clarity for all our users and clients.
          </p>
        </PolicySection>

        {/* About Personal Data */}
        <PolicySection title="About Personal Data">
          <p>
            Personal data refers to any information that can identify a living
            individual. The processing of personal data is governed by
            applicable data protection laws including the General Data
            Protection Regulation (GDPR) for EU citizens. At Net Lanka Travels,
            we strive to treat all personal data with the highest level of care
            and security, regardless of where you are from.
          </p>
        </PolicySection>

        {/* How We Collect Data */}
        <PolicySection title="How We Collect Data">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Contact us via phone, email, WhatsApp, social media, or website
              forms
            </li>
            <li>Request travel information or quotations</li>
            <li>Subscribe to newsletters or marketing communications</li>
            <li>Book a travel package, tour, or related service</li>
          </ul>
          <p className="mt-2">
            Your data is securely stored in our internal systems. We may also
            use trusted email service providers to send newsletters or important
            updates. Data is never shared with unauthorized third parties.
          </p>
          <p>
            When you submit inquiries or subscribe to our mailing list, you will
            be requested to agree to our Privacy Policy and consent to receive
            communication. If you do not provide consent, your data will not be
            collected for marketing purposes.
          </p>
        </PolicySection>

        {/* Data We Collect */}
        <PolicySection title="Data We Collect">
          <ul className="list-disc pl-6 space-y-2">
            <li>Name</li>
            <li>Email address</li>
            <li>Contact number</li>
            <li>Country of residence</li>
            <li>Travel preferences or interests</li>
            <li>
              Booking info: address, passport details (if required), date of
              birth, emergency contact
            </li>
            <li>
              Special requirements or health conditions (if necessary for travel
              arrangements)
            </li>
          </ul>
        </PolicySection>

        {/* What Your Data Is Used For */}
        <PolicySection title="What Your Data Is Used For">
          <ul className="list-disc pl-6 space-y-2">
            <li>Providing travel quotations and information</li>
            <li>Discussing travel plans and arrangements</li>
            <li>Booking tours and travel services</li>
            <li>Sending requested information</li>
            <li>Service and booking updates</li>
            <li>Emergency notifications if required</li>
            <li>Customer service and support</li>
            <li>Marketing communications (only with your consent)</li>
            <li>
              Keeping you informed about new travel packages, promotions, and
              updates
            </li>
          </ul>
          <p className="mt-2">
            We do not sell or rent personal data to third parties. Data is used
            strictly for service delivery and operational requirements.
          </p>
        </PolicySection>

        {/* Marketing */}
        <PolicySection title="Information for Marketing Purposes">
          <p>
            With your consent, we may use your name and email to send travel
            updates, promotional offers, newsletters, and customized travel
            recommendations. You may unsubscribe at any time using the link in
            our emails or by contacting us directly.
          </p>
        </PolicySection>

        {/* Who Can Access Data */}
        <PolicySection title="Who Can Access Your Data">
          <p>
            Your data is only accessed by authorized Net Lanka Travels personnel
            when necessary to provide services. We do not share your data with
            third parties unless required to complete your booking or comply
            with legal obligations. Our website may contain external links. We
            are not responsible for privacy practices of third-party websites.
          </p>
        </PolicySection>

        {/* Cookies */}
        <PolicySection title="Cookies and Google">
          <p>
            Our website may use cookies for functionality, analytics, and
            advertising (such as Google Analytics and remarketing). Cookies help
            improve user experience and allow us to understand site usage. You
            may disable cookies in your browser settings. However, disabling
            cookies may affect website functionality and experience.
          </p>
          <p>
            For more info:{" "}
            <a
              href="https://www.aboutcookies.org"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.aboutcookies.org
            </a>
          </p>
        </PolicySection>

        {/* Testimonials */}
        <PolicySection title="Testimonials">
          <p>
            From time to time, we publish client testimonials on our website and
            marketing platforms. These testimonials may include your first name,
            surname initial, country, tour experience, and feedback rating. We
            ensure that no personally identifiable information is published
            without your consent, and it is not possible to identify you
            personally from the testimonials displayed.
          </p>
        </PolicySection>

        {/* Data Retention */}
        <PolicySection title="Data Retention and Security">
          <p>
            We retain personal data only for as long as necessary to fulfill the
            purpose it was collected for. Data is securely stored and regularly
            reviewed. Only authorized personnel have access, and strict measures
            are taken to ensure data protection.
          </p>
        </PolicySection>

        {/* Contact */}
        <PolicySection title="How to Contact Us">
          <p>
            Under applicable data protection laws, including GDPR, you have the
            right to view, edit, or request the removal of your personal data
            held by Net Lanka Travels. If you wish to make a data request or
            have any questions about our Privacy Policy, please contact us using
            the details below. Include your full name, email address, country,
            and details of your request so we can assist you efficiently.
          </p>
          <ul className="mt-3 space-y-1">
            <li>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:inquiries@netlankatravels.com"
                className="text-blue-600 underline"
              >
                inquiries@netlankatravels.com
              </a>
            </li>
            <li>
              <strong>Website:</strong>{" "}
              <a
                href="https://www.netlankatravels.com"
                className="text-blue-600 underline"
              >
                www.netlankatravels.com
              </a>
            </li>
            <li>
              <strong>Address:</strong> Kandy, Sri Lanka
            </li>
          </ul>
        </PolicySection>

        {/* Footer */}
        <div className="mt-16 border-t pt-6 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Net Lanka Travels. All rights reserved.
        </div>
      </div>
    </div>
  );
}

function PolicySection({ title, children }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="text-gray-700 leading-relaxed space-y-4">{children}</div>
    </section>
  );
}
