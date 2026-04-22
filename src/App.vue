<script setup lang="ts">
import { ref, onMounted, onUnmounted, h, computed } from "vue";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { listen } from "@tauri-apps/api/event";
import {
  NConfigProvider, NGlobalStyle, darkTheme,
  NCard, NButton, NSpace, NInput, NSelect, NDynamicTags, NLog,
  NProgress, NText, useOsTheme, NLayout,
  NForm, NFormItem, NGrid, NGridItem,
  NDataTable, NModal, NIcon, NTooltip
} from "naive-ui";

const osTheme = useOsTheme();
const theme = ref(osTheme.value === 'dark' ? darkTheme : null);

// Configuration state
interface FileInfo {
  path: string;
  name: string;
  extension: string;
  size_bytes: number;
}
const selectedFiles = ref<FileInfo[]>([]);
const outputDir = ref<string | null>(null);
const namingRule = ref("excel-sheet-time");
const encoding = ref("GBK");
const sheetFilters = ref<string[]>([]);
const showFilterModal = ref(false);

// UI state
const isConverting = ref(false);
const logs = ref<string>("");

// Progress state
const totalProgress = ref({ current: 0, total: 0 });
const currentFileProgress = ref({ current: 0, total: 0, filename: "" });

// Options
const namingOptions = [
  { label: "Excel名-Sheet名_时间戳.csv", value: "excel-sheet-time" },
  { label: "Sheet名_时间戳.csv", value: "sheet-time" },
  { label: "Excel名-Sheet名.csv", value: "excel-sheet" }
];

const encodingOptions = [
  { label: "GBK", value: "GBK" },
  { label: "UTF-8", value: "UTF-8" }
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
    
    // Update overall progress
    totalProgress.value.total = payload.total_files;
    if (payload.status === "done" && payload.sheet_idx === payload.total_sheets) {
       totalProgress.value.current = payload.file_idx + 1;
    } else {
       totalProgress.value.current = payload.file_idx;
    }
    
    // Update current file progress
    currentFileProgress.value.filename = payload.file_name;
    currentFileProgress.value.total = payload.total_sheets;
    currentFileProgress.value.current = payload.sheet_idx;
  });
});

onUnmounted(() => {
  if (unlistenLog) unlistenLog();
  if (unlistenProgress) unlistenProgress();
});

// Actions
const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const columns = [
  { title: '文件名', key: 'name', minWidth: 150, ellipsis: { tooltip: true } },
  { title: '类型', key: 'extension', width: 80 },
  { title: '大小', key: 'size_bytes', width: 100, render: (row: FileInfo) => formatSize(row.size_bytes) },
  { title: '路径', key: 'path', minWidth: 200, ellipsis: { tooltip: true } },
  { 
    title: '操作', 
    key: 'actions', 
    width: 80, 
    render: (row: FileInfo) => h(NButton, { 
      size: 'small', 
      type: 'error', 
      disabled: isConverting.value,
      onClick: () => removeFile(row.path) 
    }, { default: () => '删除' })
  }
];

const removeFile = (path: string) => {
  selectedFiles.value = selectedFiles.value.filter(f => f.path !== path);
};

