# 3li — About Me

صفحة About Me: مقدمة (كمبيوتر ← CMD ← كوكب "Hello World") ← يطلع اسمك ← click to enter ← الصفحة مع فيديو خلفية بالصوت.

## 📁 الملفات

```
index.html
css/style.css
js/config.js   ← عدّل هنا كل شي
js/intro.js    ← أنيميشن الكوكب
js/main.js
assets/
  background.mp4   ← حط فيديو الخلفية بهذا الاسم
  logo.png         ← الشعار (يطلع في التبويب)
```

## ⚙️ التعديل (js/config.js)

| الإعداد | وش يسوي |
|---|---|
| `name` | اسمك اللي يطلع بعد الكوكب وفي الصفحة |
| `tab.texts` | عنوان التبويب، ينكتب حرف حرف |
| `logo` | الشعار |
| `video.src` | مسار فيديو الخلفية (يشتغل تلقائي) |
| `video.volume` | الصوت الابتدائي |
| `box.text` / `box.image` | المربع، نص أو صورة |
| `bio` | النبذة |
| `views` | عدد الزوار (`auto` = حقيقي، `manual` = رقمك) |
| `discord.id` | الآيدي حق حسابك في ديسكورد |
| `intro.mode` | `full` أو `globe` |

## 💬 ربط الديسكورد

1. ادخل سيرفر **Lanyard**: https://discord.gg/lanyard (ضروري عشان تطلع بياناتك)
2. فعّل Developer Mode: Settings ← Advanced ← Developer Mode
3. اضغط كليك يمين على حسابك ← **Copy User ID**
4. حطه في `discord.id`

يطلع النك نيم، الصورة، الحالة (أونلاين/خامل/مشغول)، الكلان تاق، والحالة المخصصة أو اللعبة أو سبوتيفاي.

## 🚀 الرفع على GitHub Pages

1. ارفع كل الملفات على Repository جديد
2. Settings ← Pages ← Branch: `main` / `(root)` ← Save
3. بعد دقيقة يصير موقعك: `https://USERNAME.github.io/REPO`

> الرفع من موقع GitHub يقبل ملفات لين 25MB، فخل الفيديو أصغر من كذا (أو ارفعه بـ git لين 100MB).
