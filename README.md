# Anmol Portfolio V2

A modern full-stack portfolio website built with Next.js, TypeScript, MongoDB, Cloudinary, Tailwind CSS, Motion, and a custom admin panel.

The project is designed as a dynamic portfolio system rather than a static website. Portfolio content can be managed from the protected admin dashboard without editing source code.

## Features

- Modern responsive portfolio UI
- Fully responsive across mobile, tablet, laptop, desktop, ultrawide, and large displays
- Custom animated interactions and transitions
- Dynamic profile content
- Skills management
- Experience management
- Education management
- Project management
- Achievement management
- Project image galleries
- Resume upload and delivery
- Contact form with MongoDB storage
- EmailJS contact notifications
- Admin message inbox
- Cloudinary media uploads
- Automatic Cloudinary cleanup when media is replaced or deleted
- Admin authentication with signed JWT sessions
- HttpOnly admin session cookies
- Login rate limiting
- Contact form rate limiting
- Honeypot spam protection
- Duplicate message protection
- Public/admin content visibility control
- Dynamic `robots.txt`
- Dynamic `sitemap.xml`

## Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Motion
- Lucide React
- React Icons

### Backend

- Next.js App Router API routes
- MongoDB
- Mongoose
- Zod
- bcryptjs
- jose

### Media

- Cloudinary

### Contact

- MongoDB
- EmailJS

## Project Structure

```text
src/
├── app/
│   ├── admin/
│   ├── api/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── admin/
│   ├── effects/
│   ├── layout/
│   ├── sections/
│   └── ui/
├── hooks/
├── lib/
├── models/
└── schemas/
```

## Main Portfolio Sections

The public portfolio currently follows this structure:

```text
Hero
About
Skills
Experience
Education
Projects
Achievements
Contact
Footer
```

## Admin Dashboard

The protected admin panel allows management of:

```text
Dashboard
Profile
Projects
Skills
Experience
Education
Achievements
Messages
```

Admin routes require a valid authenticated admin session.

## Environment Variables

Create a `.env.local` file in the project root.

```env
MONGODB_URI=

AUTH_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, replace:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

with your real domain, for example:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

Do not commit `.env.local` or production secrets to Git.

## Installation

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

Run:

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

The production build should be tested before deployment.

## MongoDB

The application uses MongoDB through Mongoose.

The database stores:

- Admin user
- Profile information
- Skills
- Experience
- Education
- Projects
- Achievements
- Contact messages
- Contact rate-limit records
- Login rate-limit records

## Cloudinary

Cloudinary is used for:

- Profile images
- Resume PDF
- Project thumbnails
- Project gallery images
- Achievement images

Cloudinary `publicId` values are stored alongside uploaded URLs so replaced and deleted media can be cleaned up automatically.

For resume PDF delivery, the Cloudinary account must allow PDF delivery.

## Authentication

Admin authentication uses:

- bcrypt password hashing
- signed JWT sessions using `jose`
- HttpOnly cookies
- secure cookies in production
- SameSite `lax`
- session expiration
- issuer and audience validation
- login rate limiting

The temporary admin setup API should not exist in production.

## Contact Form Protection

The public contact endpoint includes:

- request validation
- MongoDB persistence
- EmailJS notifications
- honeypot spam protection
- IP-based rate limiting using hashed identifiers
- duplicate message detection

MongoDB is treated as the primary message record. EmailJS is only the notification layer.

## robots.txt

The project uses Next.js metadata routing through:

```text
src/app/robots.ts
```

It allows public pages while blocking crawlers from:

```text
/admin/
/api/
```

The generated file is available at:

```text
/robots.txt
```

## Sitemap

The project uses:

```text
src/app/sitemap.ts
```

The generated sitemap is available at:

```text
/sitemap.xml
```

Currently the sitemap contains the public homepage. Additional public routes can be added later if the portfolio gains dedicated project, article, research, or other pages.

## Deployment Notes

Before deployment:

- Add all production environment variables
- Set `NEXT_PUBLIC_SITE_URL` to the production domain
- Keep `AUTH_SECRET` stable and secure
- Configure MongoDB Atlas production access
- Verify Cloudinary production configuration
- Verify EmailJS production configuration
- Confirm HTTPS is enabled
- Run `npm run build`
- Test admin login/logout
- Test all admin CRUD operations
- Test media uploads and deletion
- Test contact form
- Test `/robots.txt`
- Test `/sitemap.xml`
- Confirm the temporary `/api/admin/setup` route has been deleted

## Security

Important production protections already implemented include:

- Admin-only mutation APIs
- Protected admin dashboard
- Signed session cookies
- Password hashing
- Login rate limiting
- Contact rate limiting
- Spam honeypot
- Input validation with Zod
- MongoDB ObjectId validation on protected resource routes
- Cloudinary server-side credentials
- Cloudinary resource cleanup
- Public content filtering using `isActive`

## Future Improvements

Possible future additions:

- Full SEO metadata
- Open Graph images
- Twitter/X metadata
- Structured data / JSON-LD
- Dedicated project detail pages
- Research/article pages
- Analytics
- Automated tests
- More advanced monitoring and logging

## Author

**Anmol Kumar**

Computer Science Engineer and Web Developer.

## License

This project is intended for the personal portfolio of Anmol Kumar.

Unless explicitly stated otherwise, the source code and portfolio content are not licensed for redistribution or commercial reuse.
