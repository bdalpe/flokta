FROM node:bookworm-slim AS builder

ARG TARGETARCH

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM alpine AS downloads
ARG TINI_VERSION=v0.19.0
ARG TARGETARCH
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static-${TARGETARCH} /tini
RUN chmod +x /tini

### Final layer
FROM gcr.io/distroless/nodejs20-debian12

COPY --from=downloads /tini /bin/tini

WORKDIR /app
COPY --from=builder /app/dist .

ENTRYPOINT ["/bin/tini", "--", "/nodejs/bin/node"]
CMD ["/app/index.js"]
