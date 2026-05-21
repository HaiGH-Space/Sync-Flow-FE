"use client";
import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import FieldErrorAnimation from "./FieldErrorAnimation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function DatePickerField({
  form,
  name,
  label,
  placeholder,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  name: string;
  label: string;
  placeholder: string;
}) {
  return (
    <div className="mt-4">
      <form.Field name={name}>
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (field: any) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            const selectedDate =
              typeof window !== "undefined" && field.state.value
              ? new Date(field.state.value)
              : undefined;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id={field.name}
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-between text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                      )}
                    >
                      {selectedDate ? format(selectedDate, "PPP") : placeholder}
                      <CalendarIcon className="size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        field.handleChange(
                          date ? format(date, "yyyy-MM-dd") : "",
                        );
                      }}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
                <FieldErrorAnimation
                  isInvalid={isInvalid}
                  errors={field.state.meta.errors}
                />
              </Field>
            );
          }
        }
      </form.Field>
    </div>
  );
}
