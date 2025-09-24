### apps/backend/.env:
`DATABASE_URL=file:./dev.db`

### apps/frontend/.env:
`API_BASEURL=http://localhost:4000`

### root:
`pnpm install`

### apps/backend/src:
`npx prisma generate`

### apps/backend/prisma:
`npx prisma migrate deploy`

### apps/backend:
`npx prisma validate`,  `npx prisma generate --schema=prisma/schema.prisma`

### apps/frontend:
`npx expo start`
