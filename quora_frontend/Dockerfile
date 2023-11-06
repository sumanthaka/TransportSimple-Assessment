FROM node:18-alpine AS builder

WORKDIR /usr/src/interview_frontend

COPY package*.json ./

RUN npm install --omit=dev --production=true

COPY . .

RUN npx next build

# Stage 2
FROM node:18-alpine

WORKDIR /usr/src/quora_frontend

COPY --from=builder /usr/src/quora_frontend/package*.json ./
COPY --from=builder /usr/src/quora_frontend/next.config.js ./
COPY --from=builder /usr/src/quora_frontend/public ./public
COPY --from=builder /usr/src/quora_frontend/.next ./.next
COPY --from=builder /usr/src/quora_frontend/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]