const fs = require("fs");
const path = require("path");

// 思源笔记工作空间路径，可在环境变量 SIYUAN_WORKSPACE 中覆盖
const SIYUAN_WORKSPACE = process.env.SIYUAN_WORKSPACE || "/Users/plover/Documents/myLife_demo_siyuan";

const manifest = require("../plugin.json");
const OUT_DIR = path.join(__dirname, "..", manifest.name); // vite 产物目录 = 插件 id
const target = path.join(SIYUAN_WORKSPACE, "data", "plugins", manifest.name);

if (!fs.existsSync(SIYUAN_WORKSPACE)) {
    console.error(`思源工作空间不存在: ${SIYUAN_WORKSPACE}`);
    process.exit(1);
}
if (!fs.existsSync(path.join(OUT_DIR, "index.js"))) {
    console.error(`产物目录不存在或尚未构建: ${OUT_DIR}`);
    console.error("请先执行 pnpm run dev 或 pnpm run build");
    process.exit(1);
}

fs.mkdirSync(path.dirname(target), { recursive: true });

if (fs.existsSync(target)) {
    const stat = fs.lstatSync(target);
    if (stat.isSymbolicLink()) {
        fs.unlinkSync(target);
    } else {
        console.error(`目标路径已存在且不是软链接: ${target}`);
        process.exit(1);
    }
}

fs.symlinkSync(OUT_DIR, target, "dir");
console.log(`已创建软链接: ${target} -> ${OUT_DIR}`);
console.log(`重启思源后，在 设置 - 集市 - 下载 中启用「${manifest.displayName["zh-CN"]}」`);
