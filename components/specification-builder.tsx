"use client"

import { useState, useEffect } from "react"
import type { ShopifyProduct } from "@/types/shopify"
import type { SnuffSpecification } from "@/types/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Trash2, Edit, AlertCircle } from "lucide-react"
import Image from "next/image"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { saveSpecification, updateSpecification, deleteSpecification } from "@/lib/supabase-actions"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
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

interface SpecificationBuilderProps {
  product: ShopifyProduct
  existingSpecifications?: SnuffSpecification[]
}

export default function SpecificationBuilder({ product, existingSpecifications = [] }: SpecificationBuilderProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [specification, setSpecification] = useState<Partial<SnuffSpecification>>({
    product_id: product.id,
    product_title: product.title,
    ease_of_use: "Beginner",
    nicotine_content: "Low",
  })

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
  }, [supabase])

  const handleChange = (field: keyof SnuffSpecification, value: string) => {
    setSpecification((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save specifications",
        variant: "destructive",
      })
      router.push("/auth/signin")
      return
    }

    try {
      setIsSubmitting(true)

      let result

      if (editingId) {
        // Update existing specification
        result = await updateSpecification(editingId, specification)
        if (result.success) {
          toast({
            title: "Specification updated",
            description: `Specification for ${product.title} has been updated successfully.`,
          })
          setEditingId(null)
        }
      } else {
        // Create new specification
        result = await saveSpecification(specification as SnuffSpecification)
        if (result.success) {
          toast({
            title: "Specification saved",
            description: `Specification for ${product.title} has been saved successfully.`,
          })
        }
      }

      if (!result.success) {
        toast({
          title: "Error saving specification",
          description: result.error || "An unknown error occurred",
          variant: "destructive",
        })
      } else {
        // Reset form and refresh page
        setSpecification({
          product_id: product.id,
          product_title: product.title,
          ease_of_use: "Beginner",
          nicotine_content: "Low",
        })
        router.refresh()
      }
    } catch (error) {
      console.error("Error saving specification:", error)
      toast({
        title: "Error saving specification",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (spec: SnuffSpecification) => {
    setEditingId(spec.id!)
    setSpecification({
      product_id: spec.product_id,
      product_title: spec.product_title,
      ease_of_use: spec.ease_of_use,
      nicotine_content: spec.nicotine_content,
    })
  }

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteSpecification(id)

      if (result.success) {
        toast({
          title: "Specification deleted",
          description: "The specification has been deleted successfully.",
        })
        router.refresh()
      } else {
        toast({
          title: "Error deleting specification",
          description: result.error || "An unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting specification:", error)
      toast({
        title: "Error deleting specification",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setSpecification({
      product_id: product.id,
      product_title: product.title,
      ease_of_use: "Beginner",
      nicotine_content: "Low",
    })
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Button variant="ghost" className="flex items-center gap-2 mb-4" onClick={() => router.push("/")}>
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Button>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            {product.image && (
              <div className="relative h-16 w-16 rounded-md overflow-hidden">
                <Image
                  src={product.image.src || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <CardTitle className="text-xl">{product.title}</CardTitle>
              {product.product_type && <p className="text-sm text-muted-foreground">{product.product_type}</p>}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!user && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Authentication Required</h4>
                <p className="text-amber-700 text-sm mt-1">
                  Please{" "}
                  <a href="/auth/signin" className="underline font-medium">
                    sign in
                  </a>{" "}
                  to create or manage specifications.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Ease of Use</h3>
              <RadioGroup
                value={specification.ease_of_use}
                onValueChange={(value) => handleChange("ease_of_use", value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Beginner" id="ease-beginner" />
                  <Label htmlFor="ease-beginner">Beginner</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Intermediate" id="ease-intermediate" />
                  <Label htmlFor="ease-intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Experienced" id="ease-experienced" />
                  <Label htmlFor="ease-experienced">Experienced</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Nicotine Content</h3>
              <RadioGroup
                value={specification.nicotine_content}
                onValueChange={(value) => handleChange("nicotine_content", value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="None" id="nicotine-none" />
                  <Label htmlFor="nicotine-none">None</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Low" id="nicotine-low" />
                  <Label htmlFor="nicotine-low">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Medium" id="nicotine-medium" />
                  <Label htmlFor="nicotine-medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="High" id="nicotine-high" />
                  <Label htmlFor="nicotine-high">High</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {existingSpecifications.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-medium mb-4">{user ? "All Specifications" : "Previous Specifications"}</h3>
              <div className="space-y-4">
                {existingSpecifications.map((spec) => (
                  <div key={spec.id} className="bg-muted p-4 rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <div className="grid grid-cols-2 gap-2 text-sm flex-1">
                        <div>
                          <p className="font-medium">Ease of Use</p>
                          <p>{spec.ease_of_use}</p>
                        </div>
                        <div>
                          <p className="font-medium">Nicotine Content</p>
                          <p>{spec.nicotine_content}</p>
                        </div>
                      </div>

                      {user && spec.user_id === user.id && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(spec)}
                            className="h-8 w-8 p-0"
                            disabled={isSubmitting || editingId === spec.id}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                disabled={isSubmitting}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the specification.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(spec.id!)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(spec.created_at!).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          {editingId ? (
            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={cancelEdit} disabled={isSubmitting} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || !user} className="flex-1">
                {isSubmitting ? "Updating..." : "Update Specification"}
                {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting || !user} className="w-full">
              {isSubmitting ? "Saving..." : "Save Specification"}
              {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

