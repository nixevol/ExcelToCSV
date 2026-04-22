<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { listen } from "@tauri-apps/api/event";
import {
  NConfigProvider, NGlobalStyle, darkTheme,
  NCard, NButton, NSpace, NInput, NSelect, NDynamicTags, NLog,
  NProgress, NText, useOsTheme, NLayout,
  NForm, NFormItem, NGrid, NGridItem
} from "naive-ui";

const osTheme = useOsTheme();
const theme = ref(osTheme.value === 'dark' ? darkTheme : null);

// Configuration state
const selectedFiles = ref<string[]>([]);
const outputDir = ref<string | null>(null);
const namingRule = ref("excel-sheet-time");
const encoding = ref("GBK");
const sheetFilters = ref<string[]>([]);

// UI state
const isConverting = ref(false);
const logs = ref<string>("");
const fileProgress = ref<Record<string, { current: number, total: number, status: string }>>({});

// Options
const namingOptions = [
  { label: "Excel名-Sheet名_时间戳.csv", value: "excel-sheet-time" },
  { label: "Sheet名_时间戳.csv", value: "sheet-time" },
  { label: "Excel名-Sheet名.csv", value: "excel-sheet" }
];

const encodingOptions = [
  { label: "GBK (兼容老系统)", value: "GBK" },
  { label: "UTF-8 (通用标准)", value: "UTF-8" }
];

// Event listeners
let unlistenLog: () => void;
let unlistenProgress: () => void;

onMounted(async () => {
  unlistenLog = await listen("convert-log", (event: any) => {
    const payload = event.payload;
    const prefix = payload.level === "error" ? "❌ " : payload.level === "warn" ? "⚠️ " : "ℹ️ ";
    logs.value += `${prefix}${payload.message}\n`;
  });

  unlistenProgress = await listen("convert-progress", (event: any) => {
    const payload = event.payload;
    fileProgress.value[payload.file_name] = {
      current: payload.sheet_idx,
      total: payload.total_sheets,
      status: payload.status
    };
  });
});

onUnmounted(() => {
  if (unlistenLog) unlistenLog();
  if (unlistenProgress) unlistenProgress();
});

// Actions
const selectFiles = async () => {
  const selected = await open({
    multiple: true,
    filters: [{ name: "Excel", extensions: ["xls", "xlsx", "xlsm"] }]
  });
  if (Array.isArray(selected)) {
    selectedFiles.value = selected;
    fileProgress.value = {};
  } else if (selected) {
    selectedFiles.value = [selected];
    fileProgress.value = {};
  }
};

const selectOutputDir = async () => {
  const selected = await open({ directory: true });
  if (selected && typeof selected === 'string') {
    outputDir.value = selected;
  }
};

const clearFiles = () => {
  selectedFiles.value = [];
  fileProgress.value = {};
};

const startConversion = async () => {
  if (selectedFiles.value.length === 0) return;
  isConverting.value = true;
  logs.value = "";
  
  try {
    await invoke("convert_excel_to_csv", {
      config: {
        files: selectedFiles.value,
        output_dir: outputDir.value,
        naming_rule: namingRule.value,
        encoding: encoding.value,
        sheet_filters: sheetFilters.value,
      }
    });
  } catch (error) {
    logs.value += `❌ 致命错误: ${error}\n`;
  } finally {
    isConverting.value = false;
  }
};

const getFileStem = (path: string) => {
  const parts = path.split(/[\\/]/);
  const name = parts[parts.length - 1];
  return name.replace(/\.[^/.]+$/, "");
};
</script>

<template>
  <n-config-provider :theme="theme">
    <n-global-style />
    <n-layout style="height: 100vh; padding: 20px;">
      <n-space vertical size="large">
        <n-card title="Excel to CSV Converter" size="huge" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <n-form>
            <n-grid :cols="2" x-gap="24">
              <n-grid-item>
                <n-form-item label="1. 导入文件 (支持多选)">
                  <n-space>
                    <n-button type="primary" @click="selectFiles" :disabled="isConverting">
                      选择 Excel 文件
                    </n-button>
                    <n-button @click="clearFiles" :disabled="isConverting || selectedFiles.length === 0">
                      清空
                    </n-button>
                  </n-space>
                </n-form-item>
                <n-text depth="3" v-if="selectedFiles.length > 0">
                  已选择 {{ selectedFiles.length }} 个文件
                </n-text>
              </n-grid-item>

              <n-grid-item>
                <n-form-item label="2. Sheet 排除关键字 (包含即跳过)">
                  <n-dynamic-tags v-model:value="sheetFilters" :disabled="isConverting" placeholder="输入后按回车，例如: 汇总" />
                </n-form-item>
              </n-grid-item>

              <n-grid-item>
                <n-form-item label="3. 命名规则">
                  <n-select v-model:value="namingRule" :options="namingOptions" :disabled="isConverting" />
                </n-form-item>
              </n-grid-item>

              <n-grid-item>
                <n-form-item label="4. 文本编码">
                  <n-select v-model:value="encoding" :options="encodingOptions" :disabled="isConverting" />
                </n-form-item>
              </n-grid-item>

              <n-grid-item :span="2">
                <n-form-item label="5. 输出目录 (为空则默认同目录)">
                  <n-space style="width: 100%">
                    <n-button @click="selectOutputDir" :disabled="isConverting">选择存放目录</n-button>
                    <n-input v-model:value="outputDir" readonly placeholder="默认将转换后的 CSV 保存至原文件所在目录" style="flex: 1" />
                  </n-space>
                </n-form-item>
              </n-grid-item>
            </n-grid>

            <n-space justify="center" style="margin-top: 24px;">
              <n-button 
                type="success" 
                size="large" 
                @click="startConversion" 
                :loading="isConverting"
                :disabled="selectedFiles.length === 0"
                style="width: 250px; font-weight: bold;"
              >
                开始批量转换
              </n-button>
            </n-space>
          </n-form>
        </n-card>

        <n-grid :cols="2" x-gap="24">
          <n-grid-item>
            <n-card title="任务进度" style="height: 380px; overflow-y: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
               <n-space vertical v-if="selectedFiles.length > 0">
                 <div v-for="file in selectedFiles" :key="file" style="margin-bottom: 8px;">
                    <n-text strong>{{ getFileStem(file) }}</n-text>
                    <n-progress 
                      type="line" 
                      :percentage="fileProgress[getFileStem(file)]?.total ? Math.round((fileProgress[getFileStem(file)]?.current / fileProgress[getFileStem(file)]?.total) * 100) : 0" 
                      :status="fileProgress[getFileStem(file)]?.status === 'done' ? 'success' : (fileProgress[getFileStem(file)]?.status === 'error' ? 'error' : 'default')"
                      indicator-placement="inside"
                      processing
                    >
                      {{ fileProgress[getFileStem(file)]?.current || 0 }} / {{ fileProgress[getFileStem(file)]?.total || '?' }}
                    </n-progress>
                 </div>
               </n-space>
               <n-space justify="center" v-else>
                  <n-text depth="3">暂无处理任务</n-text>
               </n-space>
            </n-card>
          </n-grid-item>
          <n-grid-item>
            <n-card title="运行日志" style="height: 380px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <n-log :log="logs" rows="15" />
            </n-card>
          </n-grid-item>
        </n-grid>

      </n-space>
    </n-layout>
  </n-config-provider>
</template>

<style>
body {
  margin: 0;
  font-family: v-sans, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #f5f6fa;
}
</style>