# IPDX API (FastAPI)

Backend service สำหรับ **IPDX / IPD Paperless** ทำหน้าที่เป็น **Anti-Corruption Layer**
ดึงข้อมูลจาก HIS เดิม (**Oracle 11g**) แล้วแปลงเป็น JSON รูปแบบสะอาดที่ตรงกับ
contract ของหน้าเว็บ (`ipdpaperless/src/lib/types.ts`)

โครงสร้าง legacy (ชื่อ table/column เดิม) ถูกกักไว้ในชั้น repository เท่านั้น
ส่วนอื่นทำงานกับ Pydantic model ที่ตั้งชื่อชัดเจน

## เริ่มต้น (โหมด mock — ยังไม่ต้องต่อ Oracle)

```bash
cd ipdx-api
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # DB_BACKEND=mock อยู่แล้ว
uvicorn app.main:app --reload --port 8000
```

ทดสอบ:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/wards
curl http://localhost:8000/api/wards/5A/census
```

Swagger docs: http://localhost:8000/docs

## ต่อกับ Oracle 11g (HIS จริง / DB สำรอง)

1. ติดตั้ง **Oracle Instant Client** (จำเป็นเพราะ 11g ต้องใช้ python-oracledb *thick mode*)
2. ตั้งค่าใน `.env`:
   ```
   DB_BACKEND=oracle
   ORACLE_USER=ipdx_ro
   ORACLE_PASSWORD=****
   ORACLE_DSN=host:port/service_name
   ORACLE_LIB_DIR=/opt/oracle/instantclient_19_24
   ```
3. แก้ SQL ให้ตรง schema จริงที่ไฟล์เดียว:
   **`app/repositories/oracle_admission.py`**
   (คง alias `AS xxx` ไว้เหมือนเดิม โค้ด mapping อ้างชื่อ alias เหล่านี้)

## เชื่อมกับหน้าเว็บ

ในโปรเจกต์ `ipdpaperless` ตั้งค่า `.env.local`:

```
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Endpoint ปัจจุบัน

| Method | Path | คืนค่า |
|---|---|---|
| GET | `/health` | สถานะระบบ |
| GET | `/api/wards` | รายการหอผู้ป่วย |
| GET | `/api/wards/{ward_id}/census` | Ward Census (ผู้ป่วยที่ admit อยู่) |

## โครงสร้าง

```
app/
  main.py                       # FastAPI app + CORS + routers + /health
  config.py                     # ตั้งค่าจาก env (.env)
  deps.py                       # เลือก repository (mock/oracle)
  db/oracle.py                  # connection pool (thick mode)
  schemas/ward.py               # Pydantic models (ตรงกับ frontend)
  repositories/
    base.py                     # interface
    mock.py                     # ข้อมูลตัวอย่าง
    oracle_admission.py         # << ใส่ SQL จริงที่นี่
  routers/wards.py              # endpoint
```

## Docker (ทางเลือก)

```bash
docker compose up -d --build
# อัปเดตบ่อย ๆ ทีหลัง:
docker compose up -d --no-deps --build api
```

> การต่อ Oracle ใน Docker ต้องใส่ Instant Client เข้า image ดูบล็อกคอมเมนต์ใน `Dockerfile`
