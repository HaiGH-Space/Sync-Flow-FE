import { LucideIcon } from "lucide-react";
import { LazyMotion, domAnimation, m, type Variants } from "framer-motion";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import FieldErrorAnimation from "../shared/FieldErrorAnimation";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type FieldApiMock = {
  name: string;
  state: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    meta: {
      isTouched: boolean;
      errors?: Array<{ message?: string } | undefined>;
      isValid: boolean;
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange: (value: any) => void;
  handleBlur: () => void;
};
interface FieldAnimationProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  name: string;
  icon?: LucideIcon;
  type?: string;
  placeholder?: string;
  variants?: Variants;
}

export const InputAnimation = ({
  form,
  name,
  icon: Icon,
  type = "text",
  placeholder = "",
  variants,
}: FieldAnimationProps) => {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="mt-4"
        variants={variants}
        key={name}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <form.Field name={name}>
          {(field: FieldApiMock) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <div className="relative">
                  {Icon && (
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  )}
                  <Input
                    type={type}
                    className={cn(Icon ? "pl-10" : "", "h-11 rounded-xl")}
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder={placeholder}
                    autoComplete="off"
                  />
                </div>
                <FieldErrorAnimation
                  isInvalid={isInvalid}
                  errors={field.state.meta.errors}
                />
              </Field>
            );
          }}
        </form.Field>
      </m.div>
    </LazyMotion>
  );
};

export const SelectAnimation = ({
  form,
  name,
  icon: Icon,
  variants,
  data,
  fieldLabel,
}: FieldAnimationProps & {
  fieldLabel?: string;
  data: { value: string; label: string }[];
}) => {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className="mt-4"
        variants={variants}
        key={name}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <form.Field name={name}>
          {(field: FieldApiMock) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            const currentValue = (field.state.value ?? data[0]?.value) as
              | string
              | undefined;
            return (
              <div className="w-full">
                {fieldLabel && (
                  <FieldLabel className="mb-2" htmlFor={field.name}>
                    {fieldLabel}
                  </FieldLabel>
                )}
                <div className="relative">
                  <Field data-invalid={isInvalid}>
                    {Icon && (
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    )}
                    <Select
                      value={currentValue}
                      onValueChange={(value) => field.handleChange(value)}
                    >
                      <SelectTrigger name={field.name} id={field.name}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {data.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FieldErrorAnimation
                      isInvalid={isInvalid}
                      errors={field.state.meta.errors}
                    />
                  </Field>
                </div>
              </div>
            );
          }}
        </form.Field>
      </m.div>
    </LazyMotion>
  );
};

export default InputAnimation;
