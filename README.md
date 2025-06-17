# Holiday Gift App

A modern web application for managing gift-giving occasions, tracking gift ideas, and organizing events. Built with Next.js and TypeScript, this app helps you stay organized and thoughtful with your gift-giving throughout the year.

## Features

- 📱 Responsive design that works seamlessly on mobile, tablet, and desktop
- 🌓 Dark and light mode support
- 👥 Manage people in your life and their important dates
- 🎁 Track gift ideas and their status (idea, purchased, given)
- 📅 Organize events and gift-giving occasions
- 📊 Dashboard with overview of your gift-giving status
- ⚡ Real-time updates and smooth animations

## Tech Stack

This application is built using modern web technologies and best practices:

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS for responsive and maintainable styles

## Additional NPM Packages

The application uses several powerful npm packages to enhance functionality:

1. **@headlessui/react** (v2.2.4)
   - Purpose: Provides accessible UI components
   - Used for: Dropdowns, modals, and other interactive components

2. **@tanstack/react-query** (v5.80.7)
   - Purpose: Server state management and data fetching
   - Used for: Caching, background updates, and optimistic updates

3. **@tanstack/react-query-devtools** (v5.80.7)
   - Purpose: Development tools for React Query
   - Used for: Debugging and monitoring queries in development

4. **axios** (v1.9.0)
   - Purpose: HTTP client
   - Used for: Making API requests with better error handling

5. **clsx** (v2.1.1)
   - Purpose: Utility for constructing className strings
   - Used for: Conditional class names and style composition

6. **date-fns** (v4.1.0)
   - Purpose: Date utility library
   - Used for: Date formatting and manipulation

7. **framer-motion** (v12.17.0)
   - Purpose: Animation library
   - Used for: Page transitions and interactive animations

8. **lucide-react** (v0.514.0)
   - Purpose: Icon library
   - Used for: Consistent and customizable icons throughout the app

9. **react-datepicker** (v8.4.0)
   - Purpose: Date picker component
   - Used for: Selecting dates in forms (birthdays, events)

10. **react-hook-form** (v7.57.0)
    - Purpose: Form handling and validation
    - Used for: All form inputs and data submission

11. **react-hot-toast** (v2.5.2)
    - Purpose: Toast notifications
    - Used for: User feedback and error messages

12. **tailwind-merge** (v3.3.1)
    - Purpose: Utility for merging Tailwind CSS classes
    - Used for: Resolving class conflicts and dynamic styling

13. **tailwindcss** (v4)
    - Purpose: Utility-first CSS framework
    - Used for: Styling and responsive design

## API Documentation

### Database Schema

#### People
```typescript
interface Person {
  id: number;
  name: string;
  relationship?: string;
  birthday?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
```

#### Events
```typescript
interface Event {
  id: number;
  name: string;
  event_date: string;
  description?: string;
  event_type?: string;
  recurring?: boolean;
  created_at?: string;
  updated_at?: string;
}
```

#### Gift Ideas
```typescript
interface GiftIdea {
  id: number;
  person_id: number;
  event_id?: number;
  idea: string;
  status: 'idea' | 'purchased' | 'given';
  price_range?: string;
  url?: string;
  description?: string;
  person_name?: string;
  event_name?: string;
}
```

### REST Endpoints

#### People Endpoints
- `GET /api/people` - Get all people
- `GET /api/people/:id` - Get a specific person
- `POST /api/people` - Create a new person
- `PATCH /api/people/:id` - Update a person
- `DELETE /api/people/:id` - Delete a person

#### Events Endpoints
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a specific event
- `POST /api/events` - Create a new event
- `PATCH /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

#### Gift Ideas Endpoints
- `GET /api/gift-ideas` - Get all gift ideas
- `GET /api/gift-ideas/:id` - Get a specific gift idea
- `GET /api/people/:personId/gift-ideas` - Get gift ideas for a person
- `POST /api/gift-ideas` - Create a new gift idea
- `PUT /api/gift-ideas/:id` - Update a gift idea
- `PATCH /api/gift-ideas/:id` - Partially update a gift idea
- `DELETE /api/gift-ideas/:id` - Delete a gift idea

#### Dashboard Endpoints
- `GET /api/dashboard/stats` - Get dashboard statistics

## Design Decisions

The application was designed with user experience and maintainability in mind. Here are some key design decisions:

1. **Component Architecture**: The app uses a modular component structure, separating concerns into reusable UI components, feature-specific components, and layout components. This makes the codebase maintainable and scalable.

2. **API Integration**: I implemented a robust API client using TypeScript interfaces to ensure type safety and better developer experience. The API client handles all data fetching, caching, and error states through TanStack Query.

3. **Responsive Design**: Using Tailwind CSS, I've created a fully responsive layout that adapts to different screen sizes. The mobile-first approach ensures a great experience across all devices.

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd holiday-gift-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with:
```
NEXT_PUBLIC_API_URL=your_api_url
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

This application is configured for deployment on Vercel. The deployment process is automated through GitHub integration.

