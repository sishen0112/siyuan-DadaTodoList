import { Dialog, Notice, Plugin, getFrontend } from "siyuan";
import { createApp } from "vue";
import DemoApp from "./App.vue";
import "./styles/index.css";

const SVG_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`;

export default class DadaTodoListPlugin extends Plugin {

    demoDialog = null;
    vueApp = null;

    onload() {
        const frontend = getFrontend();
        console.log(`dada-todo-list-for-siyuan onload, frontend: ${frontend}`);

        // 顶栏图标按钮（仅桌面端）
        if (frontend !== "mobile") {
            this.addTopBar({
                icon: SVG_ICON,
                title: this.i18n.topBarTitle,
                position: "right",
                callback: () => {
                    this.showDemoDialog();
                },
            });
        }

        // 注册命令，可在设置-快捷键中配置
        this.addCommand({
            langKey: "openDemo",
            hotkey: "",
            callback: () => {
                this.showDemoDialog();
            },
        });
    }

    onLayoutReady() {
        console.log("dada-todo-list-for-siyuan onLayoutReady");
    }

    onunload() {
        // 卸载时清理弹窗与 Vue 应用，保持幂等
        this.closeDemoDialog();
        console.log("dada-todo-list-for-siyuan onunload");
    }

    uninstall() {
        console.log("dada-todo-list-for-siyuan uninstall");
    }

    showDemoDialog() {
        this.closeDemoDialog();
        this.demoDialog = new Dialog({
            title: this.i18n.dialogTitle,
            content: `<div class="dada-demo-dialog"></div>`,
            width: "420px",
            destroyCallback: () => {
                this.vueApp = null;
                this.demoDialog = null;
            },
        });
        // 在弹窗容器上挂载 Vue 应用（与 Obsidian 版 ItemView 挂载方式同思路）
        const container = this.demoDialog.element.querySelector(".dada-demo-dialog");
        this.vueApp = createApp(DemoApp, { i18n: this.i18n });
        this.vueApp.mount(container);
        new Notice(this.i18n.hello, 2000);
    }

    closeDemoDialog() {
        if (this.vueApp) {
            this.vueApp.unmount();
            this.vueApp = null;
        }
        if (this.demoDialog) {
            this.demoDialog.destroy();
            this.demoDialog = null;
        }
    }

    /**
     * 数据持久化示例：后续 DadaTodo 移植时用 loadData/saveData 存配置，
     * 文件级读写必须走内核 API（/api/file/getFile、/api/file/putFile），
     * 禁止直接使用 fs / Electron / Node API。
     */
    async loadSettingsDemo() {
        const data = await this.loadData();
        console.log("loaded data:", data);
        await this.saveData({ version: 1 });
    }
}
