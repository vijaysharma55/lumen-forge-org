// Central site configuration — easy to update without hunting through files.
export const SITE = {
  orgName: "Meri Pahal Fast Help Group",
  shortName: "Meri Pahal",
  tagline: "Empowering NGOs · Serving Communities",
  // Admin / support WhatsApp number (international format, no '+', no spaces)
  whatsappNumber: "919999999999",
  supportEmail: "support@meripahal.org",
  websitePackagePrice: 4999,
  coordinatorFee: 499,
};

export function whatsappLink(message: string, number: string = SITE.whatsappNumber) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
