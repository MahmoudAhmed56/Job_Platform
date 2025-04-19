/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Control, useController } from "react-hook-form";
import { Slider } from "../ui/slider";
import { formatCurrency } from "@/app/utils/formatCurrency";

interface SalaryRangeSelectorProps {
  control: Control<any>;
  minSalary?: number;
  maxSalary?: number;
  step?: number;
  currency?: string;
}

const SalaryRangeSelector = ({
  control,
  minSalary = 2000,
  maxSalary = 200000,
  step = 500,
}: SalaryRangeSelectorProps) => {
  const { field: fromField } = useController({
    name: "salaryFrom",
    control,
  });
  const { field: toField } = useController({
    name: "salaryTo",
    control,
  });
  const [range, setRange] = useState<[number, number]>([
    fromField.value || minSalary,
    toField.value || maxSalary / 2,
  ]);

  function handelChangeRange(value: number[]) {
    const newRange: [number, number] = [value[0], value[1]];
    setRange(newRange);
    fromField.onChange(newRange[0]);
    toField.onChange(newRange[1]);
  }
  return (
    <div className="w-full space-y-4">
      <Slider
        onValueChange={handelChangeRange}
        min={minSalary}
        max={maxSalary}
        step={step}
        value={range}
        className="py-4"
      />
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">
          {formatCurrency(range[0])}
        </span>
        <span className="text-sm text-muted-foreground">
          {formatCurrency(range[1])}
        </span>
      </div>
    </div>
  );
};

export default SalaryRangeSelector;
