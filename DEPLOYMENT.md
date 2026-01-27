# 🚀 Hướng Dẫn Deploy Project

Hướng dẫn chi tiết để deploy project React + Vite của bạn lên hosting miễn phí.

## 📋 Chuẩn Bị Trước Khi Deploy

### 1. Kiểm tra project build được chưa

```bash
npm run build
```

Nếu build thành công, bạn sẽ thấy folder `dist` được tạo ra.

### 2. Test production build locally

```bash
npm run preview
```

Mở `http://localhost:4173` để xem website production.

---

## 🌐 Các Tùy Chọn Deploy (MIỄN PHÍ)

### Option 1: Vercel (Khuyên Dùng) ⭐

**Ưu điểm:**
- Deploy cực nhanh (1-2 phút)
- Tự động deploy khi push code lên GitHub
- HTTPS miễn phí
- Domain miễn phí: `ten-ban-chon.vercel.app`

**Các bước:**

1. **Tạo tài khoản Vercel**
   - Truy cập: https://vercel.com
   - Sign up bằng GitHub account

2. **Deploy từ GitHub**
   ```bash
   # Push code lên GitHub trước (nếu chưa có)
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO-NAME.git
   git push -u origin main
   ```

3. **Import project trên Vercel**
   - Vào dashboard Vercel → Click "Add New" → "Project"
   - Chọn repository GitHub của bạn
   - Framework Preset: **Vite** (tự động detect)
   - Click **Deploy**

4. **Hoàn tất!**
   - Website sẽ có link: `https://your-project.vercel.app`
   - Mỗi lần push code mới, Vercel tự động deploy!

---

### Option 2: Netlify

**Ưu điểm:**
- Dễ dùng, không cần config
- HTTPS + CDN miễn phí
- Domain: `ten-ban-chon.netlify.app`

**Các bước:**

1. **Tạo tài khoản Netlify**
   - Truy cập: https://netlify.com
   - Sign up bằng GitHub

2. **Deploy bằng cách kéo thả**
   ```bash
   # Build project trước
   npm run build
   ```
   - Vào Netlify dashboard → Kéo folder `dist` vào
   - Hoặc connect với GitHub repository

3. **Config build settings** (nếu dùng GitHub)
   - Build command: `npm run build`
   - Publish directory: `dist`

---

### Option 3: GitHub Pages

**Ưu điểm:**
- Hoàn toàn miễn phí
- Tích hợp với GitHub
- Domain: `username.github.io/repo-name`

**Các bước:**

1. **Cài đặt gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Thêm vào `package.json`**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://USERNAME.github.io/REPO-NAME"
   }
   ```

3. **Cập nhật `vite.config.ts`**
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/REPO-NAME/'  // Thêm dòng này
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Bật GitHub Pages**
   - Vào GitHub repo → Settings → Pages
   - Source: Deploy from branch `gh-pages`
   - Save

---

## ⚙️ Cấu Hình Routing (Quan Trọng!)

Vì project dùng React Router, cần config để routing hoạt động đúng:

### Cho Vercel/Netlify:

Tạo file `public/\_redirects` (Netlify) hoặc `vercel.json` (Vercel):

**`public/_redirects`** (Netlify):
```
/*    /index.html   200
```

**`vercel.json`** (Vercel):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🎯 Khuyến Nghị

| Platform | Deploy Speed | Tự Động Deploy | Dễ Dùng | Khuyên Dùng |
|----------|-------------|----------------|---------|-------------|
| **Vercel** | ⚡⚡⚡ | ✅ | ⭐⭐⭐ | ✅ Best cho React |
| **Netlify** | ⚡⚡ | ✅ | ⭐⭐⭐ | ✅ Rất tốt |
| **GitHub Pages** | ⚡ | ⚠️ Manual | ⭐⭐ | OK cho demo |

---

## 🐛 Troubleshooting

### Lỗi: Build failed
```bash
# Clear node_modules và install lại
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Lỗi: Routing không hoạt động
- Kiểm tra đã thêm file `_redirects` hoặc `vercel.json` chưa

### Lỗi: CSS không load
- Kiểm tra `base` trong `vite.config.ts` đúng chưa

---

## 📝 Checklist Deploy

- [ ] Project build thành công locally (`npm run build`)
- [ ] Test production build (`npm run preview`)
- [ ] Push code lên GitHub
- [ ] Chọn platform deploy (Vercel/Netlify/GitHub Pages)
- [ ] Thêm routing config (`_redirects` hoặc `vercel.json`)
- [ ] Deploy và test website live

---

## 💡 Tips

1. **Environment Variables**: Nếu có API keys, thêm vào platform settings (không commit vào code)
2. **Custom Domain**: Cả 3 platform đều support custom domain miễn phí
3. **Analytics**: Vercel và Netlify có analytics miễn phí
4. **Auto Deploy**: Connect GitHub để tự động deploy khi push code

---

**Chúc bạn deploy thành công! 🎉**
