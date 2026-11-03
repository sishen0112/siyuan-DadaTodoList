# 达达清单 (Dada Todo List)

[English](README.md)

[思源笔记](https://b3log.org/siyuan)任务清单插件，移植自 Obsidian 插件 [DadaTodoList](https://github.com/sishen0112/obsidian-DadaTodoList)。

技术栈：Vite + Vue 3 + 纯 JavaScript（与 Obsidian 版一致，方便移植）。

## 开发

```bash
pnpm i
pnpm run dev     # 监听构建，输出到 ./siyuan-DadaTodoList/
pnpm run build   # 生产构建 + package.zip
pnpm run link    # 将产物目录软链到 {思源工作空间}/data/plugins/
```

开发约定与发布流程见 [docs/思源插件开发与发布备忘.md](docs/思源插件开发与发布备忘.md)。

## 许可

MIT
