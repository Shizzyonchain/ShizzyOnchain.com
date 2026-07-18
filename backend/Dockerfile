FROM python:3.13-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1
RUN groupadd --system app && useradd --system --gid app --home /app app
WORKDIR /app
COPY pyproject.toml README.md ./
COPY app ./app
COPY db ./db
RUN pip install --upgrade pip && pip install .
USER app
CMD ["uvicorn", "app.api:app", "--host", "0.0.0.0", "--port", "8000"]
