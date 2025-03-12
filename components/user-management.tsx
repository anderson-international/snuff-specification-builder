"use client"

import { useState } from "react"
import type { UserWithProfile } from "@/types/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Loader2, Trash2, UserPlus } from "lucide-react"
import { createUser, deleteUser, updateUserRole } from "@/lib/admin-actions"
import { Badge } from "@/components/ui/badge"

interface UserManagementProps {
  initialUsers: UserWithProfile[]
}

export default function UserManagement({ initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState<UserWithProfile[]>(initialUsers)
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    email: "",
    full_name: "",
    role: "user" as "admin" | "user",
  })

  const handleCreateUser = async () => {
    setIsCreating(true)

    try {
      const result = await createUser(newUser)

      if (result.success) {
        toast({
          title: "User created",
          description: `${newUser.full_name} has been added successfully.`,
        })

        // Add the new user to the list
        if (result.user) {
          setUsers([result.user, ...users])
        }

        // Reset form and close dialog
        setNewUser({
          email: "",
          full_name: "",
          role: "user",
        })
        setIsDialogOpen(false)
      } else {
        toast({
          title: "Error creating user",
          description: result.error || "An unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating user:", error)
      toast({
        title: "Error creating user",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const result = await deleteUser(userId)

      if (result.success) {
        toast({
          title: "User deleted",
          description: "The user has been deleted successfully.",
        })

        // Remove the user from the list
        setUsers(users.filter((user) => user.id !== userId))
      } else {
        toast({
          title: "Error deleting user",
          description: result.error || "An unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error deleting user",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const handleRoleChange = async (userId: string, newRole: "admin" | "user") => {
    try {
      const result = await updateUserRole(userId, newRole)

      if (result.success) {
        toast({
          title: "Role updated",
          description: `User role has been updated to ${newRole}.`,
        })

        // Update the user in the list
        setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
      } else {
        toast({
          title: "Error updating role",
          description: result.error || "An unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating role:", error)
      toast({
        title: "Error updating role",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Users ({users.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user who will be able to access the system.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="user@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: "admin" | "user") => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateUser} disabled={isCreating || !newUser.email || !newUser.full_name}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">No users found</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value: "admin" | "user") => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue>
                          <Badge variant={user.role === "admin" ? "default" : "outline"} className="text-xs">
                            {user.role}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{user.created_at && new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the user {user.full_name} ({user.email}). This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

