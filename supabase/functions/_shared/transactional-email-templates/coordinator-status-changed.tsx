import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Meri Pahal Fast Help Group'

interface CoordinatorStatusChangedProps {
  name?: string
  status?: 'approved' | 'rejected' | 'pending'
  memberCode?: string | null
  roleLevel?: string
  /** Full deep-link URL. If omitted, derived from appBaseUrl + status + roleLevel. */
  dashboardUrl?: string
  /** Origin like https://merepahal.org — used to build the deep link when dashboardUrl is absent. */
  appBaseUrl?: string
}

const DEFAULT_BASE = 'https://merepahal.org'

const resolveDashboardUrl = (
  status: 'approved' | 'rejected' | 'pending',
  roleLevel: string | undefined,
  appBaseUrl: string | undefined,
  explicit?: string,
): string => {
  if (explicit) return explicit
  const base = (appBaseUrl ?? DEFAULT_BASE).replace(/\/+$/, '')
  const role = (roleLevel ?? '').toLowerCase()
  if (status === 'rejected') return `${base}/contact`
  if (status === 'pending') return `${base}/dashboard`
  // approved — deep link by role level
  if (role === 'admin' || role === 'national') return `${base}/dashboard/admin/coordinators`
  if (role) {
    return `${base}/dashboard/coordinator?role=${encodeURIComponent(role)}`
  }
  return `${base}/dashboard/coordinator`
}

const CoordinatorStatusChangedEmail = ({
  name,
  status = 'approved',
  memberCode,
  roleLevel,
  dashboardUrl,
  appBaseUrl,
}: CoordinatorStatusChangedProps) => {
  const copy = COPY[status] ?? COPY.approved
  const resolvedUrl = resolveDashboardUrl(status, roleLevel, appBaseUrl, dashboardUrl)

  const badgeStyle =
    status === 'approved' ? badgeApproved : status === 'rejected' ? badgeRejected : badgePending

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{copy.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={brand}>{SITE_NAME}</Heading>
            <Text style={brandSub}>Coordinator Update</Text>
          </Section>

          <Section style={card}>
            <Text style={badgeStyle}>
              {status === 'approved'
                ? 'APPROVED'
                : status === 'rejected'
                ? 'NOT APPROVED'
                : 'PENDING REVIEW'}
            </Text>

            <Heading style={h1}>{copy.heading}</Heading>
            <Text style={greeting}>Hello {name ?? 'Coordinator'},</Text>
            <Text style={text}>{copy.intro}</Text>

            {(memberCode || roleLevel) && (
              <Section style={metaBox}>
                {memberCode && (
                  <Text style={metaLine}>
                    <span style={metaLabel}>Member ID:</span> {memberCode}
                  </Text>
                )}
                {roleLevel && (
                  <Text style={metaLine}>
                    <span style={metaLabel}>Role Level:</span> {roleLevel}
                  </Text>
                )}
              </Section>
            )}

            <Heading as="h2" style={h2}>
              Next steps
            </Heading>
            <Section style={stepsBox}>
              {copy.steps.map((step, i) => (
                <Text key={i} style={stepItem}>
                  <span style={stepNum}>{i + 1}.</span> {step}
                </Text>
              ))}
            </Section>

            <Section style={{ textAlign: 'center', margin: '32px 0 8px' }}>
              <Button style={button} href={resolvedUrl}>
                {copy.cta}
              </Button>
            </Section>

            <Text style={fallback}>
              Or copy this link into your browser:{' '}
              <Link href={resolvedUrl} style={link}>
                {resolvedUrl}
              </Link>
            </Text>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            You are receiving this email because you applied as a coordinator with {SITE_NAME}.
          </Text>
          <Text style={footerSmall}>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: CoordinatorStatusChangedEmail,
  subject: (data: Record<string, any>) => {
    const status = (data?.status as string) ?? 'approved'
    if (status === 'approved') return `You're approved as a Coordinator — ${SITE_NAME}`
    if (status === 'rejected') return `Update on your Coordinator application — ${SITE_NAME}`
    return `Coordinator application status update — ${SITE_NAME}`
  },
  displayName: 'Coordinator status changed',
  previewData: {
    name: 'Rohit Sharma',
    status: 'approved',
    memberCode: 'MPH-COORD-0042',
    roleLevel: 'District',
    dashboardUrl: 'https://merepahal.org/dashboard',
  },
} satisfies TemplateEntry

// Styles — brand: deep institutional blue + warm orange accent
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: 0,
}

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '32px 20px',
}

const header = {
  textAlign: 'center' as const,
  padding: '0 0 24px',
}

const brand = {
  fontSize: '22px',
  fontWeight: 800,
  color: '#0a2d6b',
  letterSpacing: '-0.01em',
  margin: 0,
}

const brandSub = {
  fontSize: '12px',
  color: '#6b7691',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  margin: '6px 0 0',
}

const card = {
  backgroundColor: '#f7f9fd',
  border: '1px solid #e2e8f3',
  borderRadius: '12px',
  padding: '32px 28px',
}

const badgeBase = {
  display: 'inline-block',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  padding: '6px 12px',
  borderRadius: '999px',
  margin: '0 0 16px',
}

const badgeApproved = {
  ...badgeBase,
  backgroundColor: '#e6f7ed',
  color: '#1f7a3f',
}

const badgeRejected = {
  ...badgeBase,
  backgroundColor: '#fdecec',
  color: '#c0392b',
}

const badgePending = {
  ...badgeBase,
  backgroundColor: '#fff4e0',
  color: '#b8730a',
}

const h1 = {
  fontSize: '24px',
  fontWeight: 800,
  color: '#0a2d6b',
  lineHeight: 1.25,
  margin: '0 0 16px',
}

const h2 = {
  fontSize: '15px',
  fontWeight: 700,
  color: '#0a2d6b',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  margin: '28px 0 12px',
}

const greeting = {
  fontSize: '15px',
  color: '#1a2740',
  margin: '0 0 8px',
}

const text = {
  fontSize: '15px',
  color: '#3a4566',
  lineHeight: 1.6,
  margin: '0 0 16px',
}

const metaBox = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f3',
  borderRadius: '8px',
  padding: '14px 16px',
  margin: '12px 0 4px',
}

const metaLine = {
  fontSize: '14px',
  color: '#1a2740',
  margin: '4px 0',
}

const metaLabel = {
  color: '#6b7691',
  fontWeight: 600,
  marginRight: '6px',
}

const stepsBox = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f3',
  borderRadius: '8px',
  padding: '14px 18px',
}

const stepItem = {
  fontSize: '14px',
  color: '#3a4566',
  lineHeight: 1.6,
  margin: '6px 0',
}

const stepNum = {
  color: '#f26a1f',
  fontWeight: 700,
  marginRight: '6px',
}

const button = {
  backgroundColor: '#f26a1f',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 700,
  textDecoration: 'none',
  padding: '14px 28px',
  borderRadius: '8px',
  display: 'inline-block',
}

const fallback = {
  fontSize: '12px',
  color: '#6b7691',
  textAlign: 'center' as const,
  margin: '12px 0 0',
  wordBreak: 'break-all' as const,
}

const link = {
  color: '#0a2d6b',
  textDecoration: 'underline',
}

const hr = {
  borderColor: '#e2e8f3',
  margin: '28px 0 16px',
}

const footer = {
  fontSize: '12px',
  color: '#6b7691',
  textAlign: 'center' as const,
  margin: '0 0 6px',
}

const footerSmall = {
  fontSize: '11px',
  color: '#9aa3b8',
  textAlign: 'center' as const,
  margin: 0,
}
