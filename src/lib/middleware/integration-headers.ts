import type { Request } from 'express';

const ORIGIN = 'origin';
const httpMatcher = /^https?:\/\//;
const userAgentMatches = [
    { label: 'Axios', matcher: /^axios/ },
    { label: 'Curl', matcher: /^curl/ },
    { label: 'Go', matcher: /^Go-http-client/ },
    { label: 'Python', matcher: /^python-requests/ },
    { label: 'Node', matcher: /^node/ },
    { label: 'Java', matcher: /^Apache-HttpClient.*Java/ },
    { label: 'JiraCloudUnleash', matcher: /^Jira-Cloud-Unleash/ },
    { label: 'TerraformUnleash', matcher: /^Terraform-Provider-Unleash/ },
    { label: 'OpenAPIGO', matcher: /^OpenAPI-Generator\/.*\/go/ },
    { label: 'RestClientRuby', matcher: /^rest-client\/.*ruby/ },
];

export const getFilteredOrigin = (request: Request): string | undefined => {
    throw new Error("STUB");
};

export const determineIntegrationSource = (
    userAgent: string,
): string | undefined => {
    return (
        userAgentMatches.find((candidate) => { throw new Error("STUB"); })
            ?.label ?? 'Other'
    );
};
