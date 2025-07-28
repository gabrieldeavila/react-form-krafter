"use client";

import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export function DatePicker({
  id,
  disabled,
  onChange,
  onFocus,
  onBlur,
  date 
}: {
  date: Date | undefined;
  id: string;
  disabled?: boolean;
  onChange: (date: Date | undefined) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      onFocus?.();
      setOpen(open);
    },
    [onFocus]
  );

  return (
    <Popover open={open && !disabled} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          id={id}
          className="justify-between font-normal"
        >
          {date ? date.toLocaleDateString() : "Select date"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
            console.log(date)
            onBlur?.();
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
