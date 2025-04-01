"use client";
import Image from "next/image";
import Logo from "@/public/logo.png";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import UserTypeSelection from "./UserTypeselection";

type UserSelectionType = "company" | "jobSeeker" | null;

const OnboardingForm = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserSelectionType>(null);

  function handelUserTypeSelection(type: UserSelectionType) {
    setUserType(type);
    setStep((prev) => prev + 1);
  }

  function renderStep() {
    switch (step) {
      case 1:
        return <UserTypeSelection onSelect={handelUserTypeSelection} />
      case 2:
        return userType === "company" ? (
          <p>user is a company</p>
        ) : (
          <p>user is a job seeker</p>
        );

      default:
        return null;
    }
  }
  return (
    <>
      <div className="flex items-center gap-3 mb-10">
        <Image src={Logo} alt="Chad Job Logo" width={50} height={50} />
        <span className="text-4xl font-bold">
          <span className="text-primary">Chad</span>Job
        </span>
      </div>
      <Card className="w-full max-w-lg">
        <CardContent className="p-6">{renderStep()}</CardContent>
      </Card>
    </>
  );
};

export default OnboardingForm;
