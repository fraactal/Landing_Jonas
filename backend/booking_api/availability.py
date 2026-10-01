from dataclasses import dataclass
from datetime import date, datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo


@dataclass(frozen=True)
class BusyInterval:
    start: datetime
    end: datetime


@dataclass(frozen=True)
class Slot:
    start: datetime
    end: datetime

    @property
    def start_at_iso(self) -> str:
        return to_utc_iso(self.start)

    @property
    def end_at_iso(self) -> str:
        return to_utc_iso(self.end)

    @property
    def display_date(self) -> str:
        local = self.start.astimezone(ZoneInfo(BookingConfig.timezone_name))
        return local.date().isoformat()

    @property
    def display_time(self) -> str:
        local = self.start.astimezone(ZoneInfo(BookingConfig.timezone_name))
        return local.strftime("%H:%M")


@dataclass(frozen=True)
class BookingConfig:
    timezone_name = "America/Santiago"
    duration_minutes: int = 30
    buffer_minutes: int = 15
    minimum_notice_hours: int = 2
    horizon_days: int = 30
    weekdays: tuple[int, ...] = (0, 1, 2, 3, 4)
    windows: tuple[tuple[time, time], ...] = ((time(10, 0), time(13, 0)), (time(15, 0), time(18, 0)))

    @property
    def timezone(self) -> ZoneInfo:
        return ZoneInfo(self.timezone_name)

    @property
    def duration(self) -> timedelta:
        return timedelta(minutes=self.duration_minutes)

    @property
    def buffer(self) -> timedelta:
        return timedelta(minutes=self.buffer_minutes)

    @property
    def minimum_notice(self) -> timedelta:
        return timedelta(hours=self.minimum_notice_hours)

    def horizon_end(self, now: datetime) -> datetime:
        return now.astimezone(timezone.utc) + timedelta(days=self.horizon_days)

    def buffered_interval(self, start: datetime, end: datetime) -> tuple[datetime, datetime]:
        return start - self.buffer, end + self.buffer

    def to_utc_iso(self, value: datetime) -> str:
        return to_utc_iso(value)

    def is_allowed_start(self, start: datetime, *, now: datetime) -> bool:
        local_start = start.astimezone(self.timezone)
        local_end = (start + self.duration).astimezone(self.timezone)
        now_utc = now.astimezone(timezone.utc)

        if start < now_utc + self.minimum_notice:
            return False

        if start > self.horizon_end(now_utc):
            return False

        if local_start.weekday() not in self.weekdays:
            return False

        if local_start.second or local_start.microsecond or local_start.minute not in (0, 30):
            return False

        for window_start, window_end in self.windows:
            if window_start <= local_start.time() and local_end.time() <= window_end and local_start.date() == local_end.date():
                return True

        return False


DEFAULT_CONFIG = BookingConfig()


def utc_now() -> datetime:
    return datetime.now(timezone.utc).replace(microsecond=0)


def to_utc_iso(value: datetime) -> str:
    return value.astimezone(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def parse_google_datetime(value: str) -> datetime:
    if value.endswith("Z"):
        return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(timezone.utc)
    return datetime.fromisoformat(value).astimezone(timezone.utc)


def _candidate_dates(now_local: datetime, config: BookingConfig) -> list[date]:
    start_date = now_local.date()
    return [start_date + timedelta(days=offset) for offset in range(config.horizon_days + 1)]


def _generate_candidate_slots(now: datetime, config: BookingConfig) -> list[Slot]:
    slots: list[Slot] = []
    now_local = now.astimezone(config.timezone)

    for local_date in _candidate_dates(now_local, config):
        if local_date.weekday() not in config.weekdays:
            continue

        for window_start, window_end in config.windows:
            local_start = datetime.combine(local_date, window_start, tzinfo=config.timezone)
            local_window_end = datetime.combine(local_date, window_end, tzinfo=config.timezone)

            while local_start + config.duration <= local_window_end:
                start_utc = local_start.astimezone(timezone.utc)
                end_utc = (local_start + config.duration).astimezone(timezone.utc)
                if config.is_allowed_start(start_utc, now=now):
                    slots.append(Slot(start=start_utc, end=end_utc))
                local_start += config.duration

    return slots


def _overlaps(start: datetime, end: datetime, busy_start: datetime, busy_end: datetime) -> bool:
    return start < busy_end and busy_start < end


def is_slot_available(start: datetime, end: datetime, busy_intervals: list[BusyInterval], *, config: BookingConfig) -> bool:
    buffered_start, buffered_end = config.buffered_interval(start, end)
    return not any(_overlaps(buffered_start, buffered_end, busy.start, busy.end) for busy in busy_intervals)


def compute_available_slots(busy_intervals: list[BusyInterval], *, now: datetime, config: BookingConfig) -> list[Slot]:
    return [slot for slot in _generate_candidate_slots(now, config) if is_slot_available(slot.start, slot.end, busy_intervals, config=config)]