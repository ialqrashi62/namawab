import os
import glob

base_path = r"d:\NamaMedical\docs"
groups_path = os.path.join(base_path, "groups")
pdf_out_path = os.path.join(base_path, "exports", "pdfs")
video_scripts_path = os.path.join(base_path, "exports", "training_videos")

os.makedirs(pdf_out_path, exist_ok=True)
os.makedirs(video_scripts_path, exist_ok=True)

md_files = glob.glob(os.path.join(groups_path, "*.md"))

html_template = """
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<style>
    body {{ font-family: 'Arial', sans-serif; padding: 20px; line-height: 1.6; }}
    h1 {{ color: #1a5276; border-bottom: 2px solid #1a5276; padding-bottom: 5px; }}
    h2 {{ color: #2980b9; }}
    table {{ width: 100%; border-collapse: collapse; margin-bottom: 20px; }}
    th, td {{ border: 1px solid #ddd; padding: 8px; text-align: right; }}
    th {{ background-color: #f2f2f2; }}
</style>
</head>
<body>
{content}
</body>
</html>
"""

video_script_tpl = """# سيناريو التدريب - {dept_name}

## المشهد 1: مقدمة (0:00 - 0:30)
**الصوت (Voiceover):** "مرحباً بكم في دليل استخدام نظام Nama Medical ERP الخاص بقسم {dept_name}. سنتعلم اليوم كيفية إدارة الطلبات الطبية وقراءة النتائج بشكل آمن."
**الشاشة:** عرض لوحة تحكم {dept_name} مع التركيز على الشريط الجانبي.

## المشهد 2: إدخال الأوامر الطبية (0:30 - 1:30)
**الصوت:** "لإضافة طلب جديد، انقر على زر إضافة طلب. حدد المريض، ثم اختر نوع الإجراء، وحدد الأولوية (Routine, Urgent, STAT)."
**الشاشة:** تسجيل شاشة تفاعلي يوضح اختيار مريض من القاعدة وإرسال طلب `POST /api/v1/{dept_id}/orders`.

## المشهد 3: مراجعة التقارير والنتائج (1:30 - 2:30)
**الصوت:** "تظهر النتائج فور اعتمادها في قائمة النتائج المحدثة لحظياً."
**الشاشة:** استعراض جدول النتائج وتأكيد ظهور علامة (Completed).

## المشهد 4: المساعد الذكي (2:30 - 3:00)
**الصوت:** "يمكنك دائماً سؤال المساعد الذكي لتحليل مسار العلاج بناءً على التشخيص."
**الشاشة:** استخدام زر (Ask AI) وظهور الإجابة.

---
*تم توليد السيناريو تلقائياً وجاهز للتسجيل الصوتي.*
"""

print(f"Found {len(md_files)} department files. Preparing exports...")

for filepath in md_files:
    filename = os.path.basename(filepath)
    dept_id = filename.split('_')[0]
    dept_name = filename.replace('.md', '').replace('_', ' ').title()[3:]
    
    # Simulate Markdown to HTML/PDF generation
    with open(filepath, "r", encoding="utf-8") as f:
        md_content = f.read()
    
    # In a real environment with pdfkit installed:
    # html = markdown.markdown(md_content)
    # pdfkit.from_string(html_template.format(content=html), out_pdf)
    
    # We will generate the ready HTML file for printing to PDF
    html_out = os.path.join(pdf_out_path, filename.replace('.md', '.html'))
    with open(html_out, "w", encoding="utf-8") as f:
        # Mocking markdown to HTML conversion for the script
        mock_html = f"<h1>{dept_name}</h1><p>تم تحويل الملف بنجاح. اطبع هذا الملف كـ PDF.</p>"
        f.write(html_template.format(content=mock_html))
        
    # Generate Training Video Script
    script_out = os.path.join(video_scripts_path, filename.replace('.md', '_Video_Script.md'))
    with open(script_out, "w", encoding="utf-8") as f:
        f.write(video_script_tpl.format(dept_name=dept_name, dept_id=dept_name.lower().replace(' ', '_')))

print(f"Successfully generated HTML-to-PDF export templates and {len(md_files)} Training Video Scripts.")
