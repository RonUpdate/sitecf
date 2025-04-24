"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export function TermsModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-gray-500 hover:text-primary dark:text-gray-400">Terms of Service</DialogTrigger>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] mt-4 pr-4">
          <div className="space-y-4 text-sm">
            <h2 className="text-lg font-semibold">1. Introduction</h2>
            <p>
              Welcome to Art Market. These Terms of Service govern your use of our website located at artmarket.com and
              form a binding contractual agreement between you, the user of the Site and us, Art Market.
            </p>

            <h2 className="text-lg font-semibold">2. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or using our Site, you acknowledge that you have read, understood, and agree to be
              bound by these Terms. If you do not agree to these Terms, please do not use our Site.
            </p>

            <h2 className="text-lg font-semibold">3. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. All changes are effective immediately when we post
              them. Your continued use of the Site after any such changes constitutes your acceptance of the new Terms.
            </p>

            <h2 className="text-lg font-semibold">4. User Accounts</h2>
            <p>
              Some features of our Site may require registration. You agree to provide accurate information during the
              registration process and to update such information to keep it accurate and current.
            </p>

            <h2 className="text-lg font-semibold">5. Intellectual Property</h2>
            <p>
              All content on this Site, including but not limited to coloring pages, designs, text, graphics, logos, and
              images, is the property of Art Market and is protected by copyright and other intellectual property laws.
            </p>

            <h2 className="text-lg font-semibold">6. User Content</h2>
            <p>
              By submitting content to our Site, you grant us a worldwide, non-exclusive, royalty-free license to use,
              reproduce, adapt, publish, and distribute such content.
            </p>

            <h2 className="text-lg font-semibold">7. Prohibited Uses</h2>
            <p>
              You agree not to use our Site for any unlawful purpose or in any way that might harm, damage, or disparage
              any other party.
            </p>

            <h2 className="text-lg font-semibold">8. Termination</h2>
            <p>
              We may terminate or suspend your access to our Site immediately, without prior notice or liability, for
              any reason whatsoever.
            </p>

            <h2 className="text-lg font-semibold">9. Disclaimer</h2>
            <p>Our Site is provided "as is" without any warranties, expressed or implied.</p>

            <h2 className="text-lg font-semibold">10. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us at ronupert@gmail.com.</p>

            <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
