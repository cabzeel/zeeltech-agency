# Zeeltech Agency Backend API

A robust RESTful API built with Express.js, MongoDB, and JWT authentication following the MVC architecture.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Email**: Nodemailer (Gmail)
- **Security**: Helmet, CORS

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

3. Run in development:
   ```bash
   npm run dev
   ```

---

## API Reference — Base URL: `/api/v1`

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/login` | Public | Login |
| POST | `/auth/logout` | Private | Logout |
| POST | `/auth/forgot-password` | Public | Request reset email |
| PUT | `/auth/reset-password/:token` | Public | Reset password |
| GET | `/auth/me` | Private | Get current user |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users` | Private | Get all users |
| POST | `/users` | Private | Create user |
| GET | `/users/:id` | Private | Get single user |
| PUT | `/users/:id` | Private | Update user |
| DELETE | `/users/:id` | Private | Delete user |
| PUT | `/users/update-password` | Private | Change password |

### Roles
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/roles` | Private | Get all roles |
| POST | `/roles` | Private | Create role |
| GET | `/roles/:id` | Private | Get single role |
| PUT | `/roles/:id` | Private | Update role |
| DELETE | `/roles/:id` | Private | Delete role |

### Blogs
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/blogs` | Public | Get all blogs (pagination, filter, search) |
| POST | `/blogs` | Private | Create blog |
| GET | `/blogs/:id` | Public | Get blog by ID (increments views) |
| GET | `/blogs/slug/:slug` | Public | Get blog by slug |
| PUT | `/blogs/:id` | Private | Update blog |
| DELETE | `/blogs/:id` | Private | Delete blog |

### Categories
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/categories` | Public | Get all categories |
| POST | `/categories` | Private | Create category |
| GET | `/categories/:id` | Public | Get category |
| PUT | `/categories/:id` | Private | Update category |
| DELETE | `/categories/:id` | Private | Delete category |

### Comments
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/comments` | Public | Submit comment (status: pending) |
| PUT | `/comments/:id/like` | Public | Like a comment |
| GET | `/comments` | Private | Get all comments |
| GET | `/comments/:id` | Private | Get single comment |
| PUT | `/comments/:id/status` | Private | Approve/reject comment |
| DELETE | `/comments/:id` | Private | Delete comment |

### Contacts
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/contacts` | Public | Submit contact form |
| GET | `/contacts` | Private | Get all messages |
| GET | `/contacts/:id` | Private | Get single message (marks as read) |
| PUT | `/contacts/:id/status` | Private | Update status |
| POST | `/contacts/:id/reply` | Private | Reply via email |
| DELETE | `/contacts/:id` | Private | Delete message |

### Notifications
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/notifications` | Private | Get my notifications |
| PUT | `/notifications/read-all` | Private | Mark all as read |
| DELETE | `/notifications/clear-all` | Private | Delete all |
| PUT | `/notifications/:id/read` | Private | Mark one as read |
| DELETE | `/notifications/:id` | Private | Delete one |

### Services
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/services` | Public | Get all services |
| GET | `/services/slug/:slug` | Public | Get by slug |
| GET | `/services/:id` | Public | Get by ID |
| POST | `/services` | Private | Create service |
| PUT | `/services/reorder` | Private | Reorder services |
| PUT | `/services/:id` | Private | Update service |
| DELETE | `/services/:id` | Private | Delete service |

### Projects
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/projects` | Public | Get all projects (pagination, filter, search) |
| GET | `/projects/slug/:slug` | Public | Get by slug |
| GET | `/projects/:id` | Public | Get by ID |
| POST | `/projects` | Private | Create project |
| PUT | `/projects/reorder` | Private | Reorder projects |
| PUT | `/projects/:id` | Private | Update project |
| DELETE | `/projects/:id` | Private | Delete project |

### Team
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/team` | Public | Get all members |
| GET | `/team/slug/:slug` | Public | Get by slug |
| GET | `/team/:id` | Public | Get by ID |
| POST | `/team` | Private | Add member |
| PUT | `/team/reorder` | Private | Reorder team |
| PUT | `/team/:id` | Private | Update member |
| DELETE | `/team/:id` | Private | Delete member |

### Testimonials
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/testimonials` | Public | Submit testimonial |
| GET | `/testimonials` | Public | Get all (filter by status) |
| GET | `/testimonials/:id` | Private | Get single |
| PUT | `/testimonials/:id/status` | Private | Approve/reject |
| PUT | `/testimonials/:id` | Private | Update |
| DELETE | `/testimonials/:id` | Private | Delete |

### Pricing
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/pricing` | Public | Get all plans |
| GET | `/pricing/:id` | Public | Get single plan |
| POST | `/pricing` | Private | Create plan |
| PUT | `/pricing/reorder` | Private | Reorder plans |
| PUT | `/pricing/:id` | Private | Update plan |
| DELETE | `/pricing/:id` | Private | Delete plan |

### Subscribers
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/subscribers/subscribe` | Public | Subscribe |
| POST | `/subscribers/unsubscribe` | Public | Unsubscribe |
| GET | `/subscribers` | Private | Get all subscribers |
| POST | `/subscribers/send-newsletter` | Private | Send newsletter email blast |
| DELETE | `/subscribers/:id` | Private | Remove subscriber |

---

## Role & Permission System

Roles: `superadmin`, `editor`, `contributor`

Resources: `posts`, `users`, `comments`, `projects`, `services`, `testimonials`

Actions: `create`, `read`, `update`, `delete`

Each role has a `permissions` array with `{ resource, actions[] }` objects.
