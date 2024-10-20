FROM node:18 AS base
WORKDIR /usr/src/app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install --frozen-lockfile --prod

# 复制源代码
COPY src src
COPY tsconfig.json .

# 运行应用
EXPOSE 3000/tcp
CMD ["pnpm", "start"]