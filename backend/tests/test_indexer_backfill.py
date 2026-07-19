from app.backfill import sample_blocks


def test_sample_blocks_fills_gap_at_requested_resolution():
    assert list(sample_blocks(100, 121, 5)) == [105, 110, 115, 120]


def test_sample_blocks_excludes_existing_boundaries():
    assert list(sample_blocks(100, 105, 5)) == []
