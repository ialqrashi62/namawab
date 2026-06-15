from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "NamaMedical ERP API"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "mssql+pyodbc://user:pass@localhost/namamedical?driver=ODBC+Driver+17+for+SQL+Server"

settings = Settings()
