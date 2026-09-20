import Link from "next/link";
import ModuleLayout from "@/components/layout/ModuleLayout";

export default function NotificationSettingsPage() {
  return (
    <ModuleLayout
      title="Notification Settings"
      subtitle="Manage how Nexus AI keeps you informed."
      subnav={[{ label: "Notifications", href: "/notifications" }, { label: "Settings", href: "/notifications/settings" }]}
    >
      <section className="max-w-2xl rounded-2xl border border-white/[0.08] bg-dark-900/60 p-6">
        <h2 className="text-sm font-bold text-white">Delivery preferences</h2>
        <p className="mt-2 text-sm text-dark-300">Notification controls are available from the main settings area.</p>
        <Link href="/settings/notifications" className="mt-5 inline-flex rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-500">
          Open notification preferences
        </Link>
      </section>
    </ModuleLayout>
  );
}
