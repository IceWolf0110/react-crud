import {useEffect, useState} from "react"
import axiosClient from "@/lib/axios-client"

import {Button} from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"

import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

import {Settings2Icon} from "lucide-react"
import {ModeToggle} from "@/components/dark-mode/mode-toggle.tsx";
import * as React from "react";

interface Product {
    id: number
    name: string
    brand: string
    description: string
    acquisitionDate: string
    price: number
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosClient.get("/products")
                setProducts(response.data)
            } catch (e) {
                console.error(e)
            }
        }

        void fetchProducts()
    }, [])

    const handleDelete = async (id: number) => {
        try {
            await axiosClient.delete(`/${id}`)

            setProducts((prev) =>
                prev.filter((product) => product.id !== id)
            )

        } catch (e) {
            console.error(e)
        }
    }

    const [openCreate, setOpenCreate] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        description: "",
        acquisitionDate: "",
        price: "",
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleCreate = async () => {
        try {
            const response = await axiosClient.post("/", {
                ...formData,
                price: Number(formData.price),
            })

            setProducts((prev) => [...prev, response.data])

            setOpenCreate(false)

            setFormData({
                name: "",
                brand: "",
                description: "",
                acquisitionDate: "",
                price: "",
            })
        } catch (e) {
            console.error(e)
        }
    }

    const [openEdit, setOpenEdit] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)

    const [editForm, setEditForm] = useState({
        name: "",
        brand: "",
        description: "",
        acquisitionDate: "",
        price: "",
    })

    const handleEditChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value,
        })
    }

    const handleUpdate = async () => {
        if (!editingProduct) return

        try {
            const response = await axiosClient.put(
                `/${editingProduct.id}`,
                {
                    id: editingProduct.id,
                    ...editForm,
                    price: Number(editForm.price),
                }
            )

            setProducts((prev) =>
                prev.map((p) =>
                    p.id === editingProduct.id ? response.data : p
                )
            )

            setOpenEdit(false)
            setEditingProduct(null)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-end gap-6">
                <ModeToggle/>
                <Button onClick={() => setOpenCreate(true)} className="border">Add Product</Button>

                <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add Product</DialogTitle>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Name</Label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Brand</Label>
                                <Input
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Description</Label>
                                <Input
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Acquisition Date</Label>
                                <Input
                                    type="date"
                                    name="acquisitionDate"
                                    value={formData.acquisitionDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Price</Label>
                                <Input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpenCreate(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreate}>
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Table className="[&_td]:py-4 [&_th]:py-4 [&_td]:text-base mt-4">
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Acquisition Date</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium">
                                {product.name}
                            </TableCell>
                            <TableCell>{product.brand}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell>{product.acquisitionDate}</TableCell>
                            <TableCell className="text-right">
                                {product.price}$
                            </TableCell>

                            <TableCell className="text-center">
                                <AlertDialog>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="size-8"
                                            >
                                                <Settings2Icon/>
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setEditingProduct(product)
                                                    setEditForm({
                                                        name: product.name,
                                                        brand: product.brand,
                                                        description: product.description,
                                                        acquisitionDate: product.acquisitionDate,
                                                        price: String(product.price),
                                                    })
                                                    setOpenEdit(true)
                                                }}
                                            >
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator/>

                                            <AlertDialogTrigger asChild>
                                                <DropdownMenuItem
                                                    variant="destructive"
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </AlertDialogTrigger>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Delete product?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>

                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDelete(product.id)}
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

            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Name</Label>
                            <Input
                                name="name"
                                value={editForm.name}
                                onChange={handleEditChange}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Brand</Label>
                            <Input
                                name="brand"
                                value={editForm.brand}
                                onChange={handleEditChange}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Description</Label>
                            <Input
                                name="description"
                                value={editForm.description}
                                onChange={handleEditChange}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Acquisition Date</Label>
                            <Input
                                type="date"
                                name="acquisitionDate"
                                value={editForm.acquisitionDate}
                                onChange={handleEditChange}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Price</Label>
                            <Input
                                type="number"
                                name="price"
                                value={editForm.price}
                                onChange={handleEditChange}
                                className="[&::-webkit-outer-spin-button]:appearance-none
                                           [&::-webkit-inner-spin-button]:appearance-none
                                           [-moz-appearance:textfield]"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpenEdit(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate}>
                            Update
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}