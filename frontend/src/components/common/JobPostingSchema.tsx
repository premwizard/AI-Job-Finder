import React from "react";

export interface JobPostingData {
  title: string;
  description: string;
  datePosted: string;
  validThrough?: string;
  employmentType?: string;
  hiringOrganization: {
    name: string;
    sameAs?: string;
    logo?: string;
  };
  jobLocation: {
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  baseSalary?: {
    currency: string;
    minValue?: number;
    maxValue?: number;
    unitText?: "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";
  };
}

interface JobPostingSchemaProps {
  job: JobPostingData;
}

export function JobPostingSchema({ job }: JobPostingSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.datePosted,
    ...(job.validThrough && { validThrough: job.validThrough }),
    employmentType: job.employmentType || "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.hiringOrganization.name,
      ...(job.hiringOrganization.sameAs && { sameAs: job.hiringOrganization.sameAs }),
      ...(job.hiringOrganization.logo && { logo: job.hiringOrganization.logo }),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...(job.jobLocation.addressLocality && { addressLocality: job.jobLocation.addressLocality }),
        ...(job.jobLocation.addressRegion && { addressRegion: job.jobLocation.addressRegion }),
        ...(job.jobLocation.addressCountry && { addressCountry: job.jobLocation.addressCountry || "US" }),
      },
    },
    ...(job.baseSalary && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: job.baseSalary.currency || "USD",
        value: {
          "@type": "QuantitativeValue",
          ...(job.baseSalary.minValue && { minValue: job.baseSalary.minValue }),
          ...(job.baseSalary.maxValue && { maxValue: job.baseSalary.maxValue }),
          unitText: job.baseSalary.unitText || "YEAR",
        },
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
