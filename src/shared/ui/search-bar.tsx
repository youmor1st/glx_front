import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { twMerge } from "tailwind-merge";
import { Button } from "./button";
import { CrossIcon, SearchIcon } from "./icons";

interface SearchBarProps {
  className?: string;
  onCross: () => void;
  isVisible: boolean;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

const searchSchema = z.object({
  search: z.string(),
});

export default function SearchBar({
  className,
  onCross,
  isVisible,
  value,
  onChange,
  placeholder = "Search",
  autoFocus = false,
  onKeyDown,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = useCallback((values: z.infer<typeof searchSchema>) => {
    console.log("Search submitted:", values);
  }, []);

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: value || "",
    },
    shouldFocusError: false,
  });

  const { resetField, setValue, watch } = form;
  const searchValue = watch("search");

  // Sync external value with form
  useEffect(() => {
    if (value !== undefined && value !== searchValue) {
      setValue("search", value);
    }
  }, [value, setValue, searchValue]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange && searchValue !== value) {
      onChange(searchValue);
    }
  }, [searchValue, onChange, value]);

  // Auto focus when visible
  useEffect(() => {
    if (isVisible && autoFocus && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoFocus]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    // Handle Escape key
    if (event.key === 'Escape') {
      event.preventDefault();
      resetField("search");
      onCross();
      return;
    }

    // Call parent onKeyDown if provided
    onKeyDown?.(event);
  }, [resetField, onCross, onKeyDown]);

  const handleClear = useCallback(() => {
    resetField("search");
    onCross();
    inputRef.current?.focus();
  }, [resetField, onCross]);

  return (
    <AnimatePresence>
      {isVisible && (
        <Form {...form}>
          <motion.form
            initial={{ width: "30px", opacity: 1 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: "30px", opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ originX: 1 }}
            onSubmit={form.handleSubmit(onSubmit)}
            className={twMerge("overflow-hidden rounded-[12px]", className)}
          >
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="gap-[12px] relative">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute left-[8px] top-1/2 -translate-y-1/2"
                  >
                    <SearchIcon className="size-5 fill-light-100" />
                  </motion.div>

                  <Button
                    type="button"
                    onClick={handleClear}
                    className="size-5 rounded-full bg-light-20 flex items-center justify-center absolute right-[8px] top-1/2 -translate-y-1/2 hover:bg-light-30 transition-colors"
                    aria-label="Clear search"
                  >
                    <CrossIcon className="size-4 fill-light-40" />
                  </Button>

                  <FormControl>
                    <motion.input
                      {...field}
                      ref={inputRef}
                      className="w-full h-[40px] pr-[8px] pl-[36px] rounded-[12px] border border-light-20 bg-light-10 text-light-100 placeholder:text-light-40 focus:outline-none focus:border-light-30 transition-colors"
                      placeholder={placeholder}
                      onKeyDown={handleKeyDown}
                      aria-label={placeholder}
                      role="searchbox"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.form>
        </Form>
      )}
    </AnimatePresence>
  );
}
