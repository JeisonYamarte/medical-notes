## Plan: Backend Safety and Cleanup

Priorizaré primero la estabilidad del backend y la seguridad, sin tocar UI/UX. La estrategia es corregir una sola fuente de verdad para autenticación/validación, cerrar los huecos de autorización por recurso, y luego limpiar redundancias en servicios y rutas para que las capas queden separadas y no se pisen entre sí.

**Steps**
1. Phase 1: lock down auth and data integrity foundations.
   - Correct the user schema typo in [src/model/user.ts] so required fields are enforced reliably.
   - Decide and keep one hashing path for passwords: preserve the existing pre-save hash hook or move hashing to signup, but do not duplicate it.
   - Normalize email handling consistently across signup, auth lookup, and OAuth flows.
   - Tighten [src/lib/auth.ts] so credential errors do not reveal whether an email exists, and ensure Google sign-in does not create duplicate users.
   - Make signup return predictable validation and duplicate-email responses.
   - Depends on no other step; this is the first slice because it affects all downstream auth and ownership checks.

2. Phase 2: enforce authorization on every user-owned resource.
   - Add session checks and owner checks to [src/app/api/notes/[id]/route.ts] for GET, PUT, and DELETE.
   - Add authorization to [src/app/api/users/route.ts] or remove public access if the endpoint is only for internal/admin use.
   - Align note and PDF access rules so a user can only read, update, or delete their own records.
   - This phase depends on Phase 1 because it relies on stable session identity and user id handling.

3. Phase 3: normalize request validation and API response shapes.
   - Strengthen [src/utils/validateRequest.ts] so it returns a consistent schema-validation result that all routes can reuse.
   - Standardize 400, 401, 404, and 500 responses across auth, notes, PDF, and users routes.
   - Validate pagination and query params in [src/app/api/notes/route.ts] before calling the service layer.
   - Make route handlers return HTTP responses directly and keep business logic out of them where possible.
   - This can run partly in parallel with Phase 2 once the auth decisions are fixed, but response-format changes should stay consistent across the touched routes.

4. Phase 4: remove service-layer coupling and duplicate transport logic.
   - Refactor [src/service/notesService.ts] and [src/service/pdfService.ts] so they return domain data or typed results instead of NextResponse objects.
   - Keep HTTP mapping inside the route handlers or a small shared response helper.
   - Remove duplicated fetch/parse patterns from [src/app/dashboard/page.tsx] by reading from the cleaned service contract.
   - This phase depends on Phase 3 so the new service contract can match the standardized route behavior.

5. Phase 5: harden PDF and embedding flow.
   - Review [src/service/pdfService.ts], [src/service/chromaService.ts], and [src/service/cloudinaryService.ts] for error propagation and ownership checks.
   - Make deletion and embedding steps fail loudly and consistently instead of swallowing errors.
   - Ensure PDF processing state is updated predictably so partially processed files are visible and retryable.
   - Keep Chroma cleanup and Cloudinary deletion in a deterministic order.
   - This depends on Phase 2 because PDF operations also require ownership enforcement.

6. Phase 6: clean up redundant or misleading code paths.
   - Remove unused imports, commented leftovers, and unused local variables in route and page files.
   - Fix confusing naming and schema file inconsistencies such as the auth schema filename typo.
   - Revisit index coverage in [src/model/note.ts], [src/model/pdf.ts], and [src/model/user.ts] only after the security and validation work is stable.
   - This can be done after the earlier phases without changing behavior.

**Relevant files**
- [src/model/user.ts] — required flags, password hashing hook, email normalization, schema correctness.
- [src/lib/auth.ts] — credential auth, Google provider behavior, session token shape, error handling.
- [src/app/api/auth/signup/route.ts] — signup validation, duplicate-email handling, password persistence path.
- [src/app/api/notes/route.ts] — request param validation, session gating, pagination defaults.
- [src/app/api/notes/[id]/route.ts] — per-resource authorization for read/update/delete.
- [src/app/api/users/route.ts] — access policy for user listing.
- [src/app/api/pdf/route.ts] — PDF list response flow.
- [src/service/notesService.ts] — note query logic, paging, response contract.
- [src/service/pdfService.ts] — PDF metadata, list, deletion, extraction, ownership and error flow.
- [src/service/chromaService.ts] — embedding search/add/delete, user scoping.
- [src/service/cloudinaryService.ts] — upload/delete behavior and error propagation.
- [src/utils/validateRequest.ts] — shared request parsing and schema validation.
- [src/lib/schemas/userSchema.ts], [src/lib/schemas/noteSchema.ts], [src/lib/schemas/pdfSchema.ts] — validation rules and normalization.
- [src/app/dashboard/page.tsx] — consumer of service-layer responses; update only after service contract is clarified.

**Verification**
1. After Phase 1, verify signup rejects duplicates, stores passwords once, and session identity is populated correctly in login flows.
2. After Phase 2, verify a user cannot read, update, or delete another user’s note or PDF.
3. After Phase 3, verify invalid payloads and invalid query params return consistent 400 responses and missing auth returns 401.
4. After Phase 4, verify dashboard and API consumers still receive the expected data shape after the service refactor.
5. After Phase 5, verify a PDF upload/delete flow leaves the system in a predictable state when extraction, embedding, or Cloudinary deletion fails.
6. Run the project’s TypeScript and lint checks, then a targeted endpoint smoke test for auth, notes, users, and pdf routes.

**Decisions**
- UI/UX is intentionally excluded from this pass.
- Authorization will be ownership-based for notes and PDFs, not just session-based.
- One hashing strategy must remain the single source of truth to avoid double hashing.
- Service functions should become transport-agnostic so route handlers own HTTP responses.
- Public exposure of the users endpoint should be removed unless there is a confirmed admin use case.

**Further Considerations**
1. If the project needs admin-only user listing, do you want a role field added now or should that be deferred and the endpoint removed for the moment?
2. If you prefer, the next implementation wave can start with Phase 1 and Phase 2 only, then stop for validation before touching services.
