# مهارة تدقيق تدفّق المريض والاستقبال (Patient Flow Audit)

## Purpose
تدقيق مسارات إدارة المرضى والاستقبال: التسجيل، توليد MRN، كشف التكرار، الملف، التأمين، الوثائق، الموافقات، المواعيد، الطابور، check-in، فتح الزيارة/الـ encounter، الخط الزمني.

## When to Use
عند تدقيق وحدات الاستقبال/المرضى أو رسم تدفّق البيانات السريرية.

## Inputs Needed
مسارات `/api/patients`, `/api/appointments`, `/api/visits`, `/api/queue`؛ نماذج patients/appointments/waiting_queue.

## Procedure
1. تتبّع التسجيل → MRN (فريد لكل tenant؟) → كشف التكرار.
2. افحص الموافقات والوثائق وربط التأمين.
3. تتبّع الموعد → check-in → فتح الزيارة → الـ encounter.
4. تحقّق من عزل tenant ومنع IDOR في كل مسار.

## Safety Rules
قراءة فقط. لا بيانات مرضى حقيقية في التقارير. عزل المستأجر إلزامي في كل استعلام.

## Output Format
أقسام ضمن: `docs/MEDICAL_SCENARIOS_FULL_AR.md`، `docs/MEDICAL_DATA_FLOW_MAP_AR.md`، `docs/MEDICAL_BUSINESS_LOGIC_AUDIT_AR.md` (سيناريوهات + تدفّقات + مخاطر).

## Done Criteria
تدفّق المريض الكامل موثّق بأدلة + سيناريوهات سلبية + اختبارات مطلوبة.
