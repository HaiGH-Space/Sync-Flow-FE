'use client'
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion"
import { FieldError } from "../ui/field"

type FieldErrorAnimationProps = {
    isInvalid: boolean;
    errors?: Array<{ message?: string } | undefined>;
}

const FieldErrorAnimation = ({ isInvalid, errors }: FieldErrorAnimationProps) => {
    return <LazyMotion features={domAnimation}>
        <AnimatePresence mode="wait">
            {isInvalid && (
                <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                    <FieldError errors={errors} />
                </m.div>
            )}
        </AnimatePresence>
    </LazyMotion>
}

export default FieldErrorAnimation;