const selectFiles = async () => {
  const selected = await open({
    multiple: true,
    filters: [{ name: "Excel", extensions: ["xls", "xlsx", "xlsm"] }]
  });
  
  let paths: string[] = [];
  if (Array.isArray(selected)) {
    paths = selected;
  } else if (selected) {
    paths = [selected];
  }
  
  if (paths.length > 0) {
    const newPaths = paths.filter(p => !selectedFiles.value.some(f => f.path === p));
    if (newPaths.length > 0) {
      const fileInfos: FileInfo[] = await invoke("get_file_info", { paths: newPaths });
      selectedFiles.value = [...selectedFiles.value, ...fileInfos];
    }
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
};

const startConversion = async () => {
  if (selectedFiles.value.length === 0) return;
  isConverting.value = true;
  logs.value = "";
  totalProgress.value = { current: 0, total: selectedFiles.value.length };
  currentFileProgress.value = { current: 0, total: 0, filename: "" };
  
  try {
    await invoke("convert_excel_to_csv", {
      config: {
        files: selectedFiles.value.map(f => f.path),
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

// Computed
const totalPercent = computed(() => {
  if (totalProgress.value.total === 0) return 0;
  return Math.round((totalProgress.value.current / totalProgress.value.total) * 100);
});

const currentPercent = computed(() => {
  if (currentFileProgress.value.total === 0) return 0;
  return Math.round((currentFileProgress.value.current / currentFileProgress.value.total) * 100);
});

</script>

<template>
  <n-config-provider :theme="theme" class="app-provider">
    <n-global-style />
    <n-layout class="app-layout">
      
      <!-- Top Section: Config and File List -->
      <n-card class="top-card" size="small">
        
        <!-- File List Header (Top) -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <n-button type="warning" ghost size="small" @click="showFilterModal = true" :disabled="isConverting">
            设置排除关键字
          </n-button>

          <n-space :size="8">
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button circle size="small" type="primary" @click="selectFiles" :disabled="isConverting">
                  <template #icon>
                    <n-icon>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"></path></svg>
                    </n-icon>
                  </template>
                </n-button>
              </template>
              导入 Excel 文件
            </n-tooltip>
            
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button circle size="small" type="error" ghost @click="clearFiles" :disabled="isConverting || selectedFiles.length === 0">
                  <template #icon>
                    <n-icon>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z"></path></svg>
                    </n-icon>
                  </template>
                </n-button>
              </template>
              清空列表
            </n-tooltip>
          </n-space>
        </div>

        <!-- File Data Table (Middle) -->
        <div class="table-container" style="margin-bottom: 12px; margin-top: 0; height: 160px;">
          <n-data-table
            :columns="columns"
            :data="selectedFiles"
            style="height: 100%;"
            flex-height
            :scroll-x="600"
            size="small"
            virtual-scroll
            striped
          />
        </div>

        <!-- Configuration row (Bottom) -->
        <div style="display: flex; gap: 16px; align-items: stretch; margin-top: 12px;">
          <!-- Left side configs -->
          <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
            <n-form inline label-placement="left" size="small" :show-feedback="false" style="display: flex; gap: 16px;">
              <n-form-item label="命名规则" style="margin: 0; flex-shrink: 0;">
                <n-select v-model:value="namingRule" :options="namingOptions" :disabled="isConverting" style="width: 220px" />
              </n-form-item>
              <n-form-item label="文件编码" style="margin: 0; flex-shrink: 0;">
                <n-select v-model:value="encoding" :options="encodingOptions" :disabled="isConverting" style="width: 100px" />
              </n-form-item>
            </n-form>
            
            <n-form inline label-placement="left" size="small" :show-feedback="false" style="display: flex;">
              <n-form-item label="输出目录" style="margin: 0; flex: 1; min-width: 0;">
                <div style="display: flex; gap: 8px; width: 100%;">
                  <n-input v-model:value="outputDir" readonly placeholder="默认保存至原目录" style="flex: 1;" />
                  <n-button @click="selectOutputDir" :disabled="isConverting">选择</n-button>
                </div>
              </n-form-item>
            </n-form>
          </div>

          <!-- Right side Start Button -->
          <n-button 
            type="success" 
            @click="startConversion" 
            :loading="isConverting"
            :disabled="selectedFiles.length === 0"
            style="flex-shrink: 0; height: auto;"
          >
            开始批量转换
          </n-button>
        </div>
      </n-card>

      <!-- Bottom Section: Progress and Logs -->
      <n-card class="bottom-card" title="任务状态" size="small">
        <div class="progress-section">
          <!-- Total Progress -->
          <div style="margin-bottom: 12px;">
            <n-space justify="space-between" style="margin-bottom: 4px;">
              <n-text strong>总进度</n-text>
              <n-text depth="3">{{ totalProgress.current }} / {{ totalProgress.total }} 文件</n-text>
            </n-space>
            <n-progress 
              type="line" 
              :percentage="totalPercent" 
              :status="isConverting ? 'info' : (totalProgress.total > 0 && totalProgress.current === totalProgress.total ? 'success' : 'default')"
              processing
            />
          </div>

          <!-- Current File Progress -->
          <div>
            <n-space justify="space-between" style="margin-bottom: 4px;">
              <n-text strong>当前处理：<n-text type="primary">{{ currentFileProgress.filename || '等待中...' }}</n-text></n-text>
              <n-text depth="3">{{ currentFileProgress.current }} / {{ currentFileProgress.total }} Sheet</n-text>
            </n-space>
            <n-progress 
              type="line" 
              :percentage="currentPercent" 
              status="default"
              indicator-placement="inside"
            />
          </div>
        </div>

        <!-- Logs -->
        <div class="log-container">
           <n-log :log="logs" />
        </div>
      </n-card>

      <!-- Filter Modal -->
      <n-modal v-model:show="showFilterModal" preset="card" title="Sheet 排除规则设置" style="width: 500px">
        <n-space vertical>
          <n-text depth="3">当 Sheet 名称包含以下任意关键字时，将跳过不转换。输入关键字后按回车添加。</n-text>
          <n-dynamic-tags v-model:value="sheetFilters" :disabled="isConverting" placeholder="例如: 汇总" />
        </n-space>
        <template #footer>
          <n-space justify="end">
            <n-button type="primary" @click="showFilterModal = false">完成</n-button>
          </n-space>
        </template>
      </n-modal>

    </n-layout>
  </n-config-provider>
</template>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  overflow: hidden; /* prevent whole page scroll */
}

body {
  font-family: v-sans, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: var(--n-color);
}

.app-provider {
  height: 100%;
}

.app-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 12px;
  box-sizing: border-box;
  gap: 12px;
  background: transparent;
}

.top-card {
  flex: 0 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.table-container {
  margin-top: 8px;
  border: 1px solid var(--n-border-color);
  border-radius: 4px;
}

.bottom-card {
  flex: 1 1 0; /* Important: this enables it to shrink and grow within remaining space */
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

/* This targets the inner content box of n-card to make it flex correctly */
.bottom-card > .n-card__content {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  overflow: hidden; /* Prevents card content from breaking the flex layout */
  padding-bottom: 12px;
}

.progress-section {
  flex: 0 0 auto;
  margin-bottom: 12px;
}

.log-container {
  flex: 1 1 0;
  overflow-y: auto;
  border: 1px solid var(--n-border-color);
  border-radius: 4px;
  padding: 8px;
  background-color: var(--n-color-modal);
}
</style>