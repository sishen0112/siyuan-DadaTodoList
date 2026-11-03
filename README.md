# Dada Todo List (达达清单)

[中文说明](README.zh-CN.md)

A todo list plugin for [SiYuan Note](https://b3log.org/siyuan), ported from the Obsidian plugin [DadaTodoList](https://github.com/sishen0112/obsidian-DadaTodoList).

Stack: Vite + Vue 3 + JavaScript (aligned with the Obsidian version for easy porting).

## Development

```bash
pnpm i
pnpm run dev     # watch build, outputs to ./dada-todo-list-for-siyuan/
pnpm run build   # production build + package.zip
pnpm run link    # symlink the build output into {siyuan workspace}/data/plugins/
```

## License

MIT
