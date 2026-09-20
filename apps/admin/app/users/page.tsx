const users = [
  { name: "Jaswant Karun", email: "admin@nexus.ai", role: "OWNER", status: "Active", projects: 12 },
  { name: "Aarav Sharma", email: "aarav@example.com", role: "MANAGER", status: "Active", projects: 8 },
  { name: "Maya Patel", email: "maya@example.com", role: "USER", status: "Invited", projects: 3 },
];

export default function AdminUsersPage() {
  return (
    <main className="min-h-screen bg-[#090b12] p-5 text-slate-100 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Administration</p><h1 className="mt-2 text-3xl font-black tracking-tight text-white">Users</h1><p className="mt-2 text-sm text-slate-400">Manage platform access, roles, and organization activity.</p></header>
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111521]"><div className="flex items-center justify-between border-b border-white/[0.06] p-5"><h2 className="font-bold text-white">User directory</h2><button type="button" className="rounded-xl bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500">Invite user</button></div><div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">User</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Projects</th></tr></thead><tbody className="divide-y divide-white/[0.06]">{users.map((user) => <tr key={user.email}><td className="px-5 py-4"><p className="font-semibold text-white">{user.name}</p><p className="mt-1 text-xs text-slate-500">{user.email}</p></td><td className="px-5 py-4 text-xs text-cyan-300">{user.role}</td><td className="px-5 py-4"><span className={user.status === "Active" ? "text-emerald-400" : "text-amber-300"}>{user.status}</span></td><td className="px-5 py-4 text-slate-300">{user.projects}</td></tr>)}</tbody></table></div></section>
      </div>
    </main>
  );
}
