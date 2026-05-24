# ─── Build (Vite) ─────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Easypanel passa --build-arg VITE_* ; precisam virar ENV antes do vite build
ARG VITE_API_URL
ARG VITE_SISTEMA_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_SISTEMA_URL=${VITE_SISTEMA_URL}

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# ─── Runtime (Nginx) ──────────────────────────────
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# SPA fallback opcional — caso adicione rotas client-side depois
RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / { try_files $uri /index.html; }\n}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
