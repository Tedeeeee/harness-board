# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0.0] - 2026-04-10

### Added
- Company homepage (About page) with hero section, value cards, company info, and contact CTA
- Free bulletin board with full CRUD — create, read, update, delete posts
- Post search by title, content, or author with field-selector dropdown
- Pagination (10 posts per page, numbered navigation)
- Password-based post authentication — bcryptjs hash on create, verify on edit/delete
- Soft delete for posts (deletedAt field, filtered from all queries)
- Responsive layout — mobile-friendly with Tailwind CSS
- 404 catch-all page for invalid routes
- Seed script with 18 Korean dummy posts for testing
- Harness development infrastructure (agents, skills, hooks) for automated dev pipeline
- Requirements document and approved design doc from /office-hours session
