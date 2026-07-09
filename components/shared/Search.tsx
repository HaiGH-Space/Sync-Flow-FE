'use client'
import { useEffect, useRef, useState } from "react"
import { Field } from "../ui/field"
import { Input } from "../ui/input"
import { useTranslations } from "next-intl"
import { logger } from "@/lib/logger"

type SearchProps = React.ComponentProps<typeof Field> & {
    placeholder?: string
    onSearch: (query: string) => void | Promise<void>
    debounceMs?: number
}

export const Search = function Search({ placeholder, onSearch, debounceMs = 300, ...props }: SearchProps) {
    const t = useTranslations('common')
    const resolvedPlaceholder = placeholder ?? t('search.placeholder')
    const [query, setQuery] = useState("")
    const hasUserTypedRef = useRef(false)

    useEffect(() => {
        if (!hasUserTypedRef.current) {
            return
        }

        const timer = window.setTimeout(() => {
            Promise.resolve(onSearch(query)).catch((error) => {
                logger.error("Search failed:", error)
            })
        }, debounceMs)

        return () => {
            window.clearTimeout(timer)
        }
    }, [debounceMs, onSearch, query])

    return (
        <Field {...props} orientation="horizontal">
            <Input
                aria-label={resolvedPlaceholder}
                type="search"
                placeholder={resolvedPlaceholder}
                value={query}
                onChange={(e) => {
                    hasUserTypedRef.current = true
                    setQuery(e.target.value)
                }}
            />
        </Field>
    )
}