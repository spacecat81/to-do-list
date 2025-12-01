import re

from pydantic import ValidationError

from app.config import settings


class PasswordValidationError(ValueError):
    """Custom exception for password validation errors."""

    pass


def validate_password_strength(password: str) -> None:
    """
    Validate password strength according to configured requirements.

    Args:
        password: Password to validate

    Raises:
        PasswordValidationError: If password doesn't meet requirements
    """
    errors: list[str] = []

    if len(password) < settings.password_min_length:
        errors.append(
            f"Password must be at least {settings.password_min_length} characters long"
        )

    if settings.password_require_uppercase and not re.search(r"[A-Z]", password):
        errors.append("Password must contain at least one uppercase letter")

    if settings.password_require_lowercase and not re.search(r"[a-z]", password):
        errors.append("Password must contain at least one lowercase letter")

    if settings.password_require_digits and not re.search(r"\d", password):
        errors.append("Password must contain at least one digit")

    if settings.password_require_special and not re.search(
        r"[!@#$%^&*(),.?\":{}|<>]", password
    ):
        errors.append("Password must contain at least one special character")

    if errors:
        raise PasswordValidationError("; ".join(errors))

