import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('burns', Path(__file__).parents[1] / 'scripts/publish-burns.py')
burns = importlib.util.module_from_spec(spec)
spec.loader.exec_module(burns)


class BurnEvidenceTests(unittest.TestCase):
    def fixture(self, success=True):
        burn = dict(module_id='SubtensorModule', event_id='AlphaBurned', extrinsic_idx=3, attributes=['cold', 'hot', 9007199254740993, 80])
        marker = dict(module_id='SubtensorModule', event_id='AddStakeBurn', extrinsic_idx=3, attributes=dict(netuid=80, hotkey='hot', alpha=9007199254740993, amount=200000000))
        peers = [burn, marker, dict(module_id='System', event_id='ExtrinsicSuccess' if success else 'ExtrinsicFailed')]
        items = [dict(block=42, hash='0xabc', timestamp=1792595400000, eventIndex=i, event=e, sameExtrinsicEvents=peers) for i, e in enumerate(peers[:2])]
        return dict(errors=[], scannedThrough=42, toBlock=42, events=items)

    def test_buyback_counts_alpha_once_and_keeps_tao_separate(self):
        rows = burns.records(self.fixture(), {'80': 'OpenRoboto'})
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]['kind'], 'buyback')
        self.assertEqual(rows[0]['amountRaw'], '9007199254740993')
        self.assertEqual(rows[0]['taoSpentRaw'], '200000000')

    def test_failed_execution_is_not_published(self):
        self.assertEqual(burns.records(self.fixture(False), {}), [])

    def test_recycling_and_emission_events_are_not_burn_records(self):
        scan = self.fixture()
        scan['events'][0]['event']['event_id'] = 'AlphaRecycled'
        self.assertEqual(burns.records(scan, {}), [])

    def test_initialization_is_excluded(self):
        scan = self.fixture()
        scan['events'][0]['event']['extrinsic_idx'] = None
        self.assertEqual(burns.records(scan, {}), [])

    def test_incomplete_scan_cannot_be_published(self):
        scan = self.fixture()
        scan['errors'] = [{'start': 41, 'end': 42}]
        with self.assertRaises(ValueError):
            burns.records(scan, {})


if __name__ == '__main__':
    unittest.main()
