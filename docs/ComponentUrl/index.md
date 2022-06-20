---
nav:
  title: 组件路径
  order: 3
---

# 组件路径

#### 依赖中组件与主项目组件的对应关系

```js
NewSearchArea as SearchArea,  // "components/common/search-area"
SearchArea, //  components/Widget/search-area
SearchAreaLov,  //  widget/search-area-lov
Table, //  widget/table
CustomTable, // components/Widget/custom-table
ProTable, // components/Widget/pro-table
EditTable, // components/Widget/Template/edit-table
DivideContent, // components/DivideContent/index

ListSelector, //  components/common/lov/list-selector
Lov, //  components/common/lov 或  widget/Template/lov
InputLanguage, //  components/Widget/Template/input-language
CodeInput, // components/Widget/Template/code-input
CustomAmount, // components/Widget/custom-amount
Cascader, //
CustomSwitch, // src\components\Widget\custom-switch.js
InputNumber, // src\components\Widget\Template\input-number
SelectPartLoad, // src\components\Widget\Template\select-part-load

PolicyTips, // src\components\Widget\policy-tips.js
VoucherTable, // src\components\Widget\voucher-table.js
BudgetTips, // src/components/Widget/budget/budget-check-message.js
BudgetProgressDetail, // src\components\Widget\budget\budget-progress-detail.js
BatchDownloadAttachments, //  src\components\Widget\batch-download-attachments
SelectApplicationType, // src\components\Widget\select-application-type.js
transformSelectRows, // src\components\Widget\batch-download-attachments\utils.tsx
filterAndSetSortIndex, // src\components\Widget\batch-download-attachments\utils.tsx
AttachmentsWrap, // src\components\Widget\batch-download-attachments\attachments-wrap.js

CommonImporter, //  widget/Template/common-import/index.js
SlideFrame, // components/Widget/slide-frame
SlideFrameSubtitle, // components/Widget/slide-frame-subtitle.js
CustomCollapse, // components/Widget/Template/custom-collapse
PrintButton,//  components/Widget/print-btn.js
ExcelExporter, // components/Widget/excel-exporter.js
BasicInfo, // components/Widget/basic-info.js

Upload, // src\components\Widget\upload.js
UploadButton, //  components/Widget/upload-button
UploadFileList,  // components/Widget/upload-file-list
UploadByType, // src\components\Widget\upload-by-type.js
ImagePriview, // 新：src/components/Widget/file-preview/index.js  旧：src\components\Widget\Template\image-priview.js
ZipFileView, // 新：src/components/Widget/file-preview/zip-preview.js 旧：widget/image-priview 或 src\components\Widget\image-priview.js
DocumentBasicInfo, // widget/Template/document-basic-info
DocumentSubmitBtn, // components/Widget/doc-submit-btn-wfl
ApproveHistory, // components/Widget/Template/approve-history-work-flow.js
ApprovalFlowPreview, // src/components/Widget/Template/approval-flow-preview/index.js
RzhImg, // src/components/Widget/file-preview/rzh-img.js
```
