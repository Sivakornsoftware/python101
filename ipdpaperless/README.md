# IPDX — IPD Paperless (Smart Hospital Platform)

Web application สำหรับระบบ **IPD Paperless** (เวชระเบียนผู้ป่วยในแบบไร้กระดาษ)
สร้างด้วย **Next.js (App Router) + TypeScript + Tailwind CSS**

หน้าจอหลักคือ **Ward Census** ที่แสดงภาพรวมเตียงผู้ป่วยของหอผู้ป่วยแบบการ์ด/รายการ
พร้อมระดับความเร่งด่วน (Priority) และงานที่ค้าง (Lab / Consult / Task / Med)

> สถานะปัจจุบัน: ใช้ **ข้อมูลจำลอง (mock)** เพื่อจัด UX/UI ก่อน
> เมื่อ UX/UI ลงตัวแล้ว จึงสลับไปดึงข้อมูลจริงจาก API (FastAPI + Oracle 11g)
> และข้อมูลบางส่วนจาก PostgreSQL ได้ทันทีโดยไม่ต้องแก้โค้ดหน้าจอ

## สถาปัตยกรรม (แหล่งข้อมูล)

```
UI (components)  ->  Data layer (src/lib/api/*)  ->  Mock  หรือ  FastAPI/Postgres
```

- ชั้นข้อมูลทั้งหมดอยู่ที่ `src/lib/api/` และควบคุมโหมดที่ `src/lib/config.ts`
- ตั้งค่า `NEXT_PUBLIC_USE_MOCK=false` เพื่อเปลี่ยนไปเรียก API จริง
  - `NEXT_PUBLIC_API_BASE_URL` — FastAPI (Oracle 11g)
  - `NEXT_PUBLIC_PG_API_BASE_URL` — API ที่ให้ข้อมูลจาก PostgreSQL (ถ้าแยกบริการ)

## เริ่มต้นใช้งาน

```bash
npm install
cp .env.example .env.local   # ปรับค่าได้ตามต้องการ
npm run dev                  # http://localhost:3000  (redirect ไป /ward)
```

คำสั่งอื่น ๆ:

```bash
npm run build    # build production
npm run start    # รัน production build
npm run lint     # ตรวจ ESLint
```

## โครงสร้างโปรเจกต์

```
src/
  app/
    layout.tsx              # root layout + ฟอนต์ไทย (Noto Sans Thai)
    page.tsx                # redirect -> /ward
    (app)/
      layout.tsx            # App shell (Sidebar + Topbar)
      ward/page.tsx         # Ward Census (หน้าหลัก)
      dashboard, round, tasks, consults, orders,
      reports, analytics, alerts, admin  # หน้า placeholder
  components/
    layout/                 # Sidebar, Topbar, AppShell, nav
    ward/                   # StatCard, TrendChart, PatientCard, PatientRow, Legends, WardCensusView
  lib/
    config.ts               # โหมด mock/live + base URL
    types.ts                # โดเมนไทป์ (Bed, Patient, WardCensus, ...)
    priority.ts             # สี/ป้ายระดับความเร่งด่วน (P0–P4)
    pending.ts              # ประเภทงาน/ผล (Lab/Consult/Task/Med/Order/Other)
    datetime.ts             # จัดรูปแบบวันที่/เวลาแบบไทย (พ.ศ.)
    api/
      client.ts             # fetch wrapper + delay จำลอง
      ward.ts               # getWards(), getWardCensus()
      mock/ward.ts          # ข้อมูลจำลองของหอผู้ป่วย
```

## การสลับไปใช้ API จริง (FastAPI + Oracle / PostgreSQL)

1. ตั้งค่าใน `.env.local`:
   ```
   NEXT_PUBLIC_USE_MOCK=false
   NEXT_PUBLIC_API_BASE_URL=http://<fastapi-host>:8000
   # NEXT_PUBLIC_PG_API_BASE_URL=http://<pg-api-host>:8001
   ```
2. ปรับ path ของ endpoint ใน `src/lib/api/ward.ts` ให้ตรงกับ FastAPI จริง
   (ปัจจุบันใช้ `/api/wards/{wardId}/census` เป็นตัวอย่าง)
3. ให้ FastAPI คืน JSON ตามรูปแบบใน `src/lib/types.ts` (`WardCensus`)

โครงสร้าง response ที่คาดหวัง ดูได้จาก `src/lib/api/mock/ward.ts`
