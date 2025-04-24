"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export function PrivacyModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-gray-500 hover:text-primary dark:text-gray-400">Privacy Policy</DialogTrigger>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] mt-4 pr-4">
          <div className="space-y-4 text-sm">
            <h2 className="text-lg font-semibold">1. Introduction</h2>
            <p>
              At Art Market, we respect your privacy and are committed to protecting your personal data. This Privacy
              Policy explains how we collect, use, and safeguard your information when you visit our website.
            </p>

            <h2 className="text-lg font-semibold">2. Information We Collect</h2>
            <p>
              We may collect personal identification information (Name, Email address, Phone number) and non-personal
              identification information (Browser name, Type of computer, Technical information about your connection to
              our Site).
            </p>

            <h2 className="text-lg font-semibold">3. How We Use Your Information</h2>
            <p>
              We may use the information we collect to improve our products and services, send periodic emails, and
              improve customer service.
            </p>

            <h2 className="text-lg font-semibold">4. How We Protect Your Information</h2>
            <p>
              We adopt appropriate data collection, storage, and processing practices and security measures to protect
              against unauthorized access, alteration, disclosure, or destruction of your personal information.
            </p>

            <h2 className="text-lg font-semibold">5. Sharing Your Personal Information</h2>
            <p>
              We do not sell, trade, or rent users' personal identification information to others. We may share generic
              aggregated demographic information not linked to any personal identification information regarding
              visitors and users with our business partners and trusted affiliates.
            </p>

            <h2 className="text-lg font-semibold">6. Third-Party Websites</h2>
            <p>
              Users may find content on our Site that links to the sites and services of our partners, suppliers,
              advertisers, sponsors, licensors, and other third parties. We do not control the content or links that
              appear on these sites and are not responsible for the practices employed by websites linked to or from our
              Site.
            </p>

            <h2 className="text-lg font-semibold">7. Cookies</h2>
            <p>
              Our Site may use "cookies" to enhance the user experience. Users may choose to set their web browser to
              refuse cookies or to alert you when cookies are being sent.
            </p>

            <h2 className="text-lg font-semibold">8. Changes to This Privacy Policy</h2>
            <p>
              Art Market has the discretion to update this Privacy Policy at any time. We encourage users to frequently
              check this page for any changes.
            </p>

            <h2 className="text-lg font-semibold">9. Your Acceptance of These Terms</h2>
            <p>
              By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please
              do not use our Site.
            </p>

            <h2 className="text-lg font-semibold">10. Contact Information</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at ronupert@gmail.com.</p>

            <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
