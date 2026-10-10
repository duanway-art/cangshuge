# 藏书阁官网

多语言产品介绍页，部署到 `https://cangshuge.nonoor.com/`。

App Store 描述与 App Store Connect 中使用：

- 隐私政策：https://cangshuge.nonoor.com/privacy
- 用户协议：https://cangshuge.nonoor.com/terms（含《购买条款》）

## 结构

```
website/
  index.html          首页
  privacy/index.html  隐私政策
  terms/index.html    用户协议 + 购买条款
  css/                style.css、legal.css
  js/
    i18n.js           首页四语文案
    lang.js           语言检测与切换
    main.js           首页渲染（App Store 链接在这里）
    legal-content.js  法律文本（脚本生成，勿手改）
    legal-page.js     法律页渲染
  assets/
    app-icon.png、favicon.png、apple-touch-icon.png
    og-<语言>.jpg      分享预览图
    screenshots/<语言>/  zh-Hans / zh-Hant / ja / ko
  CNAME
```

## 本地预览

```bash
cd website
python3 -m http.server 8080
```

打开 http://localhost:8080 ，可用 `?lang=zh-Hant` / `ja` / `ko` 切换语言。

语言优先级：URL `?lang=` → 上次选择 → 浏览器语言 → 简体中文。

## 更新法律文档

隐私政策、用户协议、购买条款直接取自 App 内 `CangShuGe/Views/Study/LegalPages.swift` 及 `Localizable.xcstrings` 的译文。App 内文本改动后运行：

```bash
python3 scripts/generate_legal_web_content.py
```

有译文缺失时脚本会报错退出。

## 更新截图

先用 `市场图/capture.py` 抓取各语言 raw 截图，再：

```bash
python3 scripts/prepare_website_assets.py
```

会把 `市场图/<语言>/raw/*.png` 缩放为官网用的 JPEG，并生成图标与分享预览图。

## 上架后

`APP_STORE_ID` 为空时，下载按钮显示「敬请期待」且不可点击。上架后把 `website/js/main.js` 里的 `APP_STORE_ID` 填成 App Store Connect 中的 Apple ID（纯数字），按钮即变为「App Store 下载」并指向正式产品页。

## 部署

把 `website/` 整个目录上传到站点根目录，保证 `/privacy` 和 `/terms` 能打开（目录索引，或等价 rewrite）。

```bash
rsync -avz --delete website/ user@your-server:/var/www/cangshuge.nonoor.com/
```

Nginx 示例：

```
server {
    server_name cangshuge.nonoor.com;
    root /var/www/cangshuge.nonoor.com;
    index index.html;
    location / { try_files $uri $uri/ =404; }
}
```

GitHub Pages / Cloudflare Pages 直接以 `website/` 为发布目录即可，`CNAME` 已写好。
