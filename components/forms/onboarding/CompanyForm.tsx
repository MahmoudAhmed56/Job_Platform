"use client";

import { createCompany } from "@/app/actions";
import { countryList, getFlagEmoji } from "@/app/utils/countriesList";
import { UploadDropzone } from "@/components/general/UploadThingReExport";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { companySchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CompanyForm = () => {
  const form = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      about: "",
      location: "",
      website: "",
      xAccount: "",
      logo: "",
      name: "",
    },
  });
  const [pending, setPending] = useState<boolean>(false);
  async function onSubmit(data: z.infer<typeof companySchema>) {
    try {
      setPending(true)
      await createCompany(data);
      // await createCompany(validateData.data)
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        console.log("SOMETHING WENT WRONG", error.message);
      }
    }finally{
      setPending(false)
    }
  }
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Worldwide</SelectLabel>
                      <SelectItem value="worldwide">
                        <span>🌍</span>
                        <span className="pl-2">Worldwide / Remote</span>
                      </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Location</SelectLabel>
                      {countryList.map((country) => (
                        <SelectItem value={country.name} key={country.code}>
                          <span>{getFlagEmoji(country.name)}</span>
                          <span className="pl-2">{country.name}</span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://your-company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="xAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>X (Twitter) Account</FormLabel>
                <FormControl>
                  <Input placeholder="@yourcompany" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your company..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
            <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Logo</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    <div className="relative w-fit">
                      <Image
                        src={field.value}
                        alt="Company Logo"
                        width={100}
                        height={100}
                        className="rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 "
                        onClick={() => field.onChange("")}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <UploadDropzone
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].url);
                        toast.success("Logo uploaded successfully!");
                      }}
                      onUploadError={() => {
                        toast.error("Something went wrong. Please try again.");
                      }}
                      className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border-primary"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Submitting..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
};

export default CompanyForm;
