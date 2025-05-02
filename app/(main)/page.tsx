// import { JobFilters } from "@/components/general/JobFilters";
// import JobListings from "@/components/general/JobListings";
// import JobListingsLoading from "@/components/general/JobListingsLoading";
import { JobFilter } from "@/components/general/JobFilter";
import JobListing from "@/components/general/JobListing";
import JobListingsLoading from "@/components/general/JobListingsLoading";
import { Suspense } from "react";

type SearchParamsProps = {
  searchParams: Promise<{
    page?: string;
    jobTypes?: string;
    location?: string;
  }>;
};

export default async function Home({ searchParams }: SearchParamsProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const jobTypes = params.jobTypes?.split(",") || [];
  const location = params.location || "";

  // Create a composite key from all filter parameters
  const filterKey = `page=${currentPage};types=${jobTypes.join(
    ","
  )};location=${location}`;

  return (
    <div className="flex flex-wrap md:grid md:grid-cols-3 gap-8">
      <JobFilter />
      <div className="col-span-2 flex flex-col gap-6">
        <Suspense key={filterKey} fallback={<JobListingsLoading />}>
          <JobListing
            currentPage={currentPage}
            jobTypes={jobTypes}
            location={location}
          />
        </Suspense>
      </div>
    </div>
  );
}
