def sample_blocks(start: int, end: int, step: int) -> range:
    """Return block-pinned market samples inside an exclusive gap."""
    return range(start + step, end, step)
