# JY工具站

这是一个零构建静态网站，适合放到 GitHub 仓库，再连接 Cloudflare Pages 自动发布到 `jyyyyy.dpdns.org`。

你不需要会编程。平时主要改 `content` 文件夹里的内容文件。

## 文件是做什么的

- `index.html`：网站页面结构，一般不用改。
- `assets/styles.css`：网站样式，一般不用改。
- `assets/app.js`：搜索、深色模式、内容读取，一般不用改。
- `content/site.json`：网站名称、简介、关于、联系方式。
- `content/plugins.json`：插件库列表。
- `content/posts.json`：文章入口列表。

## 怎么改网站标题和简介

打开 `content/site.json`，修改这些字段：

```json
{
  "siteName": "JY工具站",
  "domain": "jyyyyy.dpdns.org",
  "tagline": "收集、发布和记录好用的小工具。",
  "intro": "这里会陆续放出个人插件、工具使用说明、更新记录和一些折腾经验。"
}
```

注意：

- JSON 里的英文双引号不能删。
- 每一项后面的逗号要保留，最后一项后面不要加逗号。

## 怎么新增一个插件

打开 `content/plugins.json`，复制一整个插件对象，然后改成你的内容：

```json
{
  "name": "我的插件名称",
  "version": "v1.0.0",
  "description": "这里写插件是做什么的，适合谁使用。",
  "platform": "Windows",
  "downloadUrl": "https://example.com/my-plugin.zip",
  "updatedAt": "2026-05-04",
  "tags": ["插件", "工具"]
}
```

`downloadUrl` 可以填：

- GitHub Releases 下载链接
- 网盘分享链接
- 仓库里的安装包文件链接
- 暂时没有下载地址时填 `#`

## 怎么新增一篇文章入口

打开 `content/posts.json`，复制一整个文章对象，然后改成你的内容：

```json
{
  "title": "文章标题",
  "summary": "一句话介绍这篇文章。",
  "date": "2026-05-04",
  "category": "教程",
  "url": "https://example.com/post.html"
}
```

首版只是文章入口列表。如果以后想写完整博客，可以继续升级成 Markdown 博客或接入 CMS。

## 怎么发布到 Cloudflare Pages

1. 在 GitHub 新建一个仓库，例如 `jy-tools-site`。
2. 把这个文件夹里的所有文件上传到仓库。
3. 打开 Cloudflare Dashboard，进入 Pages。
4. 选择连接 GitHub 仓库。
5. 构建设置这样填：
   - Framework preset：None
   - Build command：留空
   - Build output directory：`/`
6. 部署成功后，把自定义域名设置为 `jyyyyy.dpdns.org`。

以后你在 GitHub 网页里改完 `content/*.json` 并提交，Cloudflare Pages 会自动重新发布。

## 本地预览

可以直接双击打开 `index.html`。

如果想更接近线上效果，也可以在这个文件夹运行：

```bash
python3 -m http.server 4173
```

然后打开：

```text
http://127.0.0.1:4173
```
