"use client"

import * as React from "react"
import Link from "next/link"
import AdminLayout from "@/components/admin/AdminLayout"
import { Users, UserPlus, ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UserItem {
  _id: string
  legacyId: string
  name: string
  email: string
  role: "Super Admin" | "Content Admin" | "Hiring Admin"
  status: "ACTIVE" | "INVITED" | "DISABLED"
  lastLoginAt?: string
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<UserItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState("")

  // Invite modal state
  const [showInviteModal, setShowInviteModal] = React.useState(false)
  const [inviteName, setInviteName] = React.useState("")
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [inviteRole, setInviteRole] = React.useState<"Super Admin" | "Content Admin" | "Hiring Admin">("Content Admin")
  const [inviting, setInviting] = React.useState(false)
  const [createdInviteUrl, setCreatedInviteUrl] = React.useState("")

  const fetchUsers = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      if (res.ok && data.data?.users) {
        setUsers(data.data.users)
      } else {
        setError(data.error?.message || "Failed to load admin users.")
      }
    } catch {
      setError("Network or server connection error.")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteName || !inviteEmail || inviting) return

    setInviting(true)
    setError("")
    setSuccess("")
    setCreatedInviteUrl("")

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: inviteName, email: inviteEmail, role: inviteRole }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSuccess(`Admin invitation generated for ${inviteEmail}.`)
        if (data.data?.inviteUrl) {
          setCreatedInviteUrl(data.data.inviteUrl)
        }
        setInviteName("")
        setInviteEmail("")
        fetchUsers()
      } else {
        setError(data.error?.message || "Failed to invite admin.")
      }
    } catch {
      setError("Failed to create admin invitation.")
    } finally {
      setInviting(false)
    }
  }

  const handleToggleStatus = async (user: UserItem) => {
    const nextStatus = user.status === "ACTIVE" ? "DISABLED" : "ACTIVE"
    if (!confirm(`Are you sure you want to change status of ${user.name} to ${nextStatus}?`)) return

    setError("")
    setSuccess("")

    try {
      const res = await fetch(`/api/admin/users/${user.legacyId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSuccess(`Updated ${user.name} status to ${nextStatus}.`)
        fetchUsers()
      } else {
        setError(data.error?.message || "Failed to update user status.")
      }
    } catch {
      setError("Error updating user status.")
    }
  }

  const handleRoleChange = async (user: UserItem, newRole: string) => {
    if (user.role === newRole) return
    if (!confirm(`Change role of ${user.name} to ${newRole}?`)) return

    setError("")
    setSuccess("")

    try {
      const res = await fetch(`/api/admin/users/${user.legacyId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSuccess(`Updated ${user.name} role to ${newRole}.`)
        fetchUsers()
      } else {
        setError(data.error?.message || "Failed to update user role.")
      }
    } catch {
      setError("Error updating user role.")
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-5 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-neutral-950 dark:text-neutral-50" />
              <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-neutral-950 dark:text-neutral-50">
                Admin Roster &amp; Account Management
              </h1>
            </div>
            <p className="text-xs font-mono text-neutral-500 mt-1">
              Authorized Super Admin Controls • Restricted Area
            </p>
          </div>

          <Button
            onClick={() => {
              setShowInviteModal(!showInviteModal)
              setCreatedInviteUrl("")
            }}
            className="bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 font-bold text-xs gap-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Invite New Admin</span>
          </Button>
        </div>

        {error && (
          <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-600 dark:text-red-400 font-mono">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div role="alert" className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-700 dark:text-emerald-400 font-mono">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Invite Admin Drawer/Card */}
        {showInviteModal && (
          <div className="rounded-2xl border border-neutral-300 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
              <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-950 dark:text-neutral-50">
                Invite New Administrator
              </h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-xs text-neutral-400 hover:text-neutral-600 font-mono"
              >
                [ Close ]
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor="inv-name" className="text-xs font-mono uppercase text-neutral-500">Full Name</Label>
                <Input
                  id="inv-name"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Sarah Jenkins"
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="inv-email" className="text-xs font-mono uppercase text-neutral-500">Email Address</Label>
                <Input
                  id="inv-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="sarah@olinethra.com"
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="inv-role" className="text-xs font-mono uppercase text-neutral-500">Assigned Role</Label>
                <select
                  id="inv-role"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-neutral-300 bg-white px-3 py-1 text-xs text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 focus:outline-none"
                >
                  <option value="Content Admin">Content Admin</option>
                  <option value="Hiring Admin">Hiring Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={inviting || !inviteName || !inviteEmail}
                  className="bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950 font-bold text-xs"
                >
                  {inviting ? "Creating Invitation..." : "Send Admin Invitation"}
                </Button>
              </div>
            </form>

            {createdInviteUrl && (
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1 text-xs">
                <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  Invitation Link Generated (Expires in 24 Hours):
                </p>
                <input
                  type="text"
                  readOnly
                  value={createdInviteUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full font-mono text-[11px] p-2 rounded border border-neutral-300 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200"
                />
              </div>
            )}
          </div>
        )}

        {/* Admin Roster Table */}
        <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-neutral-500">
              Loading Administrator Roster...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-6 py-3.5">Administrator</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Last Login</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {users.map((u) => (
                    <tr key={u.legacyId} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 font-sans">
                        <div className="font-bold text-neutral-950 dark:text-neutral-50">{u.name}</div>
                        <div className="font-mono text-xs text-neutral-500">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u, e.target.value)}
                          className="rounded border border-neutral-300 bg-white px-2 py-1 text-xs font-mono font-semibold dark:border-neutral-700 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50"
                        >
                          <option value="Super Admin">Super Admin</option>
                          <option value="Content Admin">Content Admin</option>
                          <option value="Hiring Admin">Hiring Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {u.status === "ACTIVE" && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>ACTIVE</span>
                          </span>
                        )}
                        {u.status === "INVITED" && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                            <Clock className="h-3 w-3" />
                            <span>INVITED</span>
                          </span>
                        )}
                        {u.status === "DISABLED" && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
                            <XCircle className="h-3 w-3" />
                            <span>DISABLED</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-neutral-500 text-[11px]">
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(u)}
                          className={`text-xs h-8 ${
                            u.status === "ACTIVE"
                              ? "border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                              : "border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400"
                          }`}
                        >
                          {u.status === "ACTIVE" ? "Disable" : "Enable"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
