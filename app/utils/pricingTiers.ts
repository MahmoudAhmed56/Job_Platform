interface iAppProps {
  days: number;
  price: number;
  description: string;
}

export const jobListingDurationPricing: iAppProps[] = [
  {
    days: 15,
    price: 0,
    description: "Free trail",
  },
  {
    days: 30,
    price: 0,
    description: "Free trail",
  },
  {
    days: 60,
    price: 0,
    description: "Free trail",
  },
  {
    days: 90,
    price: 249,
    description: "Maximum exposure",
  },
];
