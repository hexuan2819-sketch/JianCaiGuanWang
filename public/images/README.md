# 本地静态图片目录 (Public 方式)

这里的图片 **不会** 被 Astro 压缩或处理，它们会原封不动地直接输出到网站根目录。

## 如何使用：
如果你的图片名字叫 `bg-hero.jpg` 并放在 `public/images/hero/bg-hero.jpg`，
你在代码里直接将原本的 `https://images.unsplash.com/...` 替换为绝对路径字符串即可：

```js
// 之前
const backgroundImage = 'https://images.unsplash.com/photo-xxx';

// 之后 (注意最前面要加 / )
const backgroundImage = '/images/hero/bg-hero.jpg';
```

这是替换起来**最简单、最快**的方式。
