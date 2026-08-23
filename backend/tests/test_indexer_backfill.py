from app.backfill import sample_blocks
from app.retention import prune_raw_price_samples


def test_sample_blocks_fills_gap_at_requested_resolution():
    assert list(sample_blocks(100, 121, 5)) == [105, 110, 115, 120]


def test_sample_blocks_excludes_existing_boundaries():
    assert list(sample_blocks(100, 105, 5)) == []


class RecordingDatabase:
    def __init__(self):
        self.query = None
        self.args = None

    async def execute(self, query, *args):
        self.query = query
        self.args = args
        return "DELETE 42"


async def test_raw_price_retention_is_bounded_and_reports_deleted_rows():
    db = RecordingDatabase()

    deleted = await prune_raw_price_samples(db, 8)

    assert deleted == 42
    assert "DELETE FROM subnet_price_samples" in db.query
    assert db.args == (8,)


async def test_raw_price_retention_never_drops_below_one_day():
    db = RecordingDatabase()

    await prune_raw_price_samples(db, 0)

    assert db.args == (1,)
