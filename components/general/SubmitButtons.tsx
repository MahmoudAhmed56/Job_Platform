"use client";
import React from "react";
import { Button } from "../ui/button";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export const GeneralSubmitButton = ({
  text,
  icon,
  variant,
  width = "w-full",
}: {
  text: string;
  icon?: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  width?: string;
}) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={variant}
      disabled={pending}
      className={width}
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin " />
          <span>Submitting...</span>
        </>
      ) : (
        <>
          {icon && <div className="">{icon}</div>}
          <span>{text}</span>
        </>
      )}
    </Button>
  );
};
