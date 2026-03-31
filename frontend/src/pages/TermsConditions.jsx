import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function TermsConditions() {
  const [showText, setShowText] = useState(false);

  // Show hero text with fade-in animation
  useEffect(() => {
    setTimeout(() => setShowText(true), 200);
  }, []);

  return (
    <div className="min-h-screen">
       <Helmet>
        <title>Terms & Conditions | Net Lanka Travels</title>
        <meta
          name="description"
          content="Read the terms and conditions for using Net Lanka Travels services and booking Sri Lanka tours."
        />
        <link rel="canonical" href="https://www.netlankatravels.com/terms-and-conditions" />
      </Helmet>

      {/* HERO HEADER */}
      <div className="relative w-full h-[360px] md:h-[560px] flex items-center justify-center text-white overflow-hidden">
        <img
          src="/images/lo.webp"
          alt="Terms & Conditions - Net Lanka Travels"
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
            Your Agreement with Us...
          </h2>
          <div className="w-[2px] bg-white h-10 md:h-12"></div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-600">
        <Link to="/" className="hover:underline text-blue-600">Home</Link> / Terms & Conditions
      </div>

      {/* Page Header */}
      <div className="">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-gray-500 text-lg">Net Lanka Travels</p>
          <br />
          <div className="border-b"></div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-12 text-gray-700">
        <PolicySection title="User Agreement">
          <p>
            Access to and use of the www.netlankatravels.com website is conditional upon your acceptance
            of these Terms and Conditions. Please read the following terms carefully before using this website.
            If you do not agree with any part of these Terms and Conditions, you must not use this website.
          </p>
          <p>
            Any use of the www.netlankatravels.com website or written communication with Net Lanka
            Travels for the purpose of travel inquiries or bookings confirms that you are aged 18 or over and
            that you have read, understood, and accepted these Terms and Conditions. These Terms are
            designed for the protection of both you and Net Lanka Travels.
          </p>
          <p>
            Net Lanka Travels operates under the Net Lanka Group, a trusted Sri Lankan travel service
            provider offering professional travel solutions, tour packages, transportation, and guided travel
            services for international and local travelers.
          </p>
        </PolicySection>

        <PolicySection title="Booking Conditions">
          <p>
            Net Lanka Travels functions as a professional Sri Lanka tour operator, partnering with trusted
            hotels, service providers, transport suppliers, professional drivers, and guides across Sri Lanka.
          </p>
          <p>When a traveler books a tour package through Net Lanka Travels:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We arrange and coordinate accommodation, transportation, tours, and travel services.</li>
            <li>Travelers will be provided with guided assistance, support, and professional tour handling
            during their trip.</li>
          </ul>
          <p>
            By placing a booking, you agree to the relevant Terms & Conditions of Net Lanka Travels and
            any applicable supplier Terms & Conditions.
          </p>
        </PolicySection>

        <PolicySection title="Booking Your Holiday">
          <p>A booking is confirmed only after we receive:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your written confirmation</li>
            <li>Either full payment OR a non-refundable deposit of 30% of the total tour value</li>
          </ul>
          <p>
            Bookings should ideally be made at least 3 days before the tour start date.
            If the booking is made less than 3 days before the travel date, full payment may be required
            immediately. Your payment and written confirmation indicate acceptance of these Terms & Conditions.
          </p>
        </PolicySection>

        <PolicySection title="Final Payment">
          <p>
            Full payment of your tour package must be completed before the tour starts. If full payment is not
            received within the communicated deadline, Net Lanka Travels reserves the right to cancel the
            booking.
          </p>
        </PolicySection>

        <PolicySection title="Methods of Payment">
          <p>
            Payments to Net Lanka Travels must be made only to the official company account of Net Lanka
            Group Private Limited. We accept the following payment methods:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Bank Transfer:</strong> Payments can be made via international or local bank transfer.
              Please note: Any bank charges outside Sri Lanka must be borne by the sender.
            </li>
            <li>
              <strong>Credit or Debit Card:</strong> Customers may pay using Visa or MasterCard.
              An additional handling fee of 2.65% will be applied to card payments.
              All card transactions are processed securely through a payment gateway.
              Net Lanka Travels does not store or have access to your card details.
            </li>
          </ul>
          <p>
            No payments should be made to any personal accounts, third-party accounts, or unidentified accounts.
            Net Lanka Travels and Net Lanka Groups Private Limited will not be responsible for funds transferred to any unofficial accounts. 
          </p>
        </PolicySection>
    <PolicySection title="Accommodation – Terms & Conditions">
  <p>
    Accommodation bookings are arranged based on the guest’s selected tour
    package and personal preferences.
  </p>
  <p>
    After the guest selects a tour package, Net Lanka Travels will provide a
    quotation including accommodation details such as hotel names, room category,
    meal plan, and stay duration.
  </p>
  <p>
    Guests may select hotels listed on our website or request any other hotel of
    their choice.
  </p>
  <p>
    Full payment for accommodation must be paid directly to the selected hotel by
    the guest.
  </p>
  <p>
    Net Lanka Travels acts only as a facilitator in arranging accommodation and
    does not collect hotel payments.
  </p>
  <p>
    Once the guest checks in to the selected hotel, Net Lanka Travels will not be
    responsible or liable for hotel services, including but not limited to room
    quality, facilities, staff behavior, hygiene standards, food, or any issues
    arising during the stay.
  </p>
  <p>
    Any complaints, damages, losses, or disputes related to accommodation must be
    resolved directly between the guest and the hotel.
    <br />
    <br/>
    <strong className="text-black">Special Note</strong><br />
Accommodation rates and availability are subject to change until confirmed by the hotel.
Hotel names, room categories, meal plans, and stay duration provided in the quotation are indicative and may vary due to hotel policies or seasonal demand.
Any upgrades, extra services, or special requests requested by the guest at the hotel will be charged directly by the hotel.
Net Lanka Travels shall not be held responsible for any changes, issues, or additional charges imposed by the hotel after check-in.
Guests are advised to review hotel policies and services prior to arrival to avoid misunderstandings.
  </p>
</PolicySection>

        <PolicySection title="Price Policy">
          <p>
            Net Lanka Travels provides customized travel packages based on selected services.
            Prices are calculated based on hotels, transport, excursions, guides, and other included items.
          </p>
          <p>If travelers wish to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Add additional activities</li>
            <li>Upgrade hotels</li>
            <li>Extend services</li>
            <li>Add extra transport or tours</li>
          </ul>
          <p>
            They must contact Net Lanka Travels directly, and any additional charges will apply accordingly.
            All prices are generally quoted in US Dollars, unless otherwise stated.
          </p>
        </PolicySection>

        <PolicySection title="Amendments & Cancellations">
          <p>
            If you wish to amend or cancel your booking, you must notify us in writing.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Cancellation or amendment requests must be made at least 3 days prior to the tour start date.</li>
            <li>An administrative fee of USD 25 will be charged for cancellations or amendments.</li>
            <li>
              If cancellation is made less than 3 days before travel, refund eligibility will depend on supplier policies,
              and some components may be non-refundable.
            </li>
          </ul>
          <p>No refunds are applicable once the tour has commenced, or for unused services.</p>
        </PolicySection>

        <PolicySection title="Travel Insurance">
          <p>
            We strongly recommend all travelers to obtain personal travel insurance that covers medical,
            cancellation, loss of luggage, and other travel risks. If you do not already have travel insurance,
            you may request assistance from Net Lanka Travels to arrange suitable coverage before arrival in Sri Lanka.
          </p>
        </PolicySection>

        <PolicySection title="Health, Passport & Visas">
          <p>
            It is the traveler’s responsibility to ensure they possess valid passports, visas, health requirements,
            and travel documents. Net Lanka Travels will assist with guidance if needed but will not be
            responsible for issues caused by incorrect travel documents.
          </p>
        </PolicySection>

        <PolicySection title="Responsibility & Liability">
          <p>
            Net Lanka Travels acts as a coordinator between travelers and service providers. While every effort
            is made to ensure smooth service delivery, we cannot be held responsible for circumstances beyond
            our control including but not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Natural disasters</li>
            <li>Strikes</li>
            <li>Delays</li>
            <li>Accidents</li>
            <li>Force majeure situations</li>
            <li>Supplier failures</li>
          </ul>
          <p>
            Where alternative arrangements are required, we will do our best to provide equal or better service replacements.
          </p>
        </PolicySection>

        <PolicySection title="Behavior">
          <p>
            Travelers are expected to behave respectfully during their tour. If any traveler behaves in a manner
            that causes disruption, danger, or damage, Net Lanka Travels reserves the right to terminate
            services without refund.
          </p>
        </PolicySection>

        <PolicySection title="Complaints">
          <p>
            If you have a complaint during your tour, please:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Contact your assigned travel coordinator or guide immediately, OR</li>
            <li>Email or contact Net Lanka Travels directly</li>
          </ul>
          <p>
            We will do our best to resolve the issue promptly. If unresolved during the trip, travelers may
            submit a formal written complaint after completion of the tour.
          </p>
          <ul className="mt-3 space-y-1">
            <li><strong>Email:</strong> <a href="mailto:inquiries@netlankatravels.com" className="text-blue-600 underline">inquiries@netlankatravels.com</a></li>
            <li><strong>Website:</strong> <a href="https://www.netlankatravels.com" className="text-blue-600 underline">www.netlankatravels.com</a></li>
          </ul>
        </PolicySection>

        <PolicySection title="Electronic Communication">
          <p>
            By using our website or contacting us, you agree to receive communication electronically.
          </p>
        </PolicySection>

        <PolicySection title="Copyright">
          <p>
            All website content, images, text, and material belong to Net Lanka Travels and cannot be copied
            or reused without written permission.
          </p>
        </PolicySection>

        <PolicySection title="Governing Law">
          <p>
            These Terms & Conditions are governed by the Laws of Sri Lanka.
          </p>
        </PolicySection>

        {/* Footer */}
        <div className="mt-16 border-t pt-6 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Net Lanka Travels  <br></br> All rights reserved.
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
