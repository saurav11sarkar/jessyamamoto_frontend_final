import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Delete Account | JetSet Cares",
  description:
    "Learn how to delete your JetSet Cares account in the app, request help, and understand what happens to your data.",
};

export default function DeleteAccountPage() {
  return (
    <div className="mt-10 bg-slate-50 pb-16 pt-32">
      <div className="container">
        <article className="mx-auto max-w-3xl rounded-2xl border border-[#c9f2ee] bg-white p-6 text-slate-700 shadow-sm md:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#287e77]">
            JetSet Cares · Account support
          </p>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            How to delete account
          </h1>
          <p className="mt-4 leading-relaxed">
            You can delete your JetSet Cares account from the mobile app. Follow
            the steps below to permanently close your account.
          </p>

          <section className="mt-8" aria-labelledby="deletion-steps">
            <h2 id="deletion-steps" className="text-xl font-bold text-slate-900">
              Delete your account in the app
            </h2>
            <ol className="mt-4 list-decimal space-y-3 pl-6 leading-relaxed">
              <li>Open the JetSet Cares app and sign in to your account.</li>
              <li>Go to Settings.</li>
              <li>Select Delete Account.</li>
              <li>Read the confirmation message and confirm your request.</li>
            </ol>
            <p className="mt-4 leading-relaxed">
              After successful deletion, you will be signed out and your account
              will no longer be available. Uninstalling the app does not delete
              your account.
            </p>
          </section>

          <section className="mt-8" aria-labelledby="account-data">
            <h2 id="account-data" className="text-xl font-bold text-slate-900">
              What happens to your data?
            </h2>
            <ul className="mt-4 list-disc space-y-3 pl-6 leading-relaxed">
              <li>
                Your account is deactivated, your name and email are anonymized,
                and personal profile, identity and location fields are removed
                from your account. Your login credentials can no longer be used.
              </li>
              <li>
                Services associated with your account become unavailable.
              </li>
              <li>
                Booking history, messages, reviews and payment records remain
                linked to an anonymized account. Text in past messages or reviews
                and previously uploaded files are not automatically erased.
              </li>
            </ul>
            <p className="mt-4 leading-relaxed">
              For more information about how we handle your information, read our{" "}
              <Link href="/privacy-policy" className="font-semibold text-[#287e77] underline underline-offset-4">
                Privacy Policy
              </Link>.
            </p>
          </section>

          <section className="mt-8 rounded-xl border border-[#c9f2ee] bg-[#f6fffe] p-5" aria-labelledby="deletion-help">
            <h2 id="deletion-help" className="text-xl font-bold text-slate-900">
              Need help or cannot access the app?
            </h2>
            <p className="mt-3 leading-relaxed">
              To request account deletion or help with removing associated data,
              email us from the email address registered to your account. Use the
              subject &ldquo;Account deletion request&rdquo;. We may need to verify
              account ownership before processing your request. Do not send your
              password or verification codes.
            </p>
            <a
              href="mailto:admin@jetsetcares.org?subject=Account%20deletion%20request"
              className="mt-4 inline-block break-all font-semibold text-[#287e77] underline underline-offset-4"
            >
              admin@jetsetcares.org
            </a>
          </section>
        </article>
      </div>
    </div>
  );
}
