# Examples

## Find Mounted Secrets

The `find-secrets.yml` rule identifies all `--mount=type=secret` usages in a Dockerfile.

### Usage

Extract secret IDs from any Dockerfile (works with or without extension):

```bash
./examples/extract-secret-ids.sh path/to/Dockerfile
# Output:
# pipconf
# uvtoml
```

Scan with rich output:

```bash
cat examples/Dockerfile | sg scan -r examples/find-secrets.yml --stdin
```

### Note on File Extensions

ast-grep's custom language support requires file extensions for automatic language detection. Files named `Dockerfile` (without extension) must be processed via `--stdin`:

```bash
# This works:
cat Dockerfile | sg run -l dockerfile -p 'FROM $X' --stdin

# This won't match (no extension):
sg run -l dockerfile -p 'FROM $X' Dockerfile

# This works (has .dockerfile extension):
sg run -l dockerfile -p 'FROM $X' app.dockerfile
```

The `extract-secret-ids.sh` script handles this automatically by using stdin.

### Sample Output

```
note[find-mounted-secrets]: Secret mount found
  ┌─ STDIN:6:5
  │
6 │     --mount=type=secret,id=pipconf,target=/root/.config/pip/pip.conf \
  │     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  │
  = Ensure this secret is properly managed and not exposed in build cache
```
