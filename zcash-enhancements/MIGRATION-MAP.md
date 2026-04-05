# Migration Map — Bitcoin → Zcash RPC

This file maps every Bitcoin RPC call found in the source code to its Zcash equivalent.
Use `zcash_rpc.*` (in zcash-enhancements/) as a drop-in replacement.

## RPC Call Mapping

| File | Line | Bitcoin Call | Zcash Equivalent | Shielded? | Notes |
|------|------|-------------|------------------|-----------|-------|
| `src/simplewallet.js` | 18 | `getbalance` | `z_gettotalbalance` | Yes | Returns {transparent, private, total}. Use 'private' for shielded balance. |
| `src/simplewallet.js` | 19 | `getbalance` | `z_gettotalbalance` | Yes | Returns {transparent, private, total}. Use 'private' for shielded balance. |
| `src/webapi.js` | 32 | `getblock` | `getblock` | No | Same RPC — works identically. |
| `src/webapi.js` | 48 | `getbalance` | `z_gettotalbalance` | Yes | Returns {transparent, private, total}. Use 'private' for shielded balance. |
| `static/scripts/wallet.js` | 40 | `getbalance` | `z_gettotalbalance` | Yes | Returns {transparent, private, total}. Use 'private' for shielded balance. |
| `static/scripts/wallet.js` | 123 | `getbalance` | `z_gettotalbalance` | Yes | Returns {transparent, private, total}. Use 'private' for shielded balance. |

## Quick Replace Guide

### `getbalance` → `z_gettotalbalance`

**Returns {transparent, private, total}. Use 'private' for shielded balance.**

```python
# Before (Bitcoin):
result = rpc.call("getbalance", [...])

# After (Zcash shielded):
from zcash_rpc import ZcashRPC
zrpc = ZcashRPC(port=18232)
result = zrpc.z_gettotalbalance(...)
```
