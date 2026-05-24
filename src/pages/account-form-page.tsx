import { useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { useLiveQuery } from "dexie-react-hooks"
import { CheckIcon } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { db } from "@/lib/loaffly-db"
import { SubPageLayout } from "@/layouts/sub-page-layout"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const accountSchema = z.object({
    name: z.string(),
    type: z.enum(["bank", "ewallet", "cash"]),
    accountNumber: z.string(),
    initialBalance: z.string(),
    notes: z.string(),
})

type AccountFormValues = z.infer<typeof accountSchema>

function AccountFormPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const walletId = id ? Number(id) : null
    const isEdit = walletId !== null

    // Reactively fetch existing wallet if editing
    const existingWallet = useLiveQuery(async () => {
        if (!walletId) return undefined
        return await db.wallets.get(walletId)
    }, [walletId])

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setError,
    } = useForm<AccountFormValues>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            name: "",
            type: "bank",
            accountNumber: "",
            initialBalance: "0",
            notes: "",
        },
    })

    const selectedType = watch("type")

    // Load existing wallet values when ready
    useEffect(() => {
        if (isEdit && existingWallet) {
            reset({
                name: existingWallet.name,
                type: existingWallet.type,
                accountNumber: existingWallet.accountNumber,
                initialBalance: String(existingWallet.initialBalance),
                notes: existingWallet.notes || "",
            })
        }
    }, [isEdit, existingWallet, reset])

    async function onSubmit(data: AccountFormValues) {
        if (data.type !== "cash" && !data.name.trim()) {
            setError("name", {
                type: "manual",
                message: "Please enter an account name.",
            })
            return
        }

        const balanceNum = parseFloat(data.initialBalance)
        if (isNaN(balanceNum) || balanceNum < 0) {
            setError("initialBalance", {
                type: "manual",
                message: "Please enter a valid balance.",
            })
            return
        }

        // Color mapping for premium look
        const colorMap = {
            bank: "#4A3728", // Deep Cocoa / Espresso
            ewallet: "#D84315", // Terracotta
            cash: "#B26A3A", // Warm Ochre
        }

        const walletData = {
            name: data.type === "cash" ? "Cash" : data.name.trim(),
            type: data.type,
            accountNumber: data.type === "cash" ? "-" : (data.accountNumber.trim() || "1234567"),
            initialBalance: balanceNum,
            color: colorMap[data.type] || "#B26A3A",
            notes: data.notes.trim() || undefined,
        }

        if (isEdit && walletId) {
            await db.wallets.update(walletId, walletData)
            navigate(`/account/${walletId}`)
        } else {
            await db.wallets.add(walletData as any)
            navigate("/account")
        }
    }

    return (
        <SubPageLayout
            title={isEdit ? "Edit account" : "New account"}
            backTo={isEdit && walletId ? `/account/${walletId}` : "/account"}
            rightAction={
                <button
                    onClick={handleSubmit(onSubmit)}
                    className="flex size-9 items-center justify-center rounded-full text-warm-ochre transition-colors hover:bg-secondary"
                    aria-label="Save account"
                >
                    <CheckIcon className="size-5 stroke-[2.5]" />
                </button>
            }
        >
            <FieldGroup className="pt-2">
                {/* Account Type Selection */}
                <Controller
                    name="type"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Account Type</FieldLabel>
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bank">Bank Account</SelectItem>
                                    <SelectItem value="ewallet">E-Wallet</SelectItem>
                                    <SelectItem value="cash">Cash</SelectItem>
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                {selectedType !== "cash" && (
                    <>
                        {/* Account Name */}
                        <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Account Name</FieldLabel>
                                    <Input
                                        {...field}
                                        placeholder="e.g., BCA, Gopay..."
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        {/* Account Number */}
                        <Controller
                            name="accountNumber"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Account Number</FieldLabel>
                                    <Input
                                        {...field}
                                        placeholder="e.g., 123-4567..."
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </>
                )}

                {/* Initial Balance */}
                <Controller
                    name="initialBalance"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Starting Balance</FieldLabel>
                            <Input
                                {...field}
                                type="text"
                                placeholder="0"
                                value={field.value ? parseInt(field.value.replace(/\D/g, ""), 10).toLocaleString("id-ID") : ""}
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\D/g, "");
                                    field.onChange(rawValue);
                                }}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                {/* Notes */}
                <Controller
                    name="notes"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Notes</FieldLabel>
                            <Textarea
                                {...field}
                                placeholder="Write something about this account..."
                                rows={4}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>
        </SubPageLayout>
    )
}

export { AccountFormPage }
