from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with validation and type safety."""

    # Database settings
    postgres_host: str = Field(default="localhost", alias="POSTGRES_HOST")
    postgres_port: str = Field(default="5432", alias="POSTGRES_PORT")
    postgres_user: str = Field(default="postgres", alias="POSTGRES_USER")
    postgres_password: str = Field(default="postgres", alias="POSTGRES_PASSWORD")
    postgres_db: str = Field(default="todolist", alias="POSTGRES_DB")

    # Security settings
    secret_key: str = Field(
        default="your-secret-key-change-in-production-min-32-chars",
        alias="SECRET_KEY",
        min_length=32,
    )
    algorithm: str = Field(default="HS256", alias="ALGORITHM")
    access_token_expire_minutes: int = Field(
        default=30, alias="ACCESS_TOKEN_EXPIRE_MINUTES", ge=1, le=1440
    )
    refresh_token_expire_days: int = Field(
        default=7, alias="REFRESH_TOKEN_EXPIRE_DAYS", ge=1, le=30
    )

    # Password validation settings
    password_min_length: int = Field(default=8, alias="PASSWORD_MIN_LENGTH", ge=6, le=128)
    password_require_uppercase: bool = Field(
        default=True, alias="PASSWORD_REQUIRE_UPPERCASE"
    )
    password_require_lowercase: bool = Field(
        default=True, alias="PASSWORD_REQUIRE_LOWERCASE"
    )
    password_require_digits: bool = Field(default=True, alias="PASSWORD_REQUIRE_DIGITS")
    password_require_special: bool = Field(
        default=False, alias="PASSWORD_REQUIRE_SPECIAL"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def database_url(self) -> str:
        """Construct database URL from settings."""
        return (
            f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )


# Global settings instance
settings = Settings()

