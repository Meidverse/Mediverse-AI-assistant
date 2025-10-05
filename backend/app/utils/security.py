from datetime import datetime, timedelta
from typing import Any, Dict, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import get_settings

_password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
_settings = get_settings()


def hash_password(password: str) -> str:
    return _password_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return _password_context.verify(plain_password, hashed_password)


def create_access_token(subject: str, expires_delta: Optional[timedelta] = None, **extra_claims: Any) -> str:
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=_settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    payload: Dict[str, Any] = {"sub": subject, "exp": expire}
    payload.update(extra_claims)
    return jwt.encode(payload, _settings.SECRET_KEY, algorithm=_settings.ALGORITHM)


def decode_access_token(token: str) -> Dict[str, Any]:
    try:
        return jwt.decode(token, _settings.SECRET_KEY, algorithms=[_settings.ALGORITHM])
    except JWTError as exc:
        raise ValueError("Invalid authentication token") from exc
