# NM_ARABIC_DOCS_UTF8 — التوثيق العربي وسلامة الترميز UTF-8

## متى تُستخدم
أي إنشاء أو تعديل لملف توثيق عربي، تقرير، أو محتوى النظام باللغة العربية.

## الهدف
ضمان أن كل التوثيق العربي UTF-8 نظيف، مقروء، بلا تشويه (mojibake).

## قواعد إلزامية
```
UTF8_ONLY: YES — كل الملفات العربية محفوظة بـ UTF-8 بدون BOM
NO_MOJIBAKE: YES — احجب المحارف التالفة الشائعة
CLEAN_ARABIC: YES — لا Latin-1 mis-decode
SHORT_REPORTS: YES — تقارير مختصرة جداول لتقليل التوكنز
EVIDENCE_TABLES: YES — استخدم جداول markdown للأدلة لا فقرات طويلة
DESCRIPTIVE_NAMES: YES — أسماء ملفات وصفية ومنظّمة
```

## محارف Mojibake المحجوبة
```
Ø    (O with stroke — Latin-1 misread of أ ب ت)
Ù    (U with grave — Latin-1 misread)
ï»¿  (BOM ظاهر — UTF-8 BOM مكسور)
?    (U+FFFD — replacement character — ترميز فاشل)
Ã    (Latin-1 misread آخر)
```

## فحص Mojibake السريع
```powershell
# فحص الملفات العربية عن محارف تالفة
Get-Content "path/to/file.md" -Raw | Select-String -Pattern "Ø|Ù|ï»¿|Ã" -AllMatches

# أو في bash
grep -rn --include="*.md" "Ø\|Ù\|ï»¿\|Ã" docs/
```

## هيكل التقرير العربي المُوصى به
```markdown
# عنوان التقرير

## ملخص تنفيذي (3-5 سطور فقط)

## النتائج
| المعيار | النتيجة | الملاحظة |
|---|---|---|
| ... | PASS/FAIL | ... |

## ما تم تنفيذه
- نقطة 1
- نقطة 2

## الإغلاق
production_touched: NO | secrets_printed: NO | PHI_printed: NO
final_status: [STATUS]
```

## أدلة النجاح
- فحص mojibake يُعيد صفر نتائج
- كل ملف عربي يُفتح بشكل صحيح في محرر UTF-8
- لا BOM ظاهر في بداية الملفات

## حالات الحظر
- محارف Ø/Ù موجودة → BLOCKED_ENCODING_AUDIT_FAILED
- BOM ظاهر في ملف → BLOCKED_BOM_DETECTED
- محرف U+FFFD موجود → BLOCKED_REPLACEMENT_CHAR_DETECTED

## صيغة التقرير المختصر
```
ARABIC_DOCS_GATE: PASS/BLOCKED
files_checked: N | mojibake_found: 0/BLOCKED
encoding: UTF-8 clean | BOM: NONE
```
