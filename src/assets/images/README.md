# 本地静态图片目录 (Assets 方式)

这里的图片 **会** 被 Astro 自动压缩、转换为 WebP/AVIF 等现代格式，并且进行性能优化。这是 Astro 官方最推荐的方式。

## 如何使用：
如果你的图片放在 `src/assets/images/hero/bg-hero.jpg`，
你需要通过 **import** 语句把它引入，然后再传给 `<img />` 标签（或 Astro 的 `<Image />` 组件）。

```astro
---
// 1. 先从本地目录引入图片
import bgHero from '../assets/images/hero/bg-hero.jpg';

// 之前使用远程 URL
// const backgroundImage = 'https://images.unsplash.com/photo-xxx';
---

<!-- 2. 将引入的对象直接传给 src -->
<img src={bgHero.src} alt="Hero Background" />
```

**适用场景：** 如果你想极致优化网站的加载速度和图片体积，后期就把图片放这里，并在代码顶部使用 `import` 引入替换。
