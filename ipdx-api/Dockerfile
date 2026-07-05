# IPDX API image.
#
# NOTE on Oracle 11g: python-oracledb needs THICK mode, which requires the
# Oracle Instant Client inside the image. Uncomment the Instant Client block
# below and provide the client (download from Oracle) when DB_BACKEND=oracle.

FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# --- Oracle Instant Client (needed only for DB_BACKEND=oracle) --------------
# RUN apt-get update && apt-get install -y --no-install-recommends libaio1 unzip curl \
#     && rm -rf /var/lib/apt/lists/*
# COPY vendor/instantclient-basiclite-linux.x64.zip /tmp/ic.zip
# RUN mkdir -p /opt/oracle && unzip /tmp/ic.zip -d /opt/oracle && rm /tmp/ic.zip
# ENV ORACLE_LIB_DIR=/opt/oracle/instantclient_19_24
# ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_19_24

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
