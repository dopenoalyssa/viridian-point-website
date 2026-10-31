VIRIDIAN POINT WEBSITE DRAFT

OPEN OR UPDATE YOUR LOCAL COPY
Extract this ZIP. Copy everything inside viridian-point-website into your
existing project folder and replace matching files. Open index.html in Chrome
or Edge and refresh. There is no install or build command.

FILES
index.html: Page copy, centered hero, shared email showcase containers, services,
case study, reviews, onboarding, about, FAQ, and booking placeholder.
styles.css: Responsive layouts, fixed colors, and animations.
script.js: Email previews, continuous rows, logo rows, menu, and dialogs.
email-designs.js: One editable email collection shared by both showcases.
client-logos.js: One editable client logo collection.
social-links.js: LinkedIn, Instagram, and YouTube profile URLs.
assets/emails/: 12 unique approved email designs and lightweight WebP previews.
assets/clients/: 26 approved client logos.
assets/: Vector brand mark and SVG, PNG, ICO, and Apple favicon formats.
netlify.toml: Future Netlify configuration, root publish directory, no build.

CURRENT PALETTE
Primary #012E33. Warm off-white #F3F5F4. Lime #D2EF23.
HTML and CSS declare color-scheme: only light. Normal device dark mode does not
switch the page colors. Extensions and user accessibility overrides can still
change appearance. Visitor accessibility settings are preserved.

EMAIL SHOWCASES
The hero now contains only centered text and its two actions.
A FEEL FOR THE CREATIVE and THE DESIGN STUDIO use exactly the same component.
Both show the full collection, split into two distinct sets of six emails.
Top moves left and bottom moves right. Each group has an identical continuation
for a seamless loop; the sets are repeated in the second showcase as requested.
Images keep their own proportions. Lightweight WebP files are used in the rows;
full PNGs load when selected. Fixed preview windows show the top initially.
Hover pauses that horizontal row and scrolls only the chosen email to its bottom.
The travel and duration are based on that image's own height and the card width.
Moving away returns the image to its top. Click or tap opens the full email.
Email rows pause on hover or keyboard focus. No pause buttons are displayed.
Keyboard focus uses a stationary scrollable row. Reduced motion disables the
automatic horizontal and hover movement; full-image dialogs still work.

The new ZIP supplied six new designs and a higher-resolution copy of Arrow Town
Customer favorites. That copy replaces the earlier image rather than duplicating
the same design. New large originals were resized proportionally to 900 px wide
for the website. The uploaded archive remains the master source.

ADD AN EMAIL
Copy a full-length image to assets/emails/, then add one entry in the array in
email-designs.js, with commas between entries:
{ title: 'Welcome email', brand: 'New Brand', file: 'assets/emails/new-email.png' }
Optional width and height must be the image's actual pixel dimensions.
Any image height is supported. Both sections update from the same list.

LOGO ROWS
26 distinct brands are split into 13 per row. Top left; bottom right. Colors are
applied at display time. Some additional originals have compact web copies.
Hover-to-pause and reduced motion are supported; no pause buttons are shown. Source brands are not repeated
between rows. Hidden continuation copies provide seamless wraparound.

ADD A CLIENT
Copy a transparent logo to assets/clients/, then add an entry in client-logos.js:
{ name: 'New Brand', file: 'assets/clients/new-brand.png' }
Optional size: 'wide' or 'compact'. Use treatment: 'white-knockout' for a dark
logo on a solid white background. Additional logos are split automatically.

BEFORE LAUNCH
This is an unpublished draft. Reviews, results, founder video, team details,
pricing, service promises, policies, contact details, and booking still need
confirmation. Keep the draft banner and noindex until the site is ready.
The decorative founder image and sample results remain placeholders because
their final assets have not been supplied. Approved emails and logos are live.

LATER
Connect the files to GitHub, then Netlify, then the custom domain. No server or
database is required for the current draft.

CTA AND FOOTER UPDATE
Founder story text, video area, and audit button are centered.
Booking actions use stronger contrast, larger hit areas, a soft highlight, and
subtle brand-color movement. Reduced motion disables the animated effects.
All logo and email pause buttons have been removed. Hover, keyboard browsing,
and device reduced motion still manage animation without those buttons.

SOCIAL PROFILE LINKS
The footer now has LinkedIn, Instagram, and YouTube vector logos.
Paste the agency's actual profile URLs into social-links.js. No profile URLs
were supplied, so the current icons open a clearly labeled draft notice.
Once a valid http/https URL is present, that icon becomes a normal external link.
All icons have accessible labels and visible keyboard focus.


NOVEMBER 1, 2026 UPDATE
Copy, brand fonts, palette, logo, and favicon have been updated.
brand.css contains the new brand system and self-hosted font declarations.
See CONTENT_REVIEW.md for remaining content, figure verification, and salary sources.
The website remains a review draft. The existing logos and email collections
remain editable in client-logos.js and email-designs.js.